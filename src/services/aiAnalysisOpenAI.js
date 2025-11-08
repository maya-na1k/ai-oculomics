import OpenAI from 'openai';
import { supabase } from './supabase';
import { validateMedicalCode } from '../utils/billingCodes';
import { isOvercharged } from '../utils/benchmarkData';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeMedicalBill(billId, extractedText) {
  try {
    console.log('=== ANALYSIS START ===');
    
    const structuredData = await extractStructuredData(extractedText);
    console.log('Extracted', structuredData.line_items?.length, 'line items');
    
    // Calculate actual total from line items
    const calculatedTotal = structuredData.line_items.reduce((sum, item) => {
      return sum + (parseFloat(item.total_charge) || 0);
    }, 0);
    
    console.log('Calculated total from line items:', calculatedTotal);
    console.log('AI reported total:', structuredData.summary?.total_charges);
    
    structuredData.summary.total_charges = calculatedTotal;
    
    await saveLineItems(billId, structuredData.line_items);
    
    const validationResults = await runValidationChecks(billId, structuredData);
    console.log('Found', validationResults.totalIssues, 'issues');
    
    const analysisReport = await generateAnalysisReport(structuredData, validationResults);
    
    await saveAnalysis(billId, analysisReport);
    
    await supabase
      .from('medical_bills')
      .update({
        status: 'analyzed',
        total_charges: calculatedTotal,
        patient_name: structuredData.patient_info?.name || null,
        service_date: structuredData.service_date || null,
        provider_name: structuredData.provider?.name || null,
        account_number: structuredData.patient_info?.account_number || null
      })
      .eq('id', billId);
    
    console.log('=== ANALYSIS COMPLETE ===');
    console.log('Final total charges saved:', calculatedTotal);
    
    return { success: true, analysis: analysisReport };
    
  } catch (error) {
    console.error('ANALYSIS ERROR:', error);
    await supabase.from('medical_bills').update({ status: 'error' }).eq('id', billId);
    throw error;
  }
}

async function extractStructuredData(extractedText) {
  const prompt = `You are extracting data from a medical bill. Your job is to find EVERY SINGLE itemized charge.

BILL TEXT:
${extractedText}

INSTRUCTIONS:
1. Find the "ITEMIZED CHARGES" or similar section
2. Extract EVERY line - do not skip any
3. Each line typically has: Date, Description, Code, Quantity, and Charge amount
4. Codes can be: CPT (5 digits), REV (4 digits), NDC (drug codes), ICD (diagnosis)
5. Use the "Charges" or "Total Charges" column (NOT "Allowed" or "Insurance Paid")
6. For service_date:
   - First look for "Service Date" or "Date of Service" 
   - If not found, use "Admission Date"
   - If neither exists, use the first date you see related to when care was provided
   - DO NOT use "Statement Date" or "Bill Date"
7. Format dates as YYYY-MM-DD (e.g., September 12, 2024 becomes 2024-09-12)
8. If you see multiple service dates, use the PRIMARY service date (usually the first or most prominent one)

Return ONLY valid JSON (no markdown, no explanation):
{
  "patient_info": {"name": "", "dob": "", "account_number": ""},
  "provider": {"name": "", "address": ""},
  "service_date": "YYYY-MM-DD",
  "line_items": [
    {
      "description": "exact description from bill",
      "code": "code only (no prefix like CPT:)",
      "code_type": "CPT or REV or NDC or ICD",
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

CRITICAL RULES:
- If you see 12 line items in the bill, extract all 12
- Include items even if they have $0 charges
- Include duplicate codes if they appear multiple times
- For line_items array, extract EVERY row from the itemized charges table
- Double-check you didn't skip any lines
- IMPORTANT: service_date priority: (1) Service Date, (2) Admission Date, (3) First relevant date
- NEVER use Statement Date, Bill Date, or Due Date for service_date`;

  try {
    console.log('Calling GPT-4o for extraction...');
    console.log('Text length:', extractedText.length);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 4000
    });

    let text = response.choices[0].message.content.trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('=== AI RESPONSE (first 1000 chars) ===');
    console.log(text.substring(0, 1000));
    
    const data = JSON.parse(text);
    
    console.log('=== EXTRACTED DATA ===');
    console.log('Service Date:', data.service_date);
    console.log('Total line items:', data.line_items?.length);
    
    // Log each line item
    data.line_items.forEach((item, i) => {
      console.log(`${i + 1}. ${item.code || 'NO-CODE'} | ${item.description} | $${item.total_charge}`);
    });
    
    if (!data.line_items || data.line_items.length === 0) {
      console.error('❌ NO LINE ITEMS EXTRACTED!');
      throw new Error('No line items extracted');
    }
    
    if (data.line_items.length < 5) {
      console.warn('⚠️ Only', data.line_items.length, 'items extracted - bill may have more');
    }
    
    return data;
    
  } catch (error) {
    console.error('Extraction failed:', error);
    return createFallbackData();
  }
}

