import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { StarRating } from '../components/StarRating';

export const NormalUserDashboard = ({ token }) => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const fetchStores = async () => {
    const res = await fetch(`http://localhost:5000/api/stores?search=${encodeURIComponent(search)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setStores(await res.json());
  };

  React.useEffect(() => {
    fetchStores();
  }, [search]);

  const handleRatingChange = async (storeId, newRating) => {
    try {
      const res = await fetch(`http://localhost:5000/api/stores/${storeId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: newRating })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Rating updated successfully!');
        setTimeout(() => setMessage(''), 3000);
        fetchStores();
      } else {
        alert(data.error || 'Failed to submit rating');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    { label: 'Store Name', key: 'name' },
    { label: 'Address', key: 'address' },
    {
      label: 'Overall Rating',
      key: 'overallRating',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StarRating value={Math.round(row.overallRating)} readonly size={18} />
          <span style={{ fontWeight: 600 }}>{row.overallRating}</span>
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>({row.ratingCount} reviews)</span>
        </div>
      )
    },
    {
      label: 'Your Submitted Rating',
      key: 'userRating',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <StarRating
            value={row.userRating || 0}
            onChange={(val) => handleRatingChange(row.id, val)}
            size={22}
          />
          <span style={{ fontSize: '0.75rem', color: row.userRating ? '#34d399' : '#94a3b8' }}>
            {row.userRating ? `You rated ${row.userRating} / 5 (Click star to modify)` : 'Click to rate this store'}
          </span>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Store Listings & Ratings</h2>
        <p style={{ color: '#94a3b8' }}>Search for registered stores and submit or modify your ratings (1 to 5 stars).</p>
      </div>

      {message && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {message}
        </div>
      )}

      <div className="controls-bar">
        <div className="search-input-group" style={{ maxWidth: '500px' }}>
          <Search size={18} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search stores by Name or Address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <DataTable columns={columns} data={stores} />
    </div>
  );
};
