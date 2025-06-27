import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/AdminDashboard.css';
import BackButton from '../components/BackButton';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [bannerUrl, setBannerUrl] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [bannerMsg, setBannerMsg] = useState('');
  const [bannerMsgType, setBannerMsgType] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/count').then(res => setUserCount(res.data.count));
    axios.get('http://localhost:5000/api/products/count').then(res => setProductCount(res.data.count));
    axios.get('http://localhost:5000/api/orders/count').then(res => setOrderCount(res.data.count));
    axios.get('http://localhost:5000/api/banner').then(res => setBannerUrl(res.data?.url || ''));
  }, []);

  if (!user || !user.isAdmin) return <div className="admindash-unauth">Unauthorized</div>;

  const handleBannerFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBannerFile(e.target.files[0]);
    }
  };

  const handleBannerUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      if (bannerFile) {
        data.append('image', bannerFile);
      } else if (bannerUrl) {
        data.append('url', bannerUrl);
      }
      await axios.put('http://localhost:5000/api/banner', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setBannerMsg('Banner updated!');
      setBannerMsgType('success');
      setSnackbarOpen(true);
      axios.get('http://localhost:5000/api/banner').then(res => setBannerUrl(res.data?.url || ''));
      setBannerFile(null);
    } catch {
      setBannerMsg('Failed to update banner');
      setBannerMsgType('error');
      setSnackbarOpen(true);
    }
  };

  // Banner preview logic
  const bannerPreview = bannerFile
    ? URL.createObjectURL(bannerFile)
    : bannerUrl
      ? bannerUrl.startsWith('/uploads/')
        ? `http://localhost:5000${bannerUrl}`
        : bannerUrl
      : null;

  return (
    <div className="admindash-container">
      <BackButton />
      <h2 className="admindash-title">ShopEZ (admin)</h2>
      <div className="admindash-cards-row">
        <div className="admindash-card">
          <div className="admindash-card-icon" role="img" aria-label="users">👥</div>
          <div className="admindash-card-label">Total users</div>
          <div className="admindash-card-count">{userCount}</div>
          <Link to="/admin/users" className="admindash-card-btn">View all</Link>
        </div>
        <div className="admindash-card">
          <div className="admindash-card-icon" role="img" aria-label="products">📦</div>
          <div className="admindash-card-label">All Products</div>
          <div className="admindash-card-count">{productCount}</div>
          <Link to="/admin/products" className="admindash-card-btn">View all</Link>
        </div>
        <div className="admindash-card">
          <div className="admindash-card-icon" role="img" aria-label="orders">🛒</div>
          <div className="admindash-card-label">All Orders</div>
          <div className="admindash-card-count">{orderCount}</div>
          <Link to="/admin/orders" className="admindash-card-btn">View all</Link>
        </div>
        <div className="admindash-card">
          <div className="admindash-card-icon" role="img" aria-label="add">➕</div>
          <div className="admindash-card-label">Add Product</div>
          <div className="admindash-card-count">(new)</div>
          <Link to="/admin/products/new" className="admindash-card-btn">Add now</Link>
        </div>
      </div>
      <div className="admindash-banner-form-wrap">
        <div className="admindash-banner-card">
          <div className="admindash-banner-title">Update banner</div>
          <hr className="admindash-banner-divider" />
          <form className="admindash-banner-form" onSubmit={handleBannerUpdate} encType="multipart/form-data">
            <input
              className="admindash-banner-input"
              type="text"
              placeholder="Banner url"
              value={bannerUrl}
              onChange={e => setBannerUrl(e.target.value)}
            />
            <div className="admindash-banner-upload">
              <label>Or Upload Image:</label><br />
              <input type="file" accept="image/*" onChange={handleBannerFileChange} />
            </div>
            {bannerPreview && (
              <div className="admindash-banner-preview">
                <label>Preview:</label><br />
                <img src={bannerPreview} alt="Banner Preview" className="admindash-banner-img" />
              </div>
            )}
            <button className="admindash-banner-btn" type="submit">Update</button>
          </form>
          {snackbarOpen && (
            <div className={`admindash-banner-msg ${bannerMsgType}`}>{bannerMsg}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 