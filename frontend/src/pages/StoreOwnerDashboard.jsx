import React, { useState } from 'react';
import { Store, Star, Users } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { StarRating } from '../components/StarRating';

export const StoreOwnerDashboard = ({ token }) => {
  const [data, setData] = useState(null);

  const fetchOwnerDashboard = async () => {
    const res = await fetch('http://localhost:5000/api/owner/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setData(await res.json());
  };

  React.useEffect(() => {
    fetchOwnerDashboard();
  }, []);

  if (!data) return <div>Loading dashboard...</div>;

  if (!data.store) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', background: '#1e293b', borderRadius: '12px' }}>
        <Store size={48} style={{ color: '#818cf8', marginBottom: '1rem' }} />
        <h2>No Store Assigned</h2>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Your store owner account is currently not assigned to any active store listing.</p>
      </div>
    );
  }

  const columns = [
    { label: 'Customer Name', key: 'userName' },
    { label: 'Email', key: 'userEmail' },
    { label: 'Address', key: 'userAddress' },
    {
      label: 'Submitted Rating',
      key: 'rating',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StarRating value={row.rating} readonly size={18} />
          <span style={{ fontWeight: 600 }}>{row.rating} / 5</span>
        </div>
      )
    },
    {
      label: 'Date',
      key: 'updatedAt',
      render: (row) => new Date(row.updatedAt).toLocaleDateString()
    }
  ];

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Store size={26} /></div>
          <div className="stat-info">
            <h4>My Store</h4>
            <p style={{ fontSize: '1.4rem' }}>{data.store.name}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><Star size={26} style={{ color: '#f59e0b', fill: '#f59e0b' }} /></div>
          <div className="stat-info">
            <h4>Average Rating</h4>
            <p>{data.averageRating} / 5</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><Users size={26} /></div>
          <div className="stat-info">
            <h4>Total Ratings Received</h4>
            <p>{data.ratings.length}</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Users Who Submitted Ratings</h3>
      </div>

      <DataTable columns={columns} data={data.ratings} />
    </div>
  );
};
