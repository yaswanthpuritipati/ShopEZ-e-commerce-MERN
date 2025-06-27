import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SearchAndFilters from '../components/SearchAndFilters';
import { useCart } from '../context/CartContext';
// import '../styles/categories.css';
const CategoryPage = () => {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [userProfile, setUserProfile] = useState(null);

  const fetchProducts = useCallback(async (currentFilters = {}, isSearch = false) => {
    if (isSearch) {
      setSearchLoading(true);
    } else {
      setLoading(true);
    }
    
    try {
      const params = new URLSearchParams();
      // Always include the category filter
      params.append('category', decodedCategory);
      
      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.minPrice) params.append('minPrice', currentFilters.minPrice);
      if (currentFilters.maxPrice) params.append('maxPrice', currentFilters.maxPrice);
      if (currentFilters.sortBy) params.append('sortBy', currentFilters.sortBy);

      const url = `http://localhost:5000/api/products?${params.toString()}`;
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      setError('Error fetching products.');
      console.error('Error fetching products:', err);
    } finally {
      if (isSearch) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [decodedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Find current user by matching token (assuming backend returns all users, adjust if needed)
        // If backend has /users/me, use that instead
        // For now, try to get the first user (should be replaced with /me endpoint)
        setUserProfile(res.data[0]);
      } catch {}
    };
    fetchProfile();
  }, []);

  const handleFiltersChange = useCallback((newFilters) => {
    fetchProducts(newFilters, true);
  }, [fetchProducts]);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert('Added to cart!');
  };

  const handlePlaceOrder = async (product) => {
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
    <div style={{ padding: '2rem' }}>
      <Link to="/">&larr; Back to Home</Link>
      <h2 style={{ marginTop: '2rem' }}>Category: {decodedCategory}</h2>
      <div style={{ margin: '1rem 0', display: 'flex', justifyContent: 'center' }}>
        <Link to="/profile" style={{ width: 250 }}>
          <button style={{ width: '100%', background: '#4f46e5', color: '#fff', padding: '8px 18px', border: 'none', borderRadius: 5, fontWeight: 600 }}>
            Change Address/Payment
          </button>
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div style={{ marginTop: '2rem' }}>
        <SearchAndFilters 
          onFiltersChange={handleFiltersChange} 
          initialFilters={{ category: decodedCategory }}
        />
      </div>

      {loading ? (
        <div>Loading products...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          {searchLoading && (
            <div style={{ 
              width: '100%', 
              textAlign: 'center', 
              padding: '1rem',
              color: '#666',
              fontSize: '0.9rem'
            }}>
              Searching...
            </div>
          )}
          {!searchLoading && products.length > 0 ? (
            products.map((product) => (
              <div key={product._id}>
                <ProductCard 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  onPlaceOrder={handlePlaceOrder}
                />
              </div>
            ))
          ) : !searchLoading && (
            <div>No products found in this category.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
