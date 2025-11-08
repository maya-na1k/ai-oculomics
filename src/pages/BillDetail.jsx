import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import BillAnalysisView from '../components/analysis/BillAnalysisView';
import { ArrowLeft, Shield, Loader2 } from 'lucide-react';
import DisputeLetterGenerator from '../components/reports/DisputeLetterGenerator';

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
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">BillBuddy</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="text-sm font-semibold text-gray-900">{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-5 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
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