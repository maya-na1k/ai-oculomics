import Anthropic from '@anthropic-ai/sdk';
import { supabase } from './supabase';
import { validateMedicalCode, getCodeDescription } from '../utils/billingCodes';
import { isOvercharged, analyzeBillCharges } from '../utils/benchmarkData';

const anthropic = new Anthropic({
  apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true // For MVP only - should use backend in production
});

// Main function to analyze a medical bill
export async function analyzeMedicalBill(billId, extractedText) {
  try {
    console.log('Starting AI analysis for bill:', billId);
    
    // Step 1: Extract structured data from the text
    const structuredData = await extractStructuredData(extractedText);
    console.log('Structured data extracted:', structuredData);
    
    // Step 2: Save line items to database
    await saveLineItems(billId, structuredData.line_items);
    
    // Step 3: Run validation checks
    const validationResults = await runValidationChecks(billId, structuredData);
    console.log('Validation complete:', validationResults);
    
    // Step 4: Generate analysis report
    const analysisReport = await generateAnalysisReport(structuredData, validationResults);
    console.log('Analysis report generated');
    
    // Step 5: Save analysis to database
    await saveAnalysis(billId, analysisReport);
    
    // Step 6: Update bill status
    await supabase
      .from('medical_bills')
      .update({
        status: 'analyzed',
        total_charges: structuredData.summary?.total_charges || 0,
        patient_name: structuredData.patient_info?.name || null,
        service_date: structuredData.service_date || null,
        provider_name: structuredData.provider?.name || null,
        account_number: structuredData.patient_info?.account_number || null
      })
      .eq('id', billId);
    
    return {
      success: true,
      analysis: analysisReport
    };
    
  } catch (error) {
    console.error('AI Analysis error:', error);
    
    // Update bill status to error
    await supabase
      .from('medical_bills')
      .update({ status: 'error' })
      .eq('id', billId);
    
    throw error;
  }
}

// Extract structured data using Claude AI
async function extractStructuredData(extractedText) {
  const prompt = `You are a medical billing expert AI. Analyze this medical bill text and extract structured data.

BILL TEXT:
${extractedText}

Extract and return ONLY valid JSON with this exact structure (no markdown, no code blocks, no additional text):
{
  "patient_info": {
    "name": "",
    "dob": "",
    "account_number": ""
  },
  "provider": {
    "name": "",
    "address": ""
  },
  "service_date": "",
  "line_items": [
    {
      "description": "",
      "code": "",
      "code_type": "CPT",
      "quantity": 1,
      "unit_price": 0,
      "total_charge": 0
    }
  ],
  "summary": {
    "total_charges": 0,
    "insurance_paid": 0,
    "patient_responsibility": 0
  }
}

Important rules:
- Use "CPT" for procedure codes, "ICD-10" for diagnosis codes
- All amounts should be numbers without $ or commas
- If a field is not found, use empty string "" or 0 for numbers
- service_date should be YYYY-MM-DD format
- Return ONLY the JSON object, no other text`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const responseText = response.content[0].text;
  
  // Clean the response - remove markdown code blocks if present
  let cleanedText = responseText.trim();
  cleanedText = cleanedText.replace(/```json\n?/g, '');
  cleanedText = cleanedText.replace(/```\n?/g, '');
  cleanedText = cleanedText.trim();
  
  const structuredData = JSON.parse(cleanedText);
  return structuredData;
}

// Save line items to database
async function saveLineItems(billId, lineItems) {
  if (!lineItems || lineItems.length === 0) return;
  
  const itemsToInsert = lineItems.map(item => ({
    bill_id: billId,
    description: item.description || 'Unknown',
    code: item.code || null,
    code_type: item.code_type || null,
    charge_amount: item.total_charge || 0,
    quantity: item.quantity || 1,
    service_date: null // We can enhance this later
  }));
  
  const { error } = await supabase
    .from('bill_line_items')
    .insert(itemsToInsert);
  
  if (error) throw error;
}

