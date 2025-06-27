import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view your orders.');
      setLoading(false);
      return;
    }
    axios.get('http://localhost:5000/api/orders/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Error fetching orders');
        setLoading(false);
      });
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/orders/my/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionMsg('Order cancelled successfully.');
      setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o));
    } catch (err) {
      setActionMsg(err.response?.data?.error || 'Failed to cancel order.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <BackButton />
      <h2>Your Orders</h2>
      {loading ? (
        <div>Loading orders...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : orders.length === 0 ? (
        <div>You have no orders yet.</div>
      ) : (
        <div>
          {actionMsg && <div style={{ color: '#4f46e5', marginBottom: 16 }}>{actionMsg}</div>}
          {orders.map(order => (
            <div key={order._id} style={{ border: '1px solid #eee', borderRadius: 8, marginBottom: 24, padding: 16 }}>
              <Link to={`/orders/${order._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ marginBottom: 8 }}>
                  <strong>Order ID:</strong> {order._id}<br />
                  <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}<br />
                  <strong>Status:</strong> {order.status}<br />
                  <strong>Total:</strong> ₹ {order.total}
                </div>
                <div>
                  <strong>Products:</strong>
                  <ul>
                    {order.products.map((item, idx) => (
                      <li key={idx}>
                        {item.product?.name || 'Product'} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
              {/* Cancel Order Button */}
              {(order.status === 'Pending' || order.status === 'Processing') && (
                <button
                  style={{ marginTop: 10, background: '#e53935', color: '#fff', border: 'none', borderRadius: 5, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => handleCancelOrder(order._id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 