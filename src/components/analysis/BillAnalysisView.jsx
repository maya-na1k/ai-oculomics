import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { AlertCircle, CheckCircle, DollarSign, FileText, TrendingUp, Loader2 } from 'lucide-react';

export default function BillAnalysisView({ billId }) {
  const [bill, setBill] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billId]);

  const fetchBillData = async () => {
    try {
      // Fetch bill details
      const { data: billData } = await supabase
        .from('medical_bills')
        .select('*')
        .eq('id', billId)
        .single();

      // Fetch analysis
      const { data: analysisData } = await supabase
        .from('bill_analyses')
        .select('*')
        .eq('bill_id', billId)
        .single();

      // Fetch line items
      const { data: itemsData } = await supabase
        .from('bill_line_items')
        .select('*')
        .eq('bill_id', billId);

      setBill(billData);
      setAnalysis(analysisData);
      setLineItems(itemsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bill data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <div className="text-lg text-gray-600 font-medium">Loading analysis...</div>
        </div>
      </div>
    );
  }

  if (!bill || !analysis) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No analysis found for this bill.</p>
        </div>
      </div>
    );
  }

  const severityConfig = {
    low: { 
      bg: 'from-green-50 to-green-100', 
      text: 'text-green-700', 
      border: 'border-green-200',
      icon: <CheckCircle className="w-6 h-6" />
    },
    medium: { 
      bg: 'from-yellow-50 to-orange-100', 
      text: 'text-orange-700', 
      border: 'border-orange-200',
      icon: <AlertCircle className="w-6 h-6" />
    },
    high: { 
      bg: 'from-red-50 to-red-100', 
      text: 'text-red-700', 
      border: 'border-red-200',
      icon: <AlertCircle className="w-6 h-6" />
    }
  };

  // SAFER: Always fall back to 'low' if the mapping doesn't exist
  const severity = analysis.detailed_report?.severity;
  const config = severityConfig[severity] || severityConfig['low'];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bill Analysis</h1>
            <p className="text-lg text-gray-700 font-medium">{bill.provider_name || 'Medical Provider'}</p>
            <p className="text-sm text-gray-500 mt-1">
              Service Date: {bill.service_date ? new Date(bill.service_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'N/A'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Total Charges</p>
            <p className="text-4xl font-bold text-gray-900">${bill.total_charges?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        {/* Summary Alert */}
        <div className={`mt-6 p-6 rounded-2xl border bg-gradient-to-br ${config.bg} ${config.border}`}>
          <div className="flex items-start gap-4">
            <div className={config.text}>
              {config.icon}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg mb-2 ${config.text}`}>Analysis Summary</h3>
              <p className={`text-sm leading-relaxed ${config.text}`}>{analysis.summary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={<AlertCircle className="w-7 h-7" />}
          title="Issues Found"
          value={analysis.total_flags || 0}
          gradient="from-orange-500 to-red-500"
        />
        <MetricCard
          icon={<DollarSign className="w-7 h-7" />}
          title="Potential Savings"
          value={`$${(analysis.potential_savings || 0).toFixed(2)}`}
          gradient="from-green-500 to-emerald-500"
        />
        <MetricCard
          icon={<FileText className="w-7 h-7" />}
          title="Line Items"
          value={lineItems.length}
          gradient="from-purple-500 to-pink-500"
        />
      </div>

      {/* Detailed Findings */}
      {analysis.detailed_report?.detailed_findings && analysis.detailed_report.detailed_findings.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Detailed Findings</h2>
          <div className="space-y-4">
            {analysis.detailed_report.detailed_findings.map((finding, index) => (
              <FindingCard key={index} finding={finding} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Line Items Table */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Itemized Charges</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lineItems.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-purple-50/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {item.code || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {item.quantity || 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ${item.charge_amount?.toFixed(2) || '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Recommended Actions</h2>
          <div className="space-y-4">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <p className="text-gray-700 leading-relaxed pt-1.5">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, title, value, gradient }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}

function FindingCard({ finding, index }) {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold">
          {index + 1}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">{finding.issue}</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-orange-700">Impact:</span> {finding.impact}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-orange-700">Recommendation:</span> {finding.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