// Run validation checks on the bill
async function runValidationChecks(billId, structuredData) {
  const results = {
    flags: [],
    duplicates: [],
    overcharges: [],
    invalidCodes: [],
    totalIssues: 0
  };
  
  if (!structuredData.line_items) return results;
  
  // Check 1: Duplicate charges
  const seenItems = new Map();
  structuredData.line_items.forEach((item, index) => {
    const key = `${item.code}_${item.description}`;
    if (seenItems.has(key)) {
      results.duplicates.push({
        code: item.code,
        description: item.description,
        occurrences: 2
      });
      results.flags.push({
        type: 'duplicate',
        severity: 'high',
        code: item.code,
        message: `Duplicate charge detected: ${item.description}`
      });
    }
    seenItems.set(key, index);
  });
  
  // Check 2: Invalid codes and overcharges
  for (const item of structuredData.line_items) {
    // Validate code
    if (item.code && item.code_type) {
      const validation = validateMedicalCode(item.code, item.code_type);
      if (!validation.valid) {
        results.invalidCodes.push({
          code: item.code,
          type: item.code_type,
          message: validation.message
        });
        results.flags.push({
          type: 'invalid_code',
          severity: 'medium',
          code: item.code,
          message: `Invalid code: ${item.code} - ${validation.message}`
        });
      }
    }
    
    // Check pricing
    if (item.code && item.code_type === 'CPT') {
      const overchargeCheck = isOvercharged(item.code, item.total_charge);
      if (overchargeCheck.isOvercharged) {
        results.overcharges.push({
          code: item.code,
          description: item.description,
          charged: item.total_charge,
          benchmark: overchargeCheck.benchmark,
          percentOver: overchargeCheck.percentOver,
          potentialSavings: overchargeCheck.potentialSavings
        });
        results.flags.push({
          type: 'overcharge',
          severity: 'high',
          code: item.code,
          message: `Charge is ${overchargeCheck.percentOver}% above benchmark`,
          potentialSavings: overchargeCheck.potentialSavings
        });
        
        // Update the line item with flag
        await supabase
          .from('bill_line_items')
          .update({
            flag_type: 'overcharge',
            flag_severity: 'high',
            flag_explanation: overchargeCheck.message
          })
          .eq('bill_id', billId)
          .eq('code', item.code);
      }
    }
  }
  
  results.totalIssues = results.flags.length;
  return results;
}

// Generate final analysis report using AI
async function generateAnalysisReport(structuredData, validationResults) {
  const prompt = `You are a patient advocate AI analyzing a medical bill for potential billing errors.

BILL SUMMARY:
${JSON.stringify(structuredData, null, 2)}

VALIDATION FLAGS FOUND:
${JSON.stringify(validationResults, null, 2)}

Provide a patient-friendly analysis as JSON:
{
  "summary": "Brief 2-3 sentence summary of findings",
  "total_flags": 0,
  "potential_savings": 0,
  "detailed_findings": [
    {
      "issue": "Issue description",
      "impact": "What this means for the patient",
      "recommendation": "What to do about it"
    }
  ],
  "recommendations": [
    "Action item 1",
    "Action item 2"
  ],
  "severity": "low|medium|high"
}

Return ONLY the JSON, no markdown or extra text.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const responseText = response.content[0].text;
  let cleanedText = responseText.trim();
  cleanedText = cleanedText.replace(/```json\n?/g, '');
  cleanedText = cleanedText.replace(/```\n?/g, '');
  cleanedText = cleanedText.trim();
  
  const analysis = JSON.parse(cleanedText);
  
  // Add validation data
  analysis.validation = validationResults;
  
  return analysis;
}

// Save analysis to database
async function saveAnalysis(billId, analysisReport) {
  const { error } = await supabase
    .from('bill_analyses')
    .insert({
      bill_id: billId,
      total_flags: analysisReport.total_flags || 0,
      potential_savings: analysisReport.potential_savings || 0,
      summary: analysisReport.summary || 'Analysis complete',
      detailed_report: analysisReport,
      recommendations: analysisReport.recommendations || []
    });
  
  if (error) throw error;
}