import { useState } from 'react';
import { supabase } from '../../services/supabase';
import { extractTextFromFile, cleanExtractedText } from '../../services/ocrService';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { analyzeMedicalBill } from '../../services/aiAnalysisOpenAI';

export default function FileUploader({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or image file (JPG, PNG)');
        return;
      }
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      setProgress(10);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('medical-bills')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setProgress(30);

      // Extract text from the file using OCR
      console.log('Starting OCR extraction...');
      const ocrResult = await extractTextFromFile(file, (ocrProgress) => {
        // Update progress: 30-70% for OCR
        setProgress(30 + Math.round(ocrProgress * 0.4));
      });

      const extractedText = cleanExtractedText(ocrResult.text);
      console.log('OCR extraction complete. Confidence:', ocrResult.confidence);
      console.log('Extracted text preview:', extractedText.substring(0, 200));

      setProgress(75);

      // Create bill record in database with extracted text
      const { data: billData, error: billError } = await supabase
        .from('medical_bills')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_url: filePath,
          status: 'extracted' // Changed from 'uploaded' to 'extracted'
        })
        .select()
        .single();

      if (billError) throw billError;

      setProgress(90);

      // Send to AI for analysis
      console.log('Starting AI analysis...');
      setProgress(92);
      
      await analyzeMedicalBill(billData.id, extractedText);
      console.log('AI analysis complete!');

      setProgress(100);

      // Reset form
      setFile(null);
      setUploading(false);

      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete({
          ...billData,
          extractedText: extractedText,
          ocrConfidence: ocrResult.confidence
        });
      }

      alert(`Bill uploaded and text extracted successfully!\nOCR Confidence: ${Math.round(ocrResult.confidence)}%\nExtracted ${extractedText.length} characters`);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Upload Medical Bill</h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-2">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            {file ? (
              <>
                <FileText className="w-16 h-16 text-blue-500 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <Upload className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  PDF, JPG, or PNG (max 10MB)
                </p>
              </>
            )}
          </label>
        </div>

        {file && !uploading && (
          <button
            onClick={handleUpload}
            className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Upload Bill
          </button>
        )}

{uploading && (
          <div className="mt-6">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <p className="text-sm text-gray-600">
                {progress < 30 ? 'Uploading file...' : 
                 progress < 75 ? 'Extracting text from document...' : 
                 'Saving to database...'} {progress}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}