import { useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiCheckCircle, FiClock, FiSearch, FiUserX } from 'react-icons/fi';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';

const formatDate = (dateValue) => {
  const date = new Date(dateValue);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export default function AttendanceManagement() {
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async (selectedDate) => {
    try {
      setLoading(true);
      const data = await api.getBookingsByDate(selectedDate);
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching attendance bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(date);
  }, [date]);

  const handleMarkAttendance = async (bookingId, nextStatus) => {
    try {
      setActionLoadingId(`${bookingId}-${nextStatus}`);
      if (nextStatus === 'Attended') {
        await api.markAsAttended(bookingId);
      } else {
        await api.markAsMissed(bookingId);
      }

      setBookings((prev) => prev.map((booking) => (
        booking._id === bookingId ? { ...booking, status: nextStatus } : booking
      )));

      // notify other tabs/clients to refresh their booking lists
      try { localStorage.setItem('cfis_bookings_updated', Date.now().toString()); } catch (e) {}
    } catch (error) {
      console.error('Error updating attendance status:', error);
    } finally {
      setActionLoadingId('');
    }
  };

  const filteredBookings = useMemo(() => {
    let rows = [...bookings];

    if (statusFilter !== 'all') {
      if (statusFilter === 'Booked') {
        rows = rows.filter((booking) => ['Booked', 'Upcoming'].includes(booking.status));
      } else {
        rows = rows.filter((booking) => booking.status === statusFilter);
      }
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      rows = rows.filter((booking) => {
        const name = booking.student?.name?.toLowerCase() || '';
        const email = booking.student?.email?.toLowerCase() || '';
        const mealType = booking.mealType?.toLowerCase() || '';
        return name.includes(query) || email.includes(query) || mealType.includes(query);
      });
    }

    return rows;
  }, [bookings, search, statusFilter]);

  const summary = useMemo(() => ({
    total: bookings.length,
    booked: bookings.filter((booking) => ['Booked', 'Upcoming'].includes(booking.status)).length,
    attended: bookings.filter((booking) => booking.status === 'Attended').length,
    missed: bookings.filter((booking) => booking.status === 'Missed').length
  }), [bookings]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Attendance Management</h1>
            <p className="text-sm text-slate-500">Mark student meal attendance for booked meals and keep accountability scores accurate.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-2">
            <FiCalendar size={16} />
            <span>{formatDate(date)}</span>
          </div>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">Total Bookings</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{summary.total}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">Pending</p>
            <p className="text-2xl font-semibold text-amber-600 mt-1">{summary.booked}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">Attended</p>
            <p className="text-2xl font-semibold text-emerald-600 mt-1">{summary.attended}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">Missed</p>
            <p className="text-2xl font-semibold text-rose-600 mt-1">{summary.missed}</p>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 min-w-[210px]">
            <FiCalendar className="text-slate-400" size={16} />
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="bg-transparent text-sm text-slate-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 min-w-[220px]">
            <FiSearch className="text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, email, meal"
              className="bg-transparent text-sm text-slate-700 focus:outline-none w-full"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-slate-50 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Booked">Booked</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Attended">Attended</option>
            <option value="Missed">Missed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Student</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Meal</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Hostel/Room</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                      No bookings found for this filter.
                    </td>
                  </tr>
                )}
                {filteredBookings.map((booking) => {
                  const statusColor = booking.status === 'Attended'
                    ? 'bg-emerald-100 text-emerald-700'
                    : booking.status === 'Missed'
                      ? 'bg-rose-100 text-rose-700'
                      : ['Booked', 'Upcoming'].includes(booking.status)
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700';

                  const disabledAction = booking.status === 'Cancelled';

                  return (
                    <tr key={booking._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{booking.student?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{booking.student?.email || '-'}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{booking.mealType}</td>
                      <td className="px-4 py-3 text-slate-700">
                        Hostel {booking.student?.hostel || '-'} / Room {booking.student?.room || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={disabledAction || actionLoadingId === `${booking._id}-Attended`}
                            onClick={() => handleMarkAttendance(booking._id, 'Attended')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiCheckCircle size={13} />
                            Attend
                          </button>
                          <button
                            type="button"
                            disabled={disabledAction || actionLoadingId === `${booking._id}-Missed`}
                            onClick={() => handleMarkAttendance(booking._id, 'Missed')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiUserX size={13} />
                            Miss
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
          <FiClock className="text-indigo-600 mt-0.5" size={16} />
          <p className="text-sm text-indigo-800">
            Marking attendance updates each student&apos;s attendance rate and accountability score automatically based on your backend rules.
          </p>
        </section>
      </main>
    </div>
  );
}
