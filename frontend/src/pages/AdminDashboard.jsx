import React, { useState } from 'react';
import { Store, UserPlus, Users, Search, Plus, Star } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { StarRating } from '../components/StarRating';

export const AdminDashboard = ({ token }) => {
  const [activeTab, setActiveTab] = useState('stores');
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Modals state
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [errors, setErrors] = useState([]);

  // Form states
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', ownerEmail: '', ownerPassword: '' });
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });

  const fetchStats = async () => {
    const res = await fetch('http://localhost:5000/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setStats(await res.json());
  };

  const fetchStores = async () => {
    const res = await fetch(`http://localhost:5000/api/admin/stores?search=${encodeURIComponent(search)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setStores(await res.json());
  };

  const fetchUsers = async () => {
    const res = await fetch(
      `http://localhost:5000/api/admin/users?search=${encodeURIComponent(search)}&role=${roleFilter}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) setUsers(await res.json());
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  React.useEffect(() => {
    if (activeTab === 'stores') fetchStores();
    else fetchUsers();
  }, [activeTab, search, roleFilter]);

  const handleAddStore = async (e) => {
    e.preventDefault();
    setErrors([]);
    const res = await fetch('http://localhost:5000/api/admin/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(storeForm)
    });
    const data = await res.json();
    if (!res.ok) setErrors(data.errors || [data.error || 'Failed to create store']);
    else {
      setShowStoreModal(false);
      setStoreForm({ name: '', email: '', address: '', ownerEmail: '', ownerPassword: '' });
      fetchStats();
      fetchStores();
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setErrors([]);
    const res = await fetch('http://localhost:5000/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(userForm)
    });
    const data = await res.json();
    if (!res.ok) setErrors(data.errors || [data.error || 'Failed to create user']);
    else {
      setShowUserModal(false);
      setUserForm({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
      fetchStats();
      fetchUsers();
    }
  };

  const storeColumns = [
    { label: 'Store Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Address', key: 'address' },
    {
      label: 'Rating',
      key: 'rating',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StarRating value={Math.round(row.rating)} readonly size={16} />
          <span style={{ fontWeight: 600 }}>{row.rating}</span>
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>({row.totalRatings})</span>
        </div>
      )
    }
  ];

  const userColumns = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Address', key: 'address' },
    {
      label: 'Role',
      key: 'role',
      render: (row) => <span className="role-badge">{row.role}</span>
    },
    {
      label: 'Store Rating (If Owner)',
      key: 'storeRating',
      render: (row) => row.role === 'STORE_OWNER' ? (
        row.storeRating !== null ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <StarRating value={Math.round(row.storeRating)} readonly size={16} />
            <span>{row.storeRating}</span>
          </div>
        ) : <span style={{ color: '#64748b' }}>No store assigned</span>
      ) : <span style={{ color: '#475569' }}>N/A</span>
    }
  ];

  return (
    <div>
      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users size={26} /></div>
          <div className="stat-info">
            <h4>Total Users</h4>
            <p>{stats.totalUsers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Store size={26} /></div>
          <div className="stat-info">
            <h4>Total Stores</h4>
            <p>{stats.totalStores}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
            <Star size={26} style={{ fill: '#fbbf24' }} />
          </div>
          <div className="stat-info">
            <h4>Submitted Ratings</h4>
            <p>{stats.totalRatings}</p>
          </div>
        </div>
      </div>

      {/* Tabs and Add Buttons */}
      <div className="controls-bar">
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className={`btn-action ${activeTab === 'stores' ? 'btn-primary' : 'btn-logout'}`}
            onClick={() => setActiveTab('stores')}
          >
            Stores Directory
          </button>
          <button
            className={`btn-action ${activeTab === 'users' ? 'btn-primary' : 'btn-logout'}`}
            onClick={() => setActiveTab('users')}
          >
            Users Directory
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="search-input-group">
            <Search size={18} style={{ color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by Name, Email, Address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {activeTab === 'users' && (
            <div className="form-control" style={{ margin: 0, width: 'auto' }}>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">All Roles</option>
                <option value="ADMIN">System Admin</option>
                <option value="USER">Normal User</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
            </div>
          )}

          {activeTab === 'stores' ? (
            <button className="btn-primary" onClick={() => { setErrors([]); setShowStoreModal(true); }}>
              <Plus size={18} /> Add Store
            </button>
          ) : (
            <button className="btn-primary" onClick={() => { setErrors([]); setShowUserModal(true); }}>
              <UserPlus size={18} /> Add User
            </button>
          )}
        </div>
      </div>

      {/* Data Tables */}
      {activeTab === 'stores' ? (
        <DataTable columns={storeColumns} data={stores} />
      ) : (
        <DataTable columns={userColumns} data={users} />
      )}

      {/* Modal Add Store */}
      {showStoreModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Store</h3>
            {errors.length > 0 && <div className="error-banner">{errors.map((e, i) => <div key={i}>{e}</div>)}</div>}
            <form onSubmit={handleAddStore}>
              <div className="form-control"><label>Store Name</label><input required value={storeForm.name} onChange={e=>setStoreForm({...storeForm, name: e.target.value})} /></div>
              <div className="form-control"><label>Store Email</label><input required type="email" value={storeForm.email} onChange={e=>setStoreForm({...storeForm, email: e.target.value})} /></div>
              <div className="form-control"><label>Address</label><textarea required value={storeForm.address} onChange={e=>setStoreForm({...storeForm, address: e.target.value})} /></div>
              <div style={{ marginTop: '1rem', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#818cf8', marginBottom: '0.5rem' }}>Assign Store Owner (Optional)</h4>
                <div className="form-control"><label>Owner Email</label><input type="email" value={storeForm.ownerEmail} onChange={e=>setStoreForm({...storeForm, ownerEmail: e.target.value})} /></div>
                <div className="form-control"><label>Owner Password (If creating new owner account)</label><input type="password" value={storeForm.ownerPassword} onChange={e=>setStoreForm({...storeForm, ownerPassword: e.target.value})} /></div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn-logout" onClick={() => setShowStoreModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Store</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add User */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New User</h3>
            {errors.length > 0 && <div className="error-banner">{errors.map((e, i) => <div key={i}>{e}</div>)}</div>}
            <form onSubmit={handleAddUser}>
              <div className="form-control"><label>Full Name (20-60 chars)</label><input required value={userForm.name} onChange={e=>setUserForm({...userForm, name: e.target.value})} /></div>
              <div className="form-control"><label>Email</label><input required type="email" value={userForm.email} onChange={e=>setUserForm({...userForm, email: e.target.value})} /></div>
              <div className="form-control"><label>Role</label>
                <select value={userForm.role} onChange={e=>setUserForm({...userForm, role: e.target.value})}>
                  <option value="USER">Normal User</option>
                  <option value="ADMIN">System Administrator</option>
                  <option value="STORE_OWNER">Store Owner</option>
                </select>
              </div>
              <div className="form-control"><label>Password (8-16 chars, 1 Upper, 1 Special)</label><input required type="password" value={userForm.password} onChange={e=>setUserForm({...userForm, password: e.target.value})} /></div>
              <div className="form-control"><label>Address (Max 400 chars)</label><textarea required value={userForm.address} onChange={e=>setUserForm({...userForm, address: e.target.value})} /></div>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn-logout" onClick={() => setShowUserModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
