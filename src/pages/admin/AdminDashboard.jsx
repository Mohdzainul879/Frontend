import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import StatCard from '../../components/StatCard';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { FiUsers, FiCalendar, FiAlertTriangle, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [overviewStats, setOverviewStats] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [liveStats, setLiveStats] = useState(null);

  const getDateOffset = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, analytics, realtime] = await Promise.all([
          api.getOverviewStats(),
          api.getAnalytics({ startDate: getDateOffset(-7), endDate: getDateOffset(0) }),
          api.getRealtimeAnalytics()
        ]);
        setOverviewStats(stats);
        setAnalyticsData(analytics.data || []);
        setLiveStats(realtime);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setAnalyticsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = analyticsData.slice(-7).map((d, idx) => ({
    day: `D${idx + 1}`,
    Bookings: d.bookings,
    Attendance: d.attendance,
  }));

  const todayMealBreakdown = useMemo(() => {
    const distribution = liveStats?.mealDistribution || {};
    return ['Breakfast', 'Lunch', 'Dinner'].map((meal) => ({
      meal,
      booked: distribution[meal]?.booked || 0,
      attended: distribution[meal]?.attended || 0,
      pending: distribution[meal]?.pending || 0,
    }));
  }, [liveStats]);

  const dashboardAlerts = useMemo(() => {
    const alerts = [];
    const pending = liveStats?.pendingToday || 0;
    const attendanceRate = overviewStats?.attendanceRate || 0;

    if (pending > 0) {
      alerts.push({ id: 'pending', type: 'warning', msg: `${pending} bookings are still pending attendance marking.` });
    }
    if (attendanceRate < 70) {
      alerts.push({ id: 'rate', type: 'warning', msg: `Attendance rate is ${attendanceRate}%. Consider follow-up with low-attendance students.` });
    }
    alerts.push({ id: 'prediction', type: 'info', msg: 'Check predictions daily to avoid over-preparation and food waste.' });

    return alerts;
  }, [liveStats, overviewStats]);

  if (loading) return <div className="flex min-h-screen bg-slate-50"><AdminSidebar /><div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div></div>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/attendance"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Mark Attendance
            </Link>
            <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-medium">
              Live: {liveStats?.totalToday || 0} bookings today
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Bookings Today" value={liveStats?.totalToday || overviewStats?.todayBookings || 0} icon={FiCalendar} color="indigo" />
          <StatCard title="Pending Check-ins" value={liveStats?.pendingToday || 0} icon={FiTrendingUp} color="blue" subtitle="Needs admin action" />
          <StatCard title="Attendance Rate" value={`${overviewStats?.attendanceRate || 0}%`} icon={FiCheckCircle} color="emerald" />
          <StatCard title="Active Students" value={`${overviewStats?.activeStudents || 0}/${overviewStats?.totalStudents || 0}`} icon={FiUsers} color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Meal Attendance Overview</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={todayMealBreakdown}>
                <XAxis dataKey="meal" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="booked" name="Booked" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attended" name="Attended" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Trend */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">7-Day Trend</h2>
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
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FiAlertTriangle className="text-amber-500" size={18} /> System Alerts
          </h2>
          <div className="space-y-3">
            {dashboardAlerts.map(alert => (
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

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Recent Booking Activity</h2>
          <div className="space-y-3">
            {(liveStats?.recentActivity || []).slice(0, 6).map((item, index) => (
              <div key={`${item.student}-${item.timestamp}-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.student}</p>
                  <p className="text-xs text-slate-500">{item.meal} • {item.date}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.status === 'Attended' ? 'bg-emerald-100 text-emerald-700' : item.status === 'Missed' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                  {item.status}
                </span>
              </div>
            ))}
            {(!liveStats?.recentActivity || liveStats.recentActivity.length === 0) && (
              <p className="text-sm text-slate-500">No recent activity available yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
