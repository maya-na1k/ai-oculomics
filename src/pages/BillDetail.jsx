import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import BillAnalysisView from '../components/analysis/BillAnalysisView';
import { ArrowLeft } from 'lucide-react';
import DisputeLetterGenerator from '../components/reports/DisputeLetterGenerator';

export default function BillDetail({ user, onLogout }) {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    fetchBill();
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">BillBuddy</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user.email}</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-5 h-5" />
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
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">
            {bill?.status === 'processing' ? 'Bill is still being analyzed...' : 'Loading...'}
          </p>
        </div>
      )}
    </div>
  );
}