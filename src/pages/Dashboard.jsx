import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import FileUploader from '../components/upload/FileUploader';
import { FileText, AlertCircle, DollarSign, ChevronRight, Upload, Search, Filter, TrendingUp, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [showUploader, setShowUploader] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({
    totalBills: 0,
    totalFlags: 0,
    potentialSavings: 0,
    totalCharges: 0
  });
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
    const totalCharges = billsData?.reduce((sum, bill) => 
      sum + (bill.total_charges || 0), 0) || 0;

    setStats({
      totalBills: billsData?.length || 0,
      totalFlags,
      potentialSavings: totalSavings,
      totalCharges
    });
  };

  const handleUploadComplete = () => {
    setShowUploader(false);
    fetchBills();
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.provider_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.file_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || bill.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
          <div className="flex items-center gap-6">
            <span className="text-gray-400 hidden md:block">Welcome back, <span className="text-white font-medium">{user.email}</span></span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition border border-gray-700"
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
            {/* Header with Upload Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Your Medical Bills</h2>
                <p className="text-gray-400">Track, analyze, and dispute unfair charges</p>
              </div>
              <button
                onClick={() => setShowUploader(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium shadow-lg shadow-purple-500/30 inline-flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload New Bill
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<FileText className="w-6 h-6" />}
                title="Total Bills"
                value={stats.totalBills}
                subtitle={`$${stats.totalCharges.toLocaleString()}`}
                color="purple"
                trend="+2 this month"
              />
              <StatCard
                icon={<AlertCircle className="w-6 h-6" />}
                title="Issues Found"
                value={stats.totalFlags}
                subtitle="Across all bills"
                color="orange"
                trend="High priority"
              />
              <StatCard
                icon={<DollarSign className="w-6 h-6" />}
                title="Potential Savings"
                value={`$${stats.potentialSavings.toLocaleString()}`}
                subtitle="Ready to dispute"
                color="green"
                trend="+15% vs average"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Success Rate"
                value="89%"
                subtitle="Disputes won"
                color="blue"
                trend="Above average"
              />
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by provider or file name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition"
                  >
                    <option value="all">All Status</option>
                    <option value="uploaded">Uploaded</option>
                    <option value="processing">Processing</option>
                    <option value="analyzed">Analyzed</option>
                    <option value="disputed">Disputed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bills List */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              {filteredBills.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4 text-lg">
                    {searchTerm || filterStatus !== 'all' ? 'No bills match your search' : 'No bills uploaded yet'}
                  </p>
                  {!searchTerm && filterStatus === 'all' && (
                    <button
                      onClick={() => setShowUploader(true)}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium inline-flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Upload Your First Bill
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {filteredBills.map((bill) => (
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
              className="mb-6 text-purple-400 hover:text-purple-300 transition inline-flex items-center gap-2"
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

function StatCard({ icon, title, value, subtitle, color, trend }) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600'
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition group">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} mb-4 group-hover:scale-110 transition`}>
        {icon}
      </div>
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{subtitle}</p>
        <span className="text-xs text-purple-400 font-medium">{trend}</span>
      </div>
    </div>
  );
}

function BillListItem({ bill, onClick }) {
  const analysis = bill.bill_analyses?.[0];
  const statusConfig = {
    uploaded: { color: 'bg-gray-600 text-gray-200', icon: <Clock className="w-3 h-3" /> },
    extracted: { color: 'bg-blue-600 text-blue-100', icon: <Clock className="w-3 h-3" /> },
    analyzed: { color: 'bg-green-600 text-green-100', icon: <CheckCircle2 className="w-3 h-3" /> },
    error: { color: 'bg-red-600 text-red-100', icon: <XCircle className="w-3 h-3" /> }
  };

  const status = statusConfig[bill.status] || statusConfig.uploaded;

  return (
    <div 
      onClick={onClick}
      className="px-6 py-5 hover:bg-gray-750 cursor-pointer transition group"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-white text-lg group-hover:text-purple-400 transition">
              {bill.provider_name || bill.file_name}
            </h3>
            <span className={`text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${status.color}`}>
              {status.icon}
              {bill.status}
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-2">
            {bill.service_date ? `Service Date: ${new Date(bill.service_date).toLocaleDateString()}` : 'Date unknown'}
          </p>
          {analysis && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-orange-400 inline-flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {analysis.total_flags} issues
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">{analysis.summary}</span>
            </div>
          )}
        </div>

        <div className="text-right flex items-center gap-6">
          <div>
            <p className="text-2xl font-bold text-white">${bill.total_charges?.toFixed(2) || '0.00'}</p>
            {analysis && analysis.potential_savings > 0 && (
              <p className="text-sm text-green-400 font-semibold mt-1">
                Save ${analysis.potential_savings.toFixed(2)}
              </p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition" />
        </div>
      </div>
    </div>
  );
}