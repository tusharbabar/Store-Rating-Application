import React, { useState } from 'react';

export const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const endpoint = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/signup';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || [data.error || 'Authentication failed']);
      } else {
        if (isLogin) {
          onLoginSuccess(data.token, data.user);
        } else {
          alert('Signup successful! Please log in.');
          setIsLogin(true);
        }
      }
    } catch (err) {
      setErrors([err.message]);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ maxWidth: '460px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.25rem', textAlign: 'center' }}>
          {isLogin ? 'Sign In to Platform' : 'Create Normal User Account'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          {isLogin ? 'Enter your credentials to access your portal' : 'Fill in required fields according to specifications'}
        </p>

        {errors.length > 0 && (
          <div className="error-banner">
            {errors.map((err, i) => <div key={i}>{err}</div>)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-control" style={{ marginBottom: '1rem' }}>
                <label>Full Name (20 to 60 characters)</label>
                <input
                  required
                  placeholder="e.g. Johnathan Alexander Smith Senior"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-control" style={{ marginBottom: '1rem' }}>
                <label>Address (Max 400 characters)</label>
                <textarea
                  required
                  placeholder="Street, City, Zipcode..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="form-control" style={{ marginBottom: '1rem' }}>
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-control" style={{ marginBottom: '1.5rem' }}>
            <label>Password {!isLogin && '(8-16 chars, 1 uppercase, 1 special char)'}</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
          {isLogin ? "Don't have an account? " : "Already registered? "}
          <span
            style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => { setIsLogin(!isLogin); setErrors([]); }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </div>
      </div>
    </div>
  );
};
