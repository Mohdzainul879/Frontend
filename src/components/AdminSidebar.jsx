import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiTrendingUp, FiUsers, FiBarChart2, FiBook, FiLogOut,
  FiChevronLeft, FiChevronRight, FiShield
} from 'react-icons/fi';

const sidebarLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/admin/predictions', label: 'Predictions', icon: FiTrendingUp },
  { to: '/admin/students', label: 'Students', icon: FiUsers },
  { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/admin/menu', label: 'Menu', icon: FiBook },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside
      className={`bg-slate-900 text-white flex flex-col min-h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'} shrink-0`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <FiShield className="text-indigo-400" size={20} />
            <span className="font-bold text-sm text-indigo-200">Admin Panel</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors ml-auto"
        >
          {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 py-4">
        {sidebarLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            title={collapsed ? label : ''}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors
              ${location.pathname === to
                ? 'bg-indigo-700 text-white border-r-2 border-indigo-400'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : ''}
          className="flex items-center gap-3 w-full text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-2 py-2 rounded transition-colors"
        >
          <FiLogOut size={18} className="shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
}
