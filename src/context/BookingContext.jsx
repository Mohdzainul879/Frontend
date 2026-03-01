import { createContext, useContext, useState } from 'react';
import { mockBookings } from '../utils/mockData';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(mockBookings);

  const addBooking = (booking) => {
    const newBooking = { ...booking, id: Date.now(), status: 'Upcoming' };
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };

  const cancelBooking = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
  };

  const getBookingsByDate = (date) => bookings.filter(b => b.date === date);

  const getBookingHistory = (filters = {}) => {
    let filtered = [...bookings];
    if (filters.status) filtered = filtered.filter(b => b.status === filters.status);
    if (filters.mealType) filtered = filtered.filter(b => b.mealType === filters.mealType);
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking, getBookingsByDate, getBookingHistory }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
