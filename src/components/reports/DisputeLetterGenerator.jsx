import { useState } from 'react';
import { generateDisputeLetter, generateEmailTemplate } from '../../services/disputeGenerator';
import { FileText, Mail, Download, Loader2, CheckCircle } from 'lucide-react';

export default function DisputeLetterGenerator({ billId }) {
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState(null);
  const [email, setEmail] = useState(null);
  const [activeTab, setActiveTab] = useState('letter');

  const handleGenerateLetter = async () => {
    setLoading(true);
    try {
      const result = await generateDisputeLetter(billId);
      setLetter(result.letter);
      setActiveTab('letter');
    } catch (error) {
      alert('Error generating letter: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEmail = async () => {
    setLoading(true);
    try {
      const result = await generateEmailTemplate(billId);
      setEmail(result.email);
      setActiveTab('email');
    } catch (error) {
      alert('Error generating email: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Dispute Tools</h2>
      
      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleGenerateLetter}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading && activeTab === 'letter' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FileText className="w-5 h-5" />
          )}
          Generate Dispute Letter
        </button>

        <button
          onClick={handleGenerateEmail}
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading && activeTab === 'email' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Mail className="w-5 h-5" />
          )}
          Generate Email Template
        </button>
      </div>

      {/* Tabs */}
      {(letter || email) && (
        <div className="border-b mb-4">
          <div className="flex gap-4">
            {letter && (
              <button
                onClick={() => setActiveTab('letter')}
                className={`pb-2 px-1 ${
                  activeTab === 'letter'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-600'
                }`}
              >
                Dispute Letter
              </button>
            )}
            {email && (
              <button
                onClick={() => setActiveTab('email')}
                className={`pb-2 px-1 ${
                  activeTab === 'email'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-600'
                }`}
              >
                Email Template
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content Display */}
      {activeTab === 'letter' && letter && (
        <div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleDownload(letter, 'dispute-letter.txt')}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => handleCopy(letter)}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Copy to Clipboard
            </button>
          </div>
          <div className="bg-gray-50 p-6 rounded border border-gray-200 whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
            {letter}
          </div>
        </div>
      )}

      {activeTab === 'email' && email && (
        <div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleDownload(email, 'dispute-email.txt')}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => handleCopy(email)}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Copy to Clipboard
            </button>
          </div>
          <div className="bg-gray-50 p-6 rounded border border-gray-200 whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
            {email}
          </div>
        </div>
      )}

      {!letter && !email && !loading && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>Click a button above to generate dispute documents</p>
        </div>
      )}
    </div>
  );
}