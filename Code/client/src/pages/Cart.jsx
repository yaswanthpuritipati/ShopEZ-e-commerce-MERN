import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import '../styles/Cart.css';
import BackButton from '../components/BackButton';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(res.data[0]);
      } catch {}
    };
    fetchProfile();
  }, []);

  const handlePlaceOrder = async () => {
    let city = userProfile?.city;
    let paymentMethod = userProfile?.paymentMethod;
    const token = localStorage.getItem('token');
    if (!city || !paymentMethod) {
      city = window.prompt('Enter your city:');
      if (!city) return;
      paymentMethod = window.prompt('Enter payment method (Online or Cash on Delivery):');
      if (!paymentMethod || !['Online', 'Cash on Delivery'].includes(paymentMethod)) {
        alert('Invalid payment method.');
        return;
      }
      // Save to backend
      try {
        await axios.patch('http://localhost:5000/api/users/me', { city, paymentMethod }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile((prev) => ({ ...prev, city, paymentMethod }));
      } catch (err) {
        alert('Failed to save user details.');
        return;
      }
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.post(
        'http://localhost:5000/api/orders',
        {
          products: cartItems.map(item => ({ product: item._id || item.id, quantity: item.quantity })),
          total,
          city,
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(true);
      setLoading(false);
      alert('Order placed successfully!');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Order failed');
      setLoading(false);
      alert(err.response?.data?.error || 'Order failed');
    }
  };

  return (
    <div className="cart-container">
      <BackButton />
      <h2 className="cart-title">Your Cart</h2>
      <hr className="cart-divider" />
      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id || item.id}>
                    <td>
                      <div className="cart-product-info">
                        <img src={item.image} alt={item.name} className="cart-product-img" />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td>₹ {item.price}</td>
                    <td>{item.quantity}</td>
                    <td>₹ {item.price * item.quantity}</td>
                    <td>
                      <button
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item._id || item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cart-total-row">
            Total: <span className="cart-total">₹ {total}</span>
          </div>
          {error && <p className="cart-error">{error}</p>}
          {success && <p className="cart-success">Order placed successfully!</p>}
          <div className="cart-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <Link to="/profile" style={{ width: 250 }}>
              <button className="cart-changeprofile-btn" style={{ width: '100%', background: '#4f46e5', color: '#fff' }}>
                Change Address/Payment
              </button>
            </Link>
            <button
              className="cart-placeorder-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
              style={{ width: 250 }}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart; 