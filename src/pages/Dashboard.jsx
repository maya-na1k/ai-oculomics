import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import FileUploader from '../components/upload/FileUploader';
import { FileText, AlertCircle, DollarSign, ChevronRight, Shield, Upload, Search } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [showUploader, setShowUploader] = useState(false);
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({
    totalBills: 0,
    totalFlags: 0,
    potentialSavings: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    fetchBills();
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
                className="border border-purple-500 text-purple-600 px-5 py-2 rounded-full hover:bg-purple-50 transition-all font-medium"
              >
                Logout
              </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {!showUploader ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Your Medical Bills</h2>
              <p className="text-gray-600">Track, analyze, and dispute unfair charges</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={<FileText className="w-6 h-6" />}
                title="Total Bills"
                value={stats.totalBills}
                subtitle={`+${stats.totalBills} this month`}
                gradient="from-purple-500 to-purple-600"
              />
              <StatCard
                icon={<AlertCircle className="w-6 h-6" />}
                title="Issues Found"
                value={stats.totalFlags}
                subtitle="Across all bills"
                subtitleColor="text-orange-600"
                badge="High priority"
                gradient="from-orange-500 to-orange-600"
              />
              <StatCard
                icon={<DollarSign className="w-6 h-6" />}
                title="Potential Savings"
                value={`${stats.potentialSavings.toFixed(2)}`}
                subtitle="+15% vs average"
                subtitleColor="text-green-600"
                badge="Ready to dispute"
                gradient="from-green-500 to-green-600"
              />
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by provider or file name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowUploader(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all transform hover:scale-[1.02] font-semibold"
              >
                <Upload className="w-5 h-5" />
                Upload New Bill
              </button>
            </div>

            {/* Bills List */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {bills.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No bills uploaded yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Upload your first medical bill to start analyzing costs and finding savings
                  </p>
                  <button
                    onClick={() => setShowUploader(true)}
                    className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-8 py-3 rounded-full hover:shadow-lg transform hover:scale-[1.02] transition-all font-medium inline-flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Your First Bill
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {bills.filter(bill => 
                    !searchQuery || 
                    bill.provider_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    bill.file_name?.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((bill) => (
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
              className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 transition-colors"
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

function StatCard({ icon, title, value, subtitle, subtitleColor = "text-gray-600", badge, gradient }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} text-white mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1 font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${subtitleColor}`}>{subtitle}</p>
        {badge && (
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

function BillListItem({ bill, onClick }) {
  const analysis = bill.bill_analyses[0];
  const statusConfig = {
    uploaded: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Uploaded' },
    extracted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Extracting' },
    analyzed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Analyzed' },
    error: { bg: 'bg-red-100', text: 'text-red-700', label: 'Error' }
  };

  const config = statusConfig[bill.status] || statusConfig.uploaded;

  return (
    <div
      onClick={onClick}
      className="px-8 py-6 hover:bg-purple-50/50 cursor-pointer transition-all group"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900 text-lg">
              {bill.provider_name || bill.file_name}
            </h3>
            <span className={`text-xs px-3 py-1 rounded-full ${config.bg} ${config.text} font-semibold`}>
              {config.label}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mb-3">
            Service Date: {bill.service_date ? new Date(bill.service_date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'numeric',
              day: 'numeric' 
            }) : 'Unknown'}
          </p>
          
          {analysis && analysis.total_flags > 0 && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-600 font-semibold">
                {analysis.total_flags} {analysis.total_flags === 1 ? 'issue' : 'issues'}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">
                {analysis.summary?.slice(0, 80)}{analysis.summary?.length > 80 ? '...' : ''}
              </span>
            </div>
          )}
        </div>

        <div className="text-right flex items-center gap-6 ml-6">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              ${bill.total_charges?.toFixed(2) || '0.00'}
            </p>
            {analysis && analysis.potential_savings > 0 && (
              <p className="text-sm text-green-600 font-semibold mt-1">
                Save ${analysis.potential_savings.toFixed(2)}
              </p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
        </div>
      </div>
    </div>
  );
}