import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading order details...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!order) return null;

  const isAdmin = user && user.isAdmin;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <BackButton />
      <h2 style={{ marginBottom: '1rem' }}>Order Details</h2>
      <div style={{ marginBottom: '1rem', color: '#555' }}>
        <div><b>Order ID:</b> {order._id}</div>
        <div><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</div>
        <div><b>Status:</b> {order.status || 'Placed'}</div>
        {isAdmin && order.user && (
          <div><b>User:</b> {order.user.name} ({order.user.email})</div>
        )}
      </div>
      <h3 style={{ margin: '1.5rem 0 1rem 0' }}>Products</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {order.products.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #eee', paddingBottom: 10 }}>
            <img src={item.product?.image || '/images/banner.jpg'} alt={item.product?.name} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{item.product?.name}</div>
              <div style={{ color: '#888', fontSize: 14 }}>{item.product?.category}</div>
              <div style={{ fontSize: 15 }}>₹ {item.product?.price} x {item.quantity}</div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>₹ {item.product?.price * item.quantity}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '2rem', textAlign: 'right', fontSize: 18 }}>
        <b>Total:</b> ₹ {order.total}
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Link to={isAdmin ? '/admin/orders' : '/orders'} style={{ color: '#007bff', textDecoration: 'underline' }}>Back to Orders</Link>
      </div>
    </div>
  );
};

export default OrderDetails; 