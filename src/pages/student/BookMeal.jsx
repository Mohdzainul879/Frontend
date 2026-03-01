import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { useMenu } from '../../context/MenuContext';
import StudentNavbar from '../../components/StudentNavbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';

const mealTypes = [
  { type: 'Breakfast', timing: '7:30 AM – 9:30 AM', emoji: '🌅' },
  { type: 'Lunch', timing: '12:00 PM – 2:00 PM', emoji: '☀️' },
  { type: 'Dinner', timing: '7:00 PM – 9:00 PM', emoji: '🌙' },
];

function getNext7Days() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
    });
  }
  return days;
}

export default function BookMeal() {
  const { user } = useAuth();
  const { bookings, addBooking, cancelBooking } = useBooking();
  const { getMenuByDate } = useMenu();

  const days = getNext7Days();
  const [selectedDate, setSelectedDate] = useState(days[0].date);
  const [selectedMeal, setSelectedMeal] = useState('Lunch');
  const [specialRequest, setSpecialRequest] = useState('');
  const [toast, setToast] = useState(null);

  const studentId = user?.id || 1;
  const menuItems = getMenuByDate(selectedDate).find(m => m.mealType === selectedMeal);
  const existingBooking = bookings.find(
    b => b.studentId === studentId && b.date === selectedDate && b.mealType === selectedMeal
  );

  const isBooked = existingBooking && existingBooking.status !== 'Cancelled';

  const handleBook = () => {
    if (isBooked) {
      cancelBooking(existingBooking.id);
      setToast({ message: 'Booking cancelled successfully.', type: 'info' });
    } else {
      addBooking({
        studentId,
        studentName: user?.name || 'Student',
        date: selectedDate,
        mealType: selectedMeal,
        menuItems: menuItems?.items || [],
        specialRequest,
      });
      setToast({ message: `${selectedMeal} booked for ${selectedDate}!`, type: 'success' });
      setSpecialRequest('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StudentNavbar />
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Book a Meal</h1>
          <p className="text-gray-500 text-sm mt-1">Select a date and meal type to book your slot</p>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Select Date</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map(({ date, label }) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium border transition-colors
                  ${selectedDate === date
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Type Selector */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Select Meal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {mealTypes.map(({ type, timing, emoji }) => {
              const booking = bookings.find(
                b => b.studentId === studentId && b.date === selectedDate && b.mealType === type
              );
              const booked = booking && booking.status !== 'Cancelled';
              return (
                <button
                  key={type}
                  onClick={() => setSelectedMeal(type)}
                  className={`relative rounded-xl border-2 p-4 text-left transition-all
                    ${selectedMeal === type
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-100 bg-gray-50 hover:border-emerald-300'}`}
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  <p className="font-semibold text-gray-800">{type}</p>
                  <p className="text-xs text-gray-500">{timing}</p>
                  {booked && (
                    <span className="absolute top-2 right-2 bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                      Booked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Preview */}
        {menuItems && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Menu Preview</h2>
            <div className="flex flex-wrap gap-2">
              {menuItems.items.map((item, i) => (
                <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm px-3 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Special Requests */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Special Request (Optional)</h2>
          <textarea
            rows={3}
            value={specialRequest}
            onChange={e => setSpecialRequest(e.target.value)}
            placeholder="E.g., less spicy, no onion, extra roti..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
          />
        </div>

        {/* Book Button */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-gray-800">{selectedMeal} on {selectedDate}</p>
              <p className="text-sm text-gray-500">{isBooked ? 'You have a booking for this slot.' : 'No booking yet for this slot.'}</p>
            </div>
            {isBooked && (
              <span className="bg-emerald-100 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full">✅ Booked</span>
            )}
          </div>
          <button
            onClick={handleBook}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors
              ${isBooked
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
          >
            {isBooked ? '✕ Cancel Booking' : '✓ Confirm Booking'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