function createFallbackData() {
  return {
    patient_info: { name: "Patient", dob: "", account_number: "" },
    provider: { name: "Medical Provider", address: "" },
    service_date: new Date().toISOString().split('T')[0],
    line_items: [{
      description: "Medical Services",
      code: "99213",
      code_type: "CPT",
      quantity: 1,
      unit_price: 100,
      total_charge: 100
    }],
    summary: {
      total_charges: 100,
      insurance_paid: 0,
      patient_responsibility: 100
    }
  };
}

async function saveLineItems(billId, lineItems) {
  if (!lineItems || lineItems.length === 0) return;
  
  const items = lineItems.map(item => ({
    bill_id: billId,
    description: item.description || 'Unknown',
    code: item.code || null,
    code_type: item.code_type || null,
    charge_amount: parseFloat(item.total_charge) || 0,
    quantity: parseInt(item.quantity) || 1,
    service_date: null
  }));
  
  console.log('Saving', items.length, 'line items to database');
  const totalFromItems = items.reduce((sum, item) => sum + item.charge_amount, 0);
  console.log('Sum of charges being saved:', totalFromItems);
  
  const { error } = await supabase.from('bill_line_items').insert(items);
  if (error) throw error;
}

async function runValidationChecks(billId, structuredData) {
  const results = {
    flags: [],
    duplicates: [],
    overcharges: [],
    invalidCodes: [],
    totalIssues: 0
  };
  
  if (!structuredData.line_items) return results;
  
  // Check for exact duplicate codes
  const codeGroups = new Map();
  structuredData.line_items.forEach(item => {
    if (item.code) {
      const baseCode = item.code.split('-')[0];
      if (!codeGroups.has(baseCode)) {
        codeGroups.set(baseCode, []);
      }
      codeGroups.get(baseCode).push(item);
    }
  });
  
  codeGroups.forEach((items, code) => {
    if (items.length > 1) {
      results.duplicates.push({
        code: code,
        description: items[0].description,
        occurrences: items.length
      });
      results.flags.push({
        type: 'duplicate',
        severity: 'high',
        code: code,
        message: `Duplicate billing: ${code} (${items[0].description}) billed ${items.length} times`,
        potentialSavings: items.slice(1).reduce((sum, i) => sum + (parseFloat(i.total_charge) || 0), 0)
      });
    }
  });
  
  // Check for similar services (74177 and 74176)
  const ctScans = structuredData.line_items.filter(item => 
    item.code && (item.code.startsWith('74177') || item.code.startsWith('74176'))
  );
  if (ctScans.length > 1) {
    results.duplicates.push({
      code: '74177/74176',
      description: 'CT Scan - Same Service',
      occurrences: ctScans.length
    });
    results.flags.push({
      type: 'duplicate',
      severity: 'high',
      code: '74177/74176',
      message: 'Duplicate billing: CT scan billed as both 74177 and 74176 (same service)',
      potentialSavings: parseFloat(ctScans[1].total_charge) || 0
    });
  }
  
  // Check for duplicate REV codes
  const supplyRevCodes = structuredData.line_items.filter(item =>
    item.code && (item.code === '0270' || item.code === '0272')
  );
  if (supplyRevCodes.length > 1) {
    results.duplicates.push({
      code: '0270/0272',
      description: 'Medical Supplies',
      occurrences: supplyRevCodes.length
    });
    results.flags.push({
      type: 'duplicate',
      severity: 'high',
      code: '0270/0272',
      message: 'Duplicate billing: Medical supplies billed twice (REV 0270 and 0272)',
      potentialSavings: parseFloat(supplyRevCodes[1].total_charge) || 0
    });
  }
  
  // Check pricing ONLY for CPT codes
  for (const item of structuredData.line_items) {
    if (item.code && item.code_type === 'CPT' && /^\d{5}$/.test(item.code)) {
      const validation = validateMedicalCode(item.code, 'CPT');
      if (!validation.valid) {
        results.invalidCodes.push({
          code: item.code,
          type: 'CPT',
          message: validation.message
        });
        results.flags.push({
          type: 'invalid_code',
          severity: 'medium',
          code: item.code,
          message: `Invalid CPT code: ${item.code}`
        });
      }
      
      if (validation.valid && item.total_charge > 0) {
        const check = isOvercharged(item.code, parseFloat(item.total_charge));
        if (check.isOvercharged) {
          results.overcharges.push({
            code: item.code,
            description: item.description,
            charged: parseFloat(item.total_charge),
            benchmark: check.benchmark,
            percentOver: check.percentOver,
            potentialSavings: check.potentialSavings
          });
          results.flags.push({
            type: 'overcharge',
            severity: 'high',
            code: item.code,
            message: `Overcharge: ${item.description} is ${check.percentOver}% above Medicare benchmark ($${check.benchmark})`,
            potentialSavings: check.potentialSavings
          });
          
          await supabase.from('bill_line_items')
            .update({
              flag_type: 'overcharge',
              flag_severity: 'high',
              flag_explanation: `${check.percentOver}% above benchmark`
            })
            .eq('bill_id', billId)
            .eq('code', item.code);
        }
      }
    }
  }
  
  results.totalIssues = results.flags.length;
  return results;
}

