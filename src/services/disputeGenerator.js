import OpenAI from 'openai';
import { supabase } from './supabase';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Generate a professional dispute letter
export async function generateDisputeLetter(billId) {
  try {
    // Fetch bill data
    const { data: bill } = await supabase
      .from('medical_bills')
      .select('*')
      .eq('id', billId)
      .single();

    // Fetch analysis
    const { data: analysis } = await supabase
      .from('bill_analyses')
      .select('*')
      .eq('bill_id', billId)
      .single();

    // Fetch flagged line items
    const { data: flaggedItems } = await supabase
      .from('bill_line_items')
      .select('*')
      .eq('bill_id', billId)
      .not('flag_type', 'is', null);

    // Fetch user profile
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const prompt = `You are a professional patient advocate helping write a formal dispute letter to a hospital billing department.

BILL INFORMATION:
- Provider: ${bill.provider_name || 'Medical Provider'}
- Service Date: ${bill.service_date || 'N/A'}
- Total Charges: $${bill.total_charges || 0}
- Account Number: ${bill.account_number || 'N/A'}

PATIENT INFORMATION:
- Name: ${profile.full_name || 'Patient'}
- Email: ${profile.email}

BILLING ISSUES FOUND:
${JSON.stringify(analysis.detailed_report, null, 2)}

FLAGGED CHARGES:
${JSON.stringify(flaggedItems, null, 2)}

Write a professional, formal dispute letter that:
1. Is addressed properly to the billing department
2. Clearly states the purpose (disputing incorrect charges)
3. Lists specific line items with issues
4. References relevant billing regulations and patient rights
5. Requests itemized review and correction within 30 days
6. Maintains a firm but professional tone
7. Includes placeholder for patient signature and date

Format as a complete letter ready to print and send.
Use proper business letter format.
Do NOT use markdown formatting - use plain text only.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature: 0.3
    });

    const letter = response.choices[0].message.content;

    // Save the letter to database
    const { data: savedLetter, error } = await supabase
      .from('dispute_documents')
      .insert({
        bill_id: billId,
        document_type: 'dispute_letter',
        content: letter
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      letter: letter,
      documentId: savedLetter.id
    };

  } catch (error) {
    console.error('Error generating dispute letter:', error);
    throw error;
  }
}

// Generate email template (shorter version)
export async function generateEmailTemplate(billId) {
  try {
    // Fetch bill data
    const { data: bill } = await supabase
      .from('medical_bills')
      .select('*')
      .eq('id', billId)
      .single();

    // Fetch analysis
    const { data: analysis } = await supabase
      .from('bill_analyses')
      .select('*')
      .eq('bill_id', billId)
      .single();

    const prompt = `Create a professional but concise email to dispute medical billing errors.

BILL INFO:
- Provider: ${bill.provider_name}
- Service Date: ${bill.service_date}
- Total: $${bill.total_charges}
- Account: ${bill.account_number}

ISSUES:
${analysis.summary}

Write a professional email (subject line + body) that:
1. States the purpose clearly
2. Lists key issues briefly
3. Requests review and correction
4. Is polite but firm
5. Is suitable for email (not too long)

Format with:
Subject: [subject line here]
Body: [email content]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature: 0.3
    });

    const email = response.choices[0].message.content;

    // Save the email template
    const { data: savedEmail } = await supabase
      .from('dispute_documents')
      .insert({
        bill_id: billId,
        document_type: 'email_template',
        content: email
      })
      .select()
      .single();

    return {
      success: true,
      email: email,
      documentId: savedEmail.id
    };

  } catch (error) {
    console.error('Error generating email:', error);
    throw error;
  }
}