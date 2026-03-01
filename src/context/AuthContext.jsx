import { createContext, useContext, useState, useEffect } from 'react';
import { mockStudents, adminUser } from '../utils/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('cfis_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (email, password) => {
    if (email === adminUser.email && password === adminUser.password) {
      const u = { ...adminUser, isAdmin: true };
      setUser(u);
      localStorage.setItem('cfis_user', JSON.stringify(u));
      return { success: true, isAdmin: true };
    }
    const student = mockStudents.find(s => s.email === email && s.password === password);
    if (student) {
      const u = { ...student, isAdmin: false };
      setUser(u);
      localStorage.setItem('cfis_user', JSON.stringify(u));
      return { success: true, isAdmin: false };
    }
    return { success: false };
  };

  const register = (userData) => {
    const u = { ...userData, id: Date.now(), isAdmin: false, accountabilityScore: 100, attendanceRate: 100, totalBookings: 0 };
    setUser(u);
    localStorage.setItem('cfis_user', JSON.stringify(u));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cfis_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isAdmin: user?.isAdmin || false }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