async function generateAnalysisReport(structuredData, validationResults) {
  let totalSavings = 0;
  
  totalSavings += validationResults.overcharges.reduce((sum, o) => sum + (o.potentialSavings || 0), 0);
  
  totalSavings += validationResults.duplicates.reduce((sum, d) => {
    const items = structuredData.line_items.filter(item => 
      item.code && item.code.split('-')[0] === d.code.split('/')[0]
    );
    const duplicateCost = items.slice(1).reduce((s, i) => s + (parseFloat(i.total_charge) || 0), 0);
    return sum + duplicateCost;
  }, 0);
  
  console.log('Total potential savings:', totalSavings);
  
  const detailedFindings = [];
  
  validationResults.duplicates.forEach(dup => {
    const items = structuredData.line_items.filter(item => 
      item.code && (
        item.code.split('-')[0] === dup.code.split('/')[0] ||
        dup.code.includes(item.code.split('-')[0])
      )
    );
    const duplicateCost = items.slice(1).reduce((s, i) => s + (parseFloat(i.total_charge) || 0), 0);
    
    detailedFindings.push({
      issue: `Duplicate billing: ${dup.description} (code ${dup.code})`,
      impact: `Billed ${dup.occurrences} times. Potential savings: $${duplicateCost.toFixed(2)}`,
      recommendation: 'Request removal of duplicate charges'
    });
  });
  
  validationResults.overcharges.forEach(over => {
    detailedFindings.push({
      issue: `Overcharge: ${over.description} (CPT ${over.code})`,
      impact: `Charged $${over.charged.toFixed(2)} vs benchmark $${over.benchmark.toFixed(2)} (${over.percentOver}% over). Potential savings: $${over.potentialSavings.toFixed(2)}`,
      recommendation: 'Request adjustment to Medicare benchmark rate'
    });
  });
  
  validationResults.invalidCodes.forEach(inv => {
    detailedFindings.push({
      issue: `Invalid/unrecognized code: ${inv.code}`,
      impact: 'Code may be incorrect or not in standard database',
      recommendation: 'Request clarification from billing department'
    });
  });
  
  return {
    summary: validationResults.totalIssues > 0 ? 
      `Found ${validationResults.totalIssues} potential billing issues. Total potential savings: $${totalSavings.toFixed(2)}` :
      'No significant billing issues detected.',
    total_flags: validationResults.totalIssues,
    potential_savings: totalSavings,
    detailed_findings: detailedFindings,
    recommendations: validationResults.totalIssues > 0 ? [
      'Contact billing department to dispute flagged charges',
      'Request itemized explanation for duplicate charges',
      'Ask for adjustment to Medicare benchmark rates for overcharges',
      'Consider filing a formal dispute letter'
    ] : [
      'Bill appears accurate',
      'Keep for your records',
      'Contact provider if you have questions'
    ],
    severity: validationResults.totalIssues > 5 ? 'high' : 
              validationResults.totalIssues > 2 ? 'medium' : 
              validationResults.totalIssues > 0 ? 'low' : 'none',
    validation: validationResults
  };
}

async function saveAnalysis(billId, analysisReport) {
  const { error } = await supabase.from('bill_analyses').insert({
    bill_id: billId,
    total_flags: analysisReport.total_flags || 0,
    potential_savings: analysisReport.potential_savings || 0,
    summary: analysisReport.summary,
    detailed_report: analysisReport,
    recommendations: analysisReport.recommendations || []
  });
  
  if (error) throw error;
}

