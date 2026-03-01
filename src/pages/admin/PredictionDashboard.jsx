import AdminSidebar from '../../components/AdminSidebar';
import { predictionData } from '../../utils/mockData';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, CartesianGrid
} from 'recharts';
import { FiTrendingUp, FiTarget, FiActivity } from 'react-icons/fi';

const accuracyMetrics = [
  { label: 'Breakfast Accuracy', value: '91.2%', color: 'text-amber-600' },
  { label: 'Lunch Accuracy', value: '94.7%', color: 'text-emerald-600' },
  { label: 'Dinner Accuracy', value: '89.5%', color: 'text-indigo-600' },
  { label: 'Overall MAPE', value: '6.3%', color: 'text-blue-600' },
];

const factors = [
  { factor: 'Exam Week', impact: '+12%', direction: 'up' },
  { factor: 'Weekend', impact: '-18%', direction: 'down' },
  { factor: 'Holiday', impact: '-35%', direction: 'down' },
  { factor: 'Semester Start', impact: '+8%', direction: 'up' },
  { factor: 'Cultural Event', impact: '-22%', direction: 'down' },
];

export default function PredictionDashboard() {
  const chartData = predictionData.map(d => ({
    day: d.day,
    Breakfast: d.predictedBreakfast,
    Lunch: d.predictedLunch,
    Dinner: d.predictedDinner,
    Low: d.confidenceLow,
    High: d.confidenceHigh,
  }));

  const compareData = predictionData.map((d, i) => ({
    day: d.day,
    Predicted: d.predictedLunch,
    Actual: i < 3 ? Math.floor(d.predictedLunch * (0.92 + Math.random() * 0.12)) : null,
  }));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Prediction Dashboard</h1>
          <p className="text-gray-500 text-sm">7-Day attendance forecast powered by ML model</p>
        </div>

        {/* Accuracy Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {accuracyMetrics.map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Forecast Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="text-indigo-600" size={18} />
            <h2 className="text-base font-semibold text-gray-800">7-Day Meal Forecast</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Breakfast" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Lunch" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Dinner" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Predicted vs Actual */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiTarget className="text-emerald-600" size={18} />
              <h2 className="text-base font-semibold text-gray-800">Predicted vs Actual (Lunch)</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Predicted" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-400 mt-2">* Actual data available for past 3 days only</p>
          </div>

          {/* Factors Panel */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiActivity className="text-indigo-600" size={18} />
              <h2 className="text-base font-semibold text-gray-800">Influencing Factors</h2>
            </div>
            <div className="space-y-3">
              {factors.map(({ factor, impact, direction }) => (
                <div key={factor} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-700">{factor}</span>
                  <span className={`text-sm font-semibold ${direction === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {direction === 'up' ? '↑' : '↓'} {impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7-Day Forecast Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Detailed 7-Day Forecast</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Day</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-medium">Breakfast</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-medium">Lunch</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-medium">Dinner</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Conf. Range</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {predictionData.map((d, i) => (
                  <tr key={d.date} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{d.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{d.day}</td>
                    <td className="px-4 py-3 text-right text-amber-600 font-medium">{d.predictedBreakfast}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-medium">{d.predictedLunch}</td>
                    <td className="px-4 py-3 text-right text-indigo-600 font-medium">{d.predictedDinner}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{d.confidenceLow}–{d.confidenceHigh}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{d.factors}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
