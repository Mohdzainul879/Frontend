import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { FiDownload, FiCalendar, FiTrendingUp, FiTrendingDown, FiRefreshCw } from 'react-icons/fi';

export default function AnalyticsDashboard() {
  const [range, setRange] = useState(30);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({ data: [], trends: {}, summary: {} });
  const [sustainabilityMetrics, setSustainabilityMetrics] = useState({});
  const [mealPopularity, setMealPopularity] = useState({ mealTypePopularity: [], topItems: [] });
  const [realtimeData, setRealtimeData] = useState({});
  const [heatmapData, setHeatmapData] = useState([]);
  const [comparative, setComparative] = useState({});
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchData();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchData(true);
      }, 2 * 60 * 1000); // 2 minutes
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [range, autoRefresh]);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      const getDateOffset = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
      };

      const [analytics, sustainability, popularity, realtime, heatmap, comp] = await Promise.all([
        api.getAnalytics({ startDate: getDateOffset(-range), endDate: getDateOffset(0) }),
        api.getSustainabilityMetrics(),
        api.getMealPopularity(range),
        api.getRealtimeAnalytics(),
        api.getBookingHeatmap(range),
        api.getComparativeAnalysis(range)
      ]);

      setAnalyticsData(analytics);
      setSustainabilityMetrics(sustainability);
      setMealPopularity(popularity);
      setRealtimeData(realtime);
      setHeatmapData(heatmap);
      setComparative(comp);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    </div>
  );

  const { data, trends, summary } = analyticsData;
  const chartData = data.map((d, idx) => ({
    day: idx + 1,
    date: d.date,
    Bookings: d.bookings,
    Attendance: d.attendance,
    Waste: d.waste,
    WasteReduction: d.wasteReduction,
    Efficiency: d.efficiency,
    AttendanceRate: d.attendanceRate
  }));

  const sm = sustainabilityMetrics;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Real-time system analytics • Updated {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              <FiRefreshCw size={14} className={autoRefresh ? 'animate-spin' : ''} />
              {autoRefresh ? 'Live' : 'Static'}
            </button>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
              <FiCalendar size={14} className="text-gray-400" />
              <select value={range} onChange={e => setRange(Number(e.target.value))}
                className="text-sm focus:outline-none bg-transparent">
                <option value={7}>Last 7 Days</option>
                <option value={14}>Last 14 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={60}>Last 60 Days</option>
              </select>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
              <FiDownload size={14} /> Export
            </button>
          </div>
        </div>

        {/* Real-time Summary */}
        {realtimeData.totalToday && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Today's Activity
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{realtimeData.totalToday}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Attended</p>
                <p className="text-2xl font-bold text-green-600">{realtimeData.attendedToday}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{realtimeData.pendingToday}</p>
              </div>
            </div>
          </div>
        )}

        {/* Trend Indicators */}
        {trends && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Booking Trend</span>
                {trends.bookings?.trend === 'increasing' ? (
                  <FiTrendingUp className="text-green-600" />
                ) : (
                  <FiTrendingDown className="text-red-600" />
                )}
              </div>
              <p className={`text-2xl font-bold mt-2 ${
                parseFloat(trends.bookings?.change) > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trends.bookings?.change > 0 ? '+' : ''}{trends.bookings?.change}%
              </p>
              <p className="text-xs text-gray-500 mt-1">{trends.bookings?.trend}</p>
            </div>

            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Attendance Trend</span>
                {trends.attendance?.trend === 'improving' ? (
                  <FiTrendingUp className="text-green-600" />
                ) : (
                  <FiTrendingDown className="text-red-600" />
                )}
              </div>
              <p className={`text-2xl font-bold mt-2 ${
                parseFloat(trends.attendance?.change) > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trends.attendance?.change > 0 ? '+' : ''}{trends.attendance?.change}%
              </p>
              <p className="text-xs text-gray-500 mt-1">{trends.attendance?.trend}</p>
            </div>

            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Waste Trend</span>
                {trends.waste?.trend === 'reducing' ? (
                  <FiTrendingDown className="text-green-600" />
                ) : (
                  <FiTrendingUp className="text-red-600" />
                )}
              </div>
              <p className={`text-2xl font-bold mt-2 ${
                parseFloat(trends.waste?.change) < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trends.waste?.change > 0 ? '+' : ''}{trends.waste?.change}%
              </p>
              <p className="text-xs text-gray-500 mt-1">{trends.waste?.trend}</p>
            </div>
          </div>
        )}

        {/* Sustainability Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'CO₂ Saved', value: `${sm.co2Saved} kg`, icon: '🌱', color: 'bg-emerald-50 border-emerald-200', textColor: 'text-emerald-700' },
            { label: 'Water Saved', value: `${sm.waterSaved} L`, icon: '💧', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
            { label: 'Cost Savings', value: `₹${(sm.costSavings / 1000).toFixed(0)}K`, icon: '💰', color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-700' },
            { label: 'Waste Reduced', value: `${sm.foodWasteReduced} kg`, icon: '♻️', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
          ].map(({ label, value, icon, color, textColor }) => (
            <div key={label} className={`rounded-xl border p-4 shadow-sm ${color}`}>
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-xs text-gray-600">{label}</p>
              <p className={`text-xl font-bold mt-0.5 ${textColor}`}>{value}</p>
              {sm.wasteTrend && label === 'Waste Reduced' && (
                <p className={`text-xs mt-1 ${
                  sm.wasteTrend.direction === 'improving' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {sm.wasteTrend.direction === 'improving' ? '↓' : '↑'} {Math.abs(sm.wasteTrend.value)}%
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Bookings vs Attendance */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Bookings vs Attendance Trend
            {summary.avgAttendanceRate && (
              <span className="text-sm font-normal text-gray-500 ml-3">
                Avg Rate: {summary.avgAttendanceRate}%
              </span>
            )}
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={Math.floor(data.length / 8)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Bookings" stroke="#6366f1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Attendance" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="AttendanceRate" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Efficiency Score */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              System Efficiency Score
              {summary.avgEfficiency && (
                <span className="text-sm font-normal text-gray-500 ml-3">
                  Avg: {summary.avgEfficiency}/100
                </span>
              )}
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="Efficiency" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Meal Popularity */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Meal Type Distribution</h2>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={180}>
                <PieChart>
                  <Pie 
                    data={mealPopularity.mealTypePopularity} 
                    dataKey="value" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={45} 
                    outerRadius={80} 
                    paddingAngle={4}
                  >
                    {mealPopularity.mealTypePopularity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {mealPopularity.mealTypePopularity.map(({ name, value, count, attendanceRate, color }) => (
                  <div key={name}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-sm text-gray-700 flex-1">{name}</span>
                      <span className="text-sm font-semibold">{value}%</span>
                    </div>
                    {attendanceRate && (
                      <p className="text-xs text-gray-400 ml-5">
                        {count} bookings • {attendanceRate}% attendance
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Waste Trend */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Food Waste Trend (kg/day)
            {summary.totalWaste && (
              <span className="text-sm font-normal text-gray-500 ml-3">
                Total: {summary.totalWaste} kg over {summary.totalDays} days
              </span>
            )}
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={Math.floor(data.length / 8)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Waste" name="Waste (kg)" fill="#f87171" radius={[4, 4, 0, 0]} />
              <Bar dataKey="WasteReduction" name="Reduction %" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Heatmap */}
        {heatmapData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Booking Heatmap - Day of Week Analysis</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={heatmapData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Breakfast" fill="#f59e0b" stackId="a" />
                <Bar dataKey="Lunch" fill="#10b981" stackId="a" />
                <Bar dataKey="Dinner" fill="#6366f1" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Comparative Analysis */}
        {comparative.current && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Comparative Analysis - Current vs Previous Period ({comparative.period})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Bookings', current: comparative.current.totalBookings, change: comparative.changes.totalBookings },
                { label: 'Attended', current: comparative.current.attended, change: comparative.changes.attended },
                { label: 'Missed', current: comparative.current.missed, change: comparative.changes.missed },
                { label: 'Attendance Rate', current: `${comparative.current.attendanceRate}%`, change: comparative.changes.attendanceRate },
              ].map(({ label, current, change }) => (
                <div key={label} className="border rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase">{label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{current}</p>
                  <p className={`text-sm mt-1 font-medium ${
                    parseFloat(change) > 0 ? 'text-green-600' : parseFloat(change) < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {parseFloat(change) > 0 ? '+' : ''}{change}% vs previous
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Sustainability Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-emerald-700">{sm.mealsSaved?.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">🍱 Meals Served</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-green-700">{sm.treesEquivalent}</p>
            <p className="text-sm text-gray-600 mt-1">🌳 Trees Equivalent</p>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-teal-700">{sm.wasteReductionPercent}%</p>
            <p className="text-sm text-gray-600 mt-1">📉 Waste Reduction</p>
          </div>
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-cyan-700">{sm.energySaved} kWh</p>
            <p className="text-sm text-gray-600 mt-1">⚡ Energy Saved</p>
          </div>
        </div>
      </main>
    </div>
  );
}
