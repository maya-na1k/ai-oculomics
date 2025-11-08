import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import FileUploader from '../components/upload/FileUploader';
import { FileText, AlertCircle, DollarSign, ChevronRight } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [showUploader, setShowUploader] = useState(false);
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({
    totalBills: 0,
    totalFlags: 0,
    potentialSavings: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const { data: billsData } = await supabase
      .from('medical_bills')
      .select(`
        *,
        bill_analyses (
          total_flags,
          potential_savings,
          summary
        )
      `)
      .eq('user_id', user.id)
      .order('upload_date', { ascending: false });

    setBills(billsData || []);

    // Calculate stats
    const totalFlags = billsData?.reduce((sum, bill) => 
      sum + (bill.bill_analyses[0]?.total_flags || 0), 0) || 0;
    const totalSavings = billsData?.reduce((sum, bill) => 
      sum + (bill.bill_analyses[0]?.potential_savings || 0), 0) || 0;

    setStats({
      totalBills: billsData?.length || 0,
      totalFlags,
      potentialSavings: totalSavings
    });
  };

  const handleUploadComplete = () => {
    setShowUploader(false);
    fetchBills(); // Refresh the list
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!showUploader ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={<FileText className="w-6 h-6" />}
                title="Total Bills"
                value={stats.totalBills}
                color="blue"
              />
              <StatCard
                icon={<AlertCircle className="w-6 h-6" />}
                title="Issues Found"
                value={stats.totalFlags}
                color="orange"
              />
              <StatCard
                icon={<DollarSign className="w-6 h-6" />}
                title="Potential Savings"
                value={`$${stats.potentialSavings.toFixed(2)}`}
                color="green"
              />
            </div>

            {/* Bills List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Medical Bills</h2>
                <button
                  onClick={() => setShowUploader(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Upload New Bill
                </button>
              </div>

              {bills.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No bills uploaded yet</p>
                  <button
                    onClick={() => setShowUploader(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    Upload Your First Bill
                  </button>
                </div>
              ) : (
                <div className="divide-y">
                  {bills.map((bill) => (
                    <BillListItem
                      key={bill.id}
                      bill={bill}
                      onClick={() => navigate(`/bill/${bill.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div>
            <button
              onClick={() => setShowUploader(false)}
              className="mb-4 text-blue-600 hover:text-blue-700"
            >
              ← Back to Dashboard
            </button>
            <FileUploader onUploadComplete={handleUploadComplete} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function BillListItem({ bill, onClick }) {
  const analysis = bill.bill_analyses[0];
  const statusColors = {
    uploaded: 'bg-gray-100 text-gray-800',
    extracted: 'bg-blue-100 text-blue-800',
    analyzed: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800'
  };

  return (
    <div
      onClick={onClick}
      className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{bill.provider_name || bill.file_name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {bill.service_date ? new Date(bill.service_date).toLocaleDateString() : 'Date unknown'}
          </p>
          {analysis && (
            <p className="text-sm text-gray-500 mt-1">{analysis.summary}</p>
          )}
        </div>

        <div className="text-right flex items-start gap-4">
          <div>
            <p className="text-lg font-bold text-gray-900">${bill.total_charges?.toFixed(2) || '0.00'}</p>
            {analysis && analysis.potential_savings > 0 && (
              <p className="text-sm text-green-600 font-medium">
                Save ${analysis.potential_savings.toFixed(2)}
              </p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
        </div>
      </div>

      <div className="mt-2">
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[bill.status]}`}>
          {bill.status}
        </span>
      </div>
    </div>
  );
}