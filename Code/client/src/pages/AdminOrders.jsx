import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminOrders.css';
import BackButton from '../components/BackButton';

const AdminOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);

  useEffect(() => {
    if (!user || !user.isAdmin) return;
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/orders', {
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
  }, [user]);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdating(orderId);
    const token = localStorage.getItem('token');
    axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        setStatusUpdating(null);
      })
      .catch(() => {
        setStatusUpdating(null);
        alert('Failed to update status');
      });
  };

  if (!user || !user.isAdmin) return <div className="adminorders-unauth">Unauthorized</div>;

  return (
    <div className="adminorders-container">
      <BackButton />
      <h2 className="adminorders-title">All Orders</h2>
      <hr className="adminorders-divider" />
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="adminorders-error">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="adminorders-grid">
          {orders.map(order => (
            <div className="adminorders-card" key={order._id}>
              <div className="adminorders-card-header">
                <span>Order ID: {order._id}</span>
                <span>User: {order.user?.name || 'User'} ({order.user?.email || 'N/A'})</span>
                <span>Date: {new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="adminorders-status-row">
                <span>Status:</span>
                <select
                  className="adminorders-status-select"
                  value={order.status}
                  onChange={e => handleStatusChange(order._id, e.target.value)}
                  disabled={statusUpdating === order._id}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {statusUpdating === order._id && <span className="adminorders-updating">Updating...</span>}
              </div>
              <div className="adminorders-total">
                Total: <span>₹ {order.total}</span>
              </div>
              <hr className="adminorders-divider" />
              <div className="adminorders-products">
                <div className="adminorders-products-title">Products:</div>
                <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
                  {order.products.map((item, idx) => (
                    <li className="adminorders-product-item" key={idx}>
                      {item.product?.name || 'Product'} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 