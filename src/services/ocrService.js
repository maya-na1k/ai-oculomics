import Tesseract from 'tesseract.js';

// Extract text from image or PDF using OCR
export async function extractTextFromFile(file, onProgress) {
  try {
    // For images (JPG, PNG)
    if (file.type.startsWith('image/')) {
      return await extractTextFromImage(file, onProgress);
    }
    
    // For PDFs, we'll use a different approach
    if (file.type === 'application/pdf') {
      return await extractTextFromPDF(file, onProgress);
    }
    
    throw new Error('Unsupported file type');
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw error;
  }
}

// Extract text from image using Tesseract.js
async function extractTextFromImage(imageFile, onProgress) {
  const result = await Tesseract.recognize(
    imageFile,
    'eng',
    {
      logger: (info) => {
        // Report progress to caller
        if (info.status === 'recognizing text' && onProgress) {
          const progress = Math.round(info.progress * 100);
          onProgress(progress);
        }
      }
    }
  );
  
  return {
    text: result.data.text,
    confidence: result.data.confidence,
    method: 'tesseract-image'
  };
}

// Extract text from PDF
async function extractTextFromPDF(pdfFile, onProgress) {
  // For MVP, we'll convert PDF to image and then OCR
  // This is a simplified approach - in production you'd use pdf.js or similar
  
  try {
    // Read the file as data URL
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          if (onProgress) onProgress(20);
          
          // Use Tesseract to extract from PDF directly
          const result = await Tesseract.recognize(
            e.target.result,
            'eng',
            {
              logger: (info) => {
                if (info.status === 'recognizing text' && onProgress) {
                  const progress = 20 + Math.round(info.progress * 80);
                  onProgress(progress);
                }
              }
            }
          );
          
          resolve({
            text: result.data.text,
            confidence: result.data.confidence,
            method: 'tesseract-pdf'
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsDataURL(pdfFile);
    });
  } catch (error) {
    throw new Error('PDF extraction failed: ' + error.message);
  }
}

// Clean and preprocess extracted text
export function cleanExtractedText(text) {
  if (!text) return '';
  
  // Remove excessive whitespace
  let cleaned = text.replace(/\s+/g, ' ');
  
  // Remove special characters that might interfere
  cleaned = cleaned.replace(/[^\x00-\x7F]/g, '');
  
  // Trim
  cleaned = cleaned.trim();
  
  return cleaned;
}

// Extract structured data patterns from text
export function extractBillPatterns(text) {
  const patterns = {
    dates: [],
    amounts: [],
    codes: [],
    accountNumbers: []
  };
  
  // Extract dates (MM/DD/YYYY or MM-DD-YYYY)
  const dateRegex = /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/g;
  let match;
  while ((match = dateRegex.exec(text)) !== null) {
    patterns.dates.push(match[0]);
  }
  
  // Extract dollar amounts
  const amountRegex = /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
  while ((match = amountRegex.exec(text)) !== null) {
    patterns.amounts.push(match[1].replace(/,/g, ''));
  }
  
  // Extract CPT codes (5 digits)
  const cptRegex = /\b(\d{5})\b/g;
  while ((match = cptRegex.exec(text)) !== null) {
    patterns.codes.push({ code: match[1], type: 'CPT' });
  }
  
  // Extract ICD-10 codes (letter + 2 digits + optional decimal)
  const icdRegex = /\b([A-Z]\d{2}(?:\.\d{1,2})?)\b/g;
  while ((match = icdRegex.exec(text)) !== null) {
    patterns.codes.push({ code: match[1], type: 'ICD-10' });
  }
  
  // Extract account numbers (various formats)
  const accountRegex = /(?:Account|Acct|Account #|Acct #)[\s:]+(\d+)/gi;
  while ((match = accountRegex.exec(text)) !== null) {
    patterns.accountNumbers.push(match[1]);
  }
  
  return patterns;
}