import { useState } from 'react';
import { generateDisputeLetter, generateEmailTemplate } from '../../services/disputeGenerator';
import { FileText, Mail, Download, Loader2, Copy, CheckCircle } from 'lucide-react';

export default function DisputeLetterGenerator({ billId }) {
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState(null);
  const [email, setEmail] = useState(null);
  const [activeTab, setActiveTab] = useState('letter');
  const [copied, setCopied] = useState(false);

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dispute Tools</h2>
        <p className="text-gray-600">Generate professional dispute letters and emails instantly</p>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={handleGenerateLetter}
          disabled={loading}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-4 rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all transform hover:scale-[1.02] group"
        >
          {loading && activeTab === 'letter' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          )}
          <span>Generate Dispute Letter</span>
        </button>

        <button
          onClick={handleGenerateEmail}
          disabled={loading}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all transform hover:scale-[1.02] group"
        >
          {loading && activeTab === 'email' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
          )}
          <span>Generate Email Template</span>
        </button>
      </div>

      {/* Tabs */}
      {(letter || email) && (
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-6">
            {letter && (
              <button
                onClick={() => setActiveTab('letter')}
                className={`pb-3 px-1 font-semibold transition-colors relative ${
                  activeTab === 'letter'
                    ? 'text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dispute Letter
                {activeTab === 'letter' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                )}
              </button>
            )}
            {email && (
              <button
                onClick={() => setActiveTab('email')}
                className={`pb-3 px-1 font-semibold transition-colors relative ${
                  activeTab === 'email'
                    ? 'text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Email Template
                {activeTab === 'email' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content Display */}
      {activeTab === 'letter' && letter && (
        <div>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => handleDownload(letter, 'dispute-letter.txt')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-4 py-2.5 rounded-xl hover:shadow-md border border-purple-100 font-medium transition-all transform hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => handleCopy(letter)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-4 py-2.5 rounded-xl hover:shadow-md border border-purple-100 font-medium transition-all transform hover:scale-[1.02]"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto custom-scrollbar">
            <div className="font-mono text-gray-800 leading-relaxed">
              {letter}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'email' && email && (
        <div>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => handleDownload(email, 'dispute-email.txt')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2.5 rounded-xl hover:shadow-md border border-blue-100 font-medium transition-all transform hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => handleCopy(email)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2.5 rounded-xl hover:shadow-md border border-blue-100 font-medium transition-all transform hover:scale-[1.02]"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto custom-scrollbar">
            <div className="font-mono text-gray-800 leading-relaxed">
              {email}
            </div>
          </div>
        </div>
      )}

      {!letter && !email && !loading && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents generated yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Click one of the buttons above to generate professional dispute documents based on your bill analysis
          </p>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #9333ea, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
        }
      `}</style>
    </div>
  );
}