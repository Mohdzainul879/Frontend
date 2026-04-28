import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import StudentNavbar from '../../components/StudentNavbar';
import Footer from '../../components/Footer';
import Badge from '../../components/Badge';
import Toast from '../../components/Toast';
import { FiFilter, FiCalendar, FiClock } from 'react-icons/fi';

export default function BookingHistory() {
  const { user } = useAuth();
  const { bookings, cancelBooking, loading } = useBooking();
  const [filters, setFilters] = useState({ status: '', mealType: '' });
  const [toast, setToast] = useState(null);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Format time helper
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  const studentId = user?._id;
  let history = bookings.filter(b => b.student?._id === studentId);
  if (filters.status) history = history.filter(b => b.status === filters.status);
  if (filters.mealType) history = history.filter(b => b.mealType === filters.mealType);
  history = history.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

  const total = history.length;
  const attended = history.filter(b => b.status === 'Attended').length;
  const missed = history.filter(b => b.status === 'Missed').length;
  const cancelled = history.filter(b => b.status === 'Cancelled').length;

  const handleCancel = async (id) => {
    const result = await cancelBooking(id);
    if (result.success) {
      setToast({ message: 'Booking cancelled.', type: 'info' });
    } else {
      setToast({ message: result.message || 'Failed to cancel booking', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StudentNavbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Booking History</h1>
          <p className="text-gray-500 text-sm mt-1">Your complete meal booking record</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: total, color: 'bg-gray-100 text-gray-700' },
            { label: 'Attended', value: attended, color: 'bg-emerald-100 text-emerald-700' },
            { label: 'Missed', value: missed, color: 'bg-red-100 text-red-700' },
            { label: 'Cancelled', value: cancelled, color: 'bg-gray-100 text-gray-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl p-4 text-center ${color}`}>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-center">
          <FiFilter className="text-gray-400" size={16} />
          <select
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">All Statuses</option>
            <option value="Booked">Booked</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Attended">Attended</option>
            <option value="Missed">Missed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            value={filters.mealType}
            onChange={e => setFilters(f => ({ ...f, mealType: e.target.value }))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">All Meals</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
          <button
            onClick={() => setFilters({ status: '', mealType: '' })}
            className="text-sm text-emerald-600 hover:underline"
          >
            Clear filters
          </button>
          <span className="ml-auto text-sm text-gray-500">{history.length} records</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Booked On</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Meal Date</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Meal Type</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Menu Items</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Details</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">No bookings found</td>
                  </tr>
                ) : (
                  history.map(b => (
                    <tr key={b._id || b.id} className="hover:bg-gray-50 transition-colors">
                      {/* Booking Date (when created) */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FiCalendar size={14} className="text-gray-400" />
                          <div>
                            <p className="font-medium">{formatDate(b.createdAt || b.date)}</p>
                            <p className="text-xs text-gray-500">{formatTime(b.createdAt)}</p>
                          </div>
                        </div>
                      </td>
                      {/* Meal Date */}
                      <td className="px-4 py-3 text-gray-700">
                        <span className="font-medium">{formatDate(b.date)}</span>
                      </td>
                      {/* Meal Type */}
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {b.mealType === 'Breakfast' ? '🌅' : b.mealType === 'Lunch' ? '☀️' : '🌙'} {b.mealType}
                      </td>
                      {/* Menu Items */}
                      <td className="px-4 py-3 text-gray-500 max-w-xs">
                        <span className="line-clamp-2">{b.menuItems?.join(', ') || '—'}</span>
                      </td>
                      {/* Status Badge */}
                      <td className="px-4 py-3">
                        <Badge label={b.status} variant={b.status} />
                      </td>
                      {/* Details */}
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {b.status === 'Attended' && b.attendedAt && (
                          <div className="flex items-center gap-1 text-emerald-600">
                            <FiClock size={12} />
                            <p>Marked: {formatDate(b.attendedAt)}</p>
                          </div>
                        )}
                        {b.status === 'Cancelled' && b.cancelledAt && (
                          <p className="text-red-600">Cancelled: {formatDate(b.cancelledAt)}</p>
                        )}
                        {b.status === 'Missed' && (
                          <p className="text-red-600">Not attended</p>
                        )}
                        {(b.status === 'Upcoming' || b.status === 'Booked') && (
                          <p className="text-blue-600">Pending</p>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        {(b.status === 'Upcoming' || b.status === 'Booked') && (
                          <button
                            onClick={() => handleCancel(b._id || b.id)}
                            className="px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        {(b.status === 'Attended' || b.status === 'Missed' || b.status === 'Cancelled') && (
                          <span className="text-gray-400 text-xs">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
