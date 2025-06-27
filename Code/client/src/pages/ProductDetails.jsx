import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetails.css';
import BackButton from '../components/BackButton';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Product not found.');
        setLoading(false);
      });
  }, [id]);

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

  if (loading) return <div className="productdetails-loading">Loading...</div>;
  if (error || !product) return <div className="productdetails-error">{error || 'Product not found.'}</div>;

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

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
    try {
      await axios.post('http://localhost:5000/api/orders', {
        products: [{ product: product._id || product.id, quantity: 1 }],
        total: product.discountedPrice || product.price,
        city,
        paymentMethod,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Order placed successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Order failed');
    }
  };

  return (
    <div className="productdetails-container">
      <BackButton />
      <div className="productdetails-card">
        <img
          src={product.image}
          alt={product.name}
          className="productdetails-img"
        />
        <div className="productdetails-info">
          <h2 className="productdetails-title">{product.name}</h2>
          <hr className="productdetails-divider" />
          <p className="productdetails-desc">{product.description}</p>
          <div className="productdetails-meta">
            {product.discountedPrice ? (
              <>
                <span className="productdetails-price">₹ {product.discountedPrice}</span>
                <span style={{ textDecoration: 'line-through', color: '#888', marginLeft: 8 }}>₹ {product.price}</span>
              </>
            ) : (
              <span className="productdetails-price">₹ {product.price}</span>
            )}
            <span className="productdetails-category">{product.category}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 24 }}>
            <button
              className="productdetails-add-btn"
              onClick={handleAddToCart}
              style={{ width: 250 }}
            >
              Add to Cart
            </button>
            <Link to="/profile" style={{ width: 250 }}>
              <button
                className="productdetails-add-btn"
                style={{ width: '100%', background: '#4f46e5', color: '#fff' }}
              >
                Change Address/Payment
              </button>
            </Link>
            <button
              className="productdetails-add-btn"
              style={{ width: 250 }}
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
          {added && <p className="productdetails-success">Added to cart!</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 