import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { AlertCircle, CheckCircle, DollarSign, FileText, TrendingUp } from 'lucide-react';

export default function BillAnalysisView({ billId }) {
  const [bill, setBill] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillData();
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
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600">Loading analysis...</div>
      </div>
    );
  }

  if (!bill || !analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analysis found for this bill.</p>
      </div>
    );
  }

  const severityColors = {
    low: 'bg-green-50 text-green-700 border-green-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    high: 'bg-red-50 text-red-700 border-red-200'
  };

  const severityIcons = {
    low: <CheckCircle className="w-5 h-5" />,
    medium: <AlertCircle className="w-5 h-5" />,
    high: <AlertCircle className="w-5 h-5" />
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bill Analysis</h1>
            <p className="text-gray-600 mt-1">{bill.provider_name || 'Medical Provider'}</p>
            <p className="text-sm text-gray-500">
              Service Date: {bill.service_date ? new Date(bill.service_date).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Charges</p>
            <p className="text-3xl font-bold text-gray-900">${bill.total_charges?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        {/* Summary Alert */}
        <div className={`mt-4 p-4 rounded-lg border ${severityColors[analysis.detailed_report?.severity || 'low']}`}>
          <div className="flex items-start gap-3">
            {severityIcons[analysis.detailed_report?.severity || 'low']}
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Analysis Summary</h3>
              <p className="text-sm">{analysis.summary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={<AlertCircle className="w-6 h-6" />}
          title="Issues Found"
          value={analysis.total_flags || 0}
          color="orange"
        />
        <MetricCard
          icon={<DollarSign className="w-6 h-6" />}
          title="Potential Savings"
          value={`$${(analysis.potential_savings || 0).toFixed(2)}`}
          color="green"
        />
        <MetricCard
          icon={<FileText className="w-6 h-6" />}
          title="Line Items"
          value={lineItems.length}
          color="blue"
        />
      </div>

      {/* Detailed Findings */}
      {analysis.detailed_report?.detailed_findings && analysis.detailed_report.detailed_findings.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Detailed Findings</h2>
          <div className="space-y-4">
            {analysis.detailed_report.detailed_findings.map((finding, index) => (
              <FindingCard key={index} finding={finding} />
            ))}
          </div>
        </div>
      )}

      {/* Line Items Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Itemized Charges</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lineItems.map((item) => (
                <tr key={item.id} className={item.flag_type ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.code || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity || 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.charge_amount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.flag_type ? (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        {item.flag_type}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recommended Actions</h2>
          <ul className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, title, value, color }) {
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

function FindingCard({ finding }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-2">{finding.issue}</h3>
      <p className="text-sm text-gray-700 mb-2">
        <span className="font-medium">Impact:</span> {finding.impact}
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-medium">Recommendation:</span> {finding.recommendation}
      </p>
    </div>
  );
}