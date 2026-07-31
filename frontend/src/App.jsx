import React, { useState, useEffect } from 'react';
import { Store, LogOut, KeyRound, User } from 'lucide-react';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { NormalUserDashboard } from './pages/NormalUserDashboard';
import { StoreOwnerDashboard } from './pages/StoreOwnerDashboard';
import { PasswordModal } from './components/PasswordModal';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLoginSuccess = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (!token || !user) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="brand">
          <Store size={26} />
          <span>Store Rating Portal</span>
        </div>

        <div className="nav-user">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} style={{ color: '#818cf8' }} />
            <span style={{ fontWeight: 600 }}>{user.name}</span>
          </div>

          <span className="role-badge">{user.role}</span>

          <button className="btn-action btn-secondary" onClick={() => setShowPasswordModal(true)}>
            <KeyRound size={16} /> Update Password
          </button>

          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Main Role Content */}
      <main className="main-content">
        {(user.role === 'ADMIN' || user.role === 'SYSTEM_ADMIN') && <AdminDashboard token={token} />}
        {(user.role === 'USER' || user.role === 'NORMAL_USER') && <NormalUserDashboard token={token} />}
        {user.role === 'STORE_OWNER' && <StoreOwnerDashboard token={token} />}
      </main>

      {/* Password Modal */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        token={token}
      />
    </div>
  );
}
