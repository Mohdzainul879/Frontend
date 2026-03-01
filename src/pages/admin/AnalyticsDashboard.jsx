import { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { analyticsData, sustainabilityMetrics, mealPopularity } from '../../utils/mockData';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { FiDownload, FiCalendar } from 'react-icons/fi';

export default function AnalyticsDashboard() {
  const [range, setRange] = useState(30);
  const data = analyticsData.slice(-range);

  const chartData = data.map(d => ({
    day: d.day,
    Bookings: d.bookings,
    Attendance: d.attendance,
    Waste: d.waste,
    WasteReduction: d.wasteReduction,
  }));

  const sm = sustainabilityMetrics;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
            <p className="text-gray-500 text-sm">Comprehensive food system analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
              <FiCalendar size={14} className="text-gray-400" />
              <select value={range} onChange={e => setRange(Number(e.target.value))}
                className="text-sm focus:outline-none bg-transparent">
                <option value={7}>Last 7 Days</option>
                <option value={14}>Last 14 Days</option>
                <option value={30}>Last 30 Days</option>
              </select>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
              <FiDownload size={14} /> Export
            </button>
          </div>
        </div>

        {/* Sustainability Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'CO₂ Saved', value: `${sm.co2Saved} kg`, icon: '🌱', color: 'bg-emerald-50 border-emerald-200' },
            { label: 'Water Saved', value: `${sm.waterSaved} L`, icon: '💧', color: 'bg-blue-50 border-blue-200' },
            { label: 'Cost Savings', value: `₹${(sm.costSavings / 1000).toFixed(0)}K`, icon: '💰', color: 'bg-amber-50 border-amber-200' },
            { label: 'Waste Reduced', value: `${sm.foodWasteReduced} kg`, icon: '♻️', color: 'bg-purple-50 border-purple-200' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className={`rounded-xl border p-4 shadow-sm ${color}`}>
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Bookings vs Attendance */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Bookings vs Attendance</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={Math.floor(data.length / 6)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Bookings" stroke="#6366f1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Attendance" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Waste Reduction */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Waste Reduction (%)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="WasteReduction" name="Reduction %" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Meal Popularity */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Meal Popularity</h2>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={180}>
                <PieChart>
                  <Pie data={mealPopularity} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4}>
                    {mealPopularity.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {mealPopularity.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm text-gray-600">{name}</span>
                    <span className="text-sm font-semibold ml-auto">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Trend */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Food Waste Trend (kg/day)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={Math.floor(data.length / 6)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="Waste" name="Waste (kg)" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Extra sustainability stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-emerald-700">{sm.mealsSaved.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">🍱 Meals Saved</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-green-700">{sm.treesEquivalent}</p>
            <p className="text-sm text-gray-600 mt-1">🌳 Trees Equivalent</p>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-teal-700">{sm.wasteReductionPercent}%</p>
            <p className="text-sm text-gray-600 mt-1">📉 Waste Reduction</p>
          </div>
        </div>
      </main>
    </div>
  );
}
