import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiCalendar, FiClock, FiUser, FiLogOut, FiMenu, FiX
} from 'react-icons/fi';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/book-meal', label: 'Book Meal', icon: FiCalendar },
  { to: '/booking-history', label: 'History', icon: FiClock },
  { to: '/profile', label: 'Profile', icon: FiUser },
];

export default function StudentNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <nav className="bg-emerald-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="text-white font-bold text-lg hidden sm:block">Campus FIS</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${location.pathname === to
                    ? 'bg-emerald-900 text-white'
                    : 'text-emerald-100 hover:bg-emerald-600 hover:text-white'}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
              <span className="text-emerald-100 text-sm">{user?.name?.split(' ')[0]}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-emerald-100 hover:bg-emerald-600 hover:text-white transition-colors"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-emerald-800 px-4 pb-4">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium my-1 transition-colors
                ${location.pathname === to
                  ? 'bg-emerald-900 text-white'
                  : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <div className="border-t border-emerald-700 mt-2 pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
              <span className="text-emerald-100 text-sm">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-emerald-100 hover:text-white"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
