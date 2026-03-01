import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';

export default function AdminLogin() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && isAdmin) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success && result.isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <FiShield className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-400 mt-1">Campus Food Intelligence System</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Administrator Sign In</h2>

          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-300 rounded-lg px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Admin Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-slate-400" size={16} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@campus.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-slate-400" size={16} />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? <LoadingSpinner size="sm" color="white" /> : 'Sign In as Admin'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-slate-700 rounded-lg text-xs text-slate-400">
            <p className="font-medium text-slate-300 mb-1">Demo Admin Credentials:</p>
            <p>Email: admin@campus.com</p>
            <p>Password: admin123</p>
          </div>
        </div>

        <div className="text-center mt-4 text-sm text-slate-400">
          Student portal?{' '}
          <a href="/login" className="text-indigo-400 hover:underline">Student Login →</a>
        </div>
      </div>
    </div>
  );
}
