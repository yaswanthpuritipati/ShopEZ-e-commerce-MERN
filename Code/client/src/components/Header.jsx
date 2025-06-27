import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/header.css';

function Header() {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" className="logo">ShopEZ</Link>
      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', alignItems: 'center', margin: '0 20px' }}>
        <input
          className="search-bar"
          type="text"
          placeholder="Search Electronics, Fashion, mobiles, etc.,"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          aria-label="search products"
        />
        <button type="submit" className="header-search-btn" title="Search">
          {/* Search SVG */}
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </form>
      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <>
            <span style={{ marginLeft: 10, fontWeight: 500, fontSize: 16 }}>Hi, {user.name}</span>
            <Link to="/orders" className="header-btn secondary">My Orders</Link>
            <Link to="/profile" className="header-icon-btn header-profile" title="Profile" style={{ margin: '0 8px', background: '#f5f5f5', borderRadius: '50%', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>
            </Link>
            <button onClick={logout} className="header-btn primary">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="header-btn primary">Login</Link>
            <Link to="/profile" className="header-icon-btn header-profile" title="Profile" style={{ margin: '0 8px', background: '#f5f5f5', borderRadius: '50%', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>
            </Link>
          </>
        )}
        <Link to="/cart" className="header-icon-btn header-cart" title="Cart" style={{ margin: '0 8px', background: '#f5f5f5', borderRadius: '50%', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <svg width="24" height="24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          {cartCount > 0 && (
            <span className="header-badge">{cartCount}</span>
          )}
        </Link>
        {user && user.isAdmin && (
          <Link to="/admin" className="header-icon-btn header-admin" title="Admin Dashboard" style={{ margin: '0 8px', border: '1.5px solid #4f46e5', borderRadius: 8, padding: '6px 14px', color: '#4f46e5', background: '#fff', fontWeight: 600, fontSize: 15 }}>
            <svg width="22" height="22" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style={{ marginLeft: 6 }}>Admin</span>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header; 