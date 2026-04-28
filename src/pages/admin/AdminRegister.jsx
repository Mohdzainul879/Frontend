import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiUser, FiMail, FiLock, FiKey, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';

export default function AdminRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    adminKey: '',
    department: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const departments = ['Operations', 'Finance', 'Kitchen', 'Nutrition', 'Quality Control', 'Management'];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.includes('@')) e.email = 'Valid email address required';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(form.password)) e.password = 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(form.password)) e.password = 'Password must contain at least one number';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.adminKey.trim()) e.adminKey = 'Admin registration key is required';
    if (!form.department) e.department = 'Please select a department';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'admin',
        adminKey: form.adminKey,
        department: form.department
      });
      setLoading(false);
      
      if (result.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setErrors({ submit: result.message || 'Registration failed' });
      }
    } catch (error) {
      setLoading(false);
      setErrors({ submit: 'An error occurred during registration' });
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Back Button */}
        <Link
          to="/admin/login"
          className="flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
        >
          <FiArrowLeft size={16} />
          Back to Admin Login
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <FiKey className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Registration</h1>
          <p className="text-slate-400 mt-2">Create your admin account</p>
        </div>

        {/* Registration Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8">
          {/* Warning/Info Box */}
          <div className="bg-indigo-900 bg-opacity-50 border border-indigo-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-indigo-200">
              ℹ️ Use the registration key provided by the system administrator to create your account.
            </p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-300 rounded-lg px-4 py-3 mb-6 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="John Kumar"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-700 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.name ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="admin@campus.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-700 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.email ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Department *</label>
              <select
                value={form.department}
                onChange={handleChange('department')}
                className={`w-full px-4 py-2.5 bg-slate-700 border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.department ? 'border-red-500' : 'border-slate-600'
                }`}
              >
                <option value="">Select a department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-400 text-xs mt-1.5">{errors.department}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password *</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-700 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.password ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password *</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-700 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-300"
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword}</p>}
            </div>

            {/* Admin Key */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Admin Registration Key *</label>
              <div className="relative">
                <FiKey className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input
                  type="password"
                  value={form.adminKey}
                  onChange={handleChange('adminKey')}
                  placeholder="Enter the admin registration key"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-700 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.adminKey ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
              </div>
              {errors.adminKey && <p className="text-red-400 text-xs mt-1.5">{errors.adminKey}</p>}
              <p className="text-xs text-slate-400 mt-1.5">
                💡 Request the admin key from the system administrator
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 text-white font-medium py-2.5 rounded-lg transition-colors mt-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Creating Account...
                </>
              ) : (
                'Create Admin Account'
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-slate-400 text-sm mt-4">
              Already have an account?{' '}
              <Link to="/admin/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                Sign In
              </Link>
            </p>
          </form>
        </div>

        {/* Password Requirements */}
        <div className="mt-6 bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-300 mb-2">Password Requirements:</p>
          <ul className="text-xs text-slate-400 space-y-1">
            <li className="flex items-center gap-2">
              <span className={form.password.length >= 8 ? 'text-green-400' : ''}>
                {form.password.length >= 8 ? '✓' : '○'} At least 8 characters
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className={/[A-Z]/.test(form.password) ? 'text-green-400' : ''}>
                {/[A-Z]/.test(form.password) ? '✓' : '○'} One uppercase letter
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className={/[0-9]/.test(form.password) ? 'text-green-400' : ''}>
                {/[0-9]/.test(form.password) ? '✓' : '○'} One number
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
