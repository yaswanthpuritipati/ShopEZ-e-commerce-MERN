import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCity(res.data.city || '');
        setPaymentMethod(res.data.paymentMethod || '');
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    const token = localStorage.getItem('token');
    try {
      await axios.patch('http://localhost:5000/api/users/me', { city, paymentMethod }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Profile</h2>
      {!editing ? (
        <div>
          <div style={{ marginBottom: 16 }}>
            <label>City:</label>
            <div style={{ padding: 8, background: '#f5f5f5', borderRadius: 4, marginTop: 4 }}>{city || <span style={{ color: '#888' }}>Not set</span>}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Payment Method:</label>
            <div style={{ padding: 8, background: '#f5f5f5', borderRadius: 4, marginTop: 4 }}>{paymentMethod || <span style={{ color: '#888' }}>Not set</span>}</div>
          </div>
          <button onClick={() => setEditing(true)} style={{ padding: '8px 18px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 5, fontWeight: 600 }}>
            Update
          </button>
          {success && <div style={{ color: 'green', marginTop: 16 }}>Profile updated!</div>}
          {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label>City:</label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Payment Method:</label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
              required
            >
              <option value="">Select...</option>
              <option value="Online">Online</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '8px 18px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 5, fontWeight: 600 }}>
            Save
          </button>
          <button type="button" onClick={() => setEditing(false)} style={{ marginLeft: 12, padding: '8px 18px', background: '#888', color: '#fff', border: 'none', borderRadius: 5, fontWeight: 600 }}>
            Cancel
          </button>
          {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
        </form>
      )}
    </div>
  );
};

export default Profile; 