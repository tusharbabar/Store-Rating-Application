import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
export const PasswordModal = ({ isOpen, onClose, token }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || [data.error || 'Failed to update password']);
      } else {
        setSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      setErrors([err.message]);
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3><Lock size={18} style={{ display: 'inline', marginRight: '6px' }} /> Update Password</h3>
          <X size={20} style={{ cursor: 'pointer' }} onClick={onClose} />
        </div>
        {errors.length > 0 && (
          <div className="error-banner">
            {errors.map((err, i) => <div key={i}>{err}</div>)}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-control" style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-control" style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              placeholder="8-16 chars, 1 uppercase, 1 special char"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn-logout" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Update Password</button>
          </div>
        </form>
      </div>
    </div>
  );
};




