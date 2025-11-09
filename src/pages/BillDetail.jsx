import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import BillAnalysisView from '../components/analysis/BillAnalysisView';
import { ArrowLeft, Loader2 } from 'lucide-react';
import DisputeLetterGenerator from '../components/reports/DisputeLetterGenerator';

// --- BillBuddyNavLogo Component for Navbar ---
const BillBuddyNavLogo = () => {
  return (
    <div className="flex items-center gap-2">
      {/* Bill Icon with Human and Dollar Sign */}
      <div className="relative w-8 h-8">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Document outline */}
          <path
            d="M20 10 C20 7 22 5 25 5 L65 5 L80 20 L80 90 C80 93 78 95 75 95 L25 95 C22 95 20 93 20 90 Z"
            stroke="#7C3AED"
            strokeWidth="6"
            fill="white"
          />
          
          {/* Folded corner */}
          <path
            d="M65 5 L65 20 L80 20"
            stroke="#7C3AED"
            strokeWidth="6"
            fill="#E9D5FF"
          />
          
          {/* Human icon in upper portion */}
          <circle cx="42" cy="32" r="8" fill="#7C3AED" />
          <path 
            d="M42 42c-6 0-10 3-10 7v4c0 1 1 2 2 2h16c1 0 2-1 2-2v-4c0-4-4-7-10-7z" 
            fill="#7C3AED"
          />
          
          {/* Lines on document */}
          <line x1="30" y1="62" x2="60" y2="62" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="70" x2="60" y2="70" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="78" x2="50" y2="78" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
          
          {/* Dollar sign circle */}
          <circle cx="65" cy="72" r="16" fill="white" stroke="#7C3AED" strokeWidth="3" />
          <text x="65" y="81" fontSize="22" fill="#7C3AED" fontWeight="bold" textAnchor="middle">$</text>
        </svg>
      </div>
      
      {/* Brand Name */}
      <h1 className="text-2xl font-bold text-gray-900">
        Bill<span className="text-purple-600">Buddy</span>
      </h1>
    </div>
  );
};
// -----------------------------------------------------

export default function BillDetail({ user, onLogout }) {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    fetchBill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billId]);

  const fetchBill = async () => {
    const { data } = await supabase
      .from('medical_bills')
      .select('*')
      .eq('id', billId)
      .single();
    
    setBill(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* LOGO IMPLEMENTATION */}
          <BillBuddyNavLogo />
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="text-sm font-semibold text-gray-900">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="border border-purple-500 text-purple-600 px-5 py-2 rounded-full hover:bg-purple-50 transition-all font-medium"
              >
                Logout
              </button>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
      </div>

      {/* Bill Analysis */}
      {bill && bill.status === 'analyzed' ? (
        <>
          <BillAnalysisView billId={billId} />
          <div className="max-w-6xl mx-auto px-6 pb-8">
            <DisputeLetterGenerator billId={billId} />
          </div>
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            {bill?.status === 'processing' || bill?.status === 'extracted' ? (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Analyzing Your Bill
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Our AI is carefully reviewing every line item to detect errors and find potential savings. This usually takes just a few moments...
                </p>
                <div className="mt-8 flex justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Loading Bill Details
                </h2>
                <p className="text-gray-600">
                  Please wait while we fetch your bill information...
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}