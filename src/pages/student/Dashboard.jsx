import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { useMenu } from '../../context/MenuContext';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from '../../components/StudentNavbar';
import Footer from '../../components/Footer';
import Badge from '../../components/Badge';
import StatCard from '../../components/StatCard';
import { FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiTrendingUp } from 'react-icons/fi';

function CircularProgress({ value }) {
  const size = 120;
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const strokeColor = value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={strokeColor} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-2xl font-bold" style={{ color: strokeColor }}>{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { bookings } = useBooking();
  const { getMenuByDate } = useMenu();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.studentId === 1 && b.date === today);
  const allStudentBookings = bookings.filter(b => b.studentId === 1);

  const todayMealStatus = ['Breakfast', 'Lunch', 'Dinner'].map(meal => {
    const booking = todayBookings.find(b => b.mealType === meal);
    return { meal, booking };
  });

  const upcomingMeals = bookings
    .filter(b => b.studentId === 1 && b.status === 'Upcoming')
    .slice(0, 5);

  const todayMenu = getMenuByDate(today);

  const totalBookings = allStudentBookings.length;
  const attended = allStudentBookings.filter(b => b.status === 'Attended').length;
  const missed = allStudentBookings.filter(b => b.status === 'Missed').length;
  const attendanceRate = totalBookings > 0 ? Math.round((attended / totalBookings) * 100) : 0;

  const score = user?.accountabilityScore || 100;

  const mealTimings = { Breakfast: '7:30–9:30 AM', Lunch: '12:00–2:00 PM', Dinner: '7:00–9:00 PM' };
  const mealEmoji = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙' };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StudentNavbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">

        {/* Welcome */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-emerald-100 mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 text-sm">
              🏠 Hostel {user?.hostel} | Room {user?.room}
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 text-sm">
              📊 Score: {score}/100
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Score + Today's Meals */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Meal Status */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Today&apos;s Meals</h2>
                <button
                  onClick={() => navigate('/book-meal')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  + Book Meal
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {todayMealStatus.map(({ meal, booking }) => (
                  <div key={meal}
                    className={`rounded-xl border p-4 ${booking ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="text-2xl mb-2">{mealEmoji[meal]}</div>
                    <h3 className="font-semibold text-gray-700 text-sm">{meal}</h3>
                    <p className="text-xs text-gray-500 mb-2">{mealTimings[meal]}</p>
                    {booking ? (
                      <Badge label={booking.status} variant={booking.status} />
                    ) : (
                      <span className="text-xs text-gray-400 italic">Not booked</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard title="Total Bookings" value={totalBookings} icon={FiCalendar} color="emerald" />
              <StatCard title="Meals Attended" value={attended} icon={FiCheckCircle} color="blue" />
              <StatCard title="Meals Missed" value={missed} icon={FiXCircle} color="red" />
              <StatCard title="Attendance" value={`${attendanceRate}%`} icon={FiTrendingUp} color="purple" />
            </div>

            {/* Today's Menu Preview */}
            {todayMenu.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Today&apos;s Menu</h2>
                <div className="space-y-3">
                  {todayMenu.map(menu => (
                    <div key={menu.id} className="flex gap-4 items-start">
                      <span className="text-xl">{mealEmoji[menu.mealType]}</span>
                      <div>
                        <p className="font-medium text-sm text-gray-700">{menu.mealType}
                          <span className="text-gray-400 font-normal ml-2 text-xs">({menu.timing})</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{menu.items.join(' • ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Score + Upcoming */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 self-start">Accountability Score</h2>
              <CircularProgress value={score} />
              <p className="text-sm text-gray-500 mt-3 text-center">
                {score >= 80 ? '✅ Great discipline! Keep it up.' : score >= 60 ? '⚠️ Room for improvement.' : '❌ Low score – please attend meals.'}
              </p>
            </div>

            {/* Upcoming Meals */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Meals</h2>
              {upcomingMeals.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No upcoming bookings</p>
              ) : (
                <div className="space-y-3">
                  {upcomingMeals.map(b => (
                    <div key={b.id} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                      <FiClock className="text-emerald-500 shrink-0" size={16} />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{b.mealType}</p>
                        <p className="text-xs text-gray-500">{b.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
