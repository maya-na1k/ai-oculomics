import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import BillAnalysisView from '../components/analysis/BillAnalysisView';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg relative">
              <FileText className="w-6 h-6 text-white/40 absolute" strokeWidth={2} />
              <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold">BillBuddy</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 hidden md:block">Welcome, <span className="text-white font-medium">{user.email}</span></span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition border border-gray-700"
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
          className="text-purple-400 hover:text-purple-300 transition inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </div>

      {/* Bill Analysis */}
      {bill && bill.status === 'analyzed' ? (
        <>
          <BillAnalysisView billId={billId} />
          <div className="max-w-7xl mx-auto px-6 pb-8">
            <DisputeLetterGenerator billId={billId} />
          </div>
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-gray-400 text-lg">
            {bill?.status === 'processing' ? 'Bill is still being analyzed...' : 'Loading...'}
          </p>
        </div>
      )}
    </div>
  );
}