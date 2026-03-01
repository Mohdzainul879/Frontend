import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import StatCard from '../../components/StatCard';
import { useBooking } from '../../context/BookingContext';
import { analyticsData } from '../../utils/mockData';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { FiUsers, FiCalendar, FiAlertTriangle, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

const todayMealBreakdown = [
  { meal: 'Breakfast', booked: 187, attended: 162, predicted: 180 },
  { meal: 'Lunch', booked: 289, attended: 241, predicted: 270 },
  { meal: 'Dinner', booked: 215, attended: 190, predicted: 210 },
];

const alerts = [
  { id: 1, type: 'warning', msg: '3 students with accountability score < 50 detected.' },
  { id: 2, type: 'info', msg: 'Tomorrow\'s lunch demand is predicted to be 15% above average.' },
  { id: 3, type: 'success', msg: 'Food waste reduced by 28% this week compared to last week.' },
];

export default function AdminDashboard() {
  const { bookings } = useBooking();
  const [liveCount, setLiveCount] = useState(641);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(c => c + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === today);
  const todayAttended = todayBookings.filter(b => b.status === 'Attended').length;
  const todayMissed = todayBookings.filter(b => b.status === 'Missed').length;

  const chartData = analyticsData.slice(-7).map(d => ({
    day: `D${d.day}`,
    Bookings: d.bookings,
    Attendance: d.attendance,
  }));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm animate-pulse">
            🔴 Live: {liveCount} bookings today
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Bookings Today" value={liveCount} icon={FiCalendar} color="indigo" />
          <StatCard title="Predicted Attendance" value="598" icon={FiTrendingUp} color="blue" subtitle="85% confidence" />
          <StatCard title="Actual Attendance" value={todayAttended || 593} icon={FiCheckCircle} color="emerald" />
          <StatCard title="No-Shows" value={todayMissed || 48} icon={FiAlertTriangle} color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Today&apos;s Meal Overview</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={todayMealBreakdown}>
                <XAxis dataKey="meal" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="booked" name="Booked" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attended" name="Attended" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predicted" name="Predicted" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Trend */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">7-Day Booking Trend</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="Bookings" stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Attendance" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiAlertTriangle className="text-amber-500" size={18} /> System Alerts
          </h2>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id}
                className={`flex items-center gap-3 p-3 rounded-xl border text-sm
                  ${alert.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                    alert.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                    'bg-blue-50 border-blue-200 text-blue-800'}`}
              >
                {alert.type === 'warning' ? '⚠️' : alert.type === 'success' ? '✅' : 'ℹ️'}
                {alert.msg}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-indigo-600">30</p>
            <p className="text-xs text-gray-500 mt-1">Total Students</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-emerald-600">28%</p>
            <p className="text-xs text-gray-500 mt-1">Waste Reduction</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-amber-600">79.3</p>
            <p className="text-xs text-gray-500 mt-1">Avg. Score</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">3</p>
            <p className="text-xs text-gray-500 mt-1">Flagged Students</p>
          </div>
        </div>
      </main>
    </div>
  );
}
