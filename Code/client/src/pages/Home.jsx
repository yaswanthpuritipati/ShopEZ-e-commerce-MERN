import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../styles/Home.css';
import { Link, useSearchParams } from 'react-router-dom';
import SearchAndFilters from '../components/SearchAndFilters';


const categories = [
  { name: 'Fashion', img: '/images/fashion.jpg' },
  { name: 'Electronics', img: '/images/electronics.jpg' },
  { name: 'Mobiles', img: '/images/mobiles.jpg' },
  { name: 'Groceries', img: '/images/groceries.jpg' },
  { name: 'Sports Equipments', img: '/images/sports.jpg' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState('');
  const [filters, setFilters] = useState({});
  const [searchParams] = useSearchParams();

  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchProducts = useCallback(async (currentFilters = {}, isSearch = false) => {
    if (isSearch) {
      setSearchLoading(true);
    } else {
      setLoading(true);
    }
    try {
      const params = new URLSearchParams();
      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.category) params.append('category', currentFilters.category);
      if (currentFilters.minPrice) params.append('minPrice', currentFilters.minPrice);
      if (currentFilters.maxPrice) params.append('maxPrice', currentFilters.maxPrice);
      if (currentFilters.sortBy) params.append('sortBy', currentFilters.sortBy);
      const url = `http://localhost:5000/api/products${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      if (isSearch) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // Check for search parameter in URL
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      const initialFilters = { search: urlSearch };
      setFilters(initialFilters);
      fetchProducts(initialFilters, true);
    } else {
      fetchProducts();
    }
    // Fetch banner
    axios.get('http://localhost:5000/api/banner')
      .then(res => setBannerUrl(res.data?.url || ''));
  }, [searchParams, fetchProducts]);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    fetchProducts(newFilters, true);
  }, [fetchProducts]);

  return (
    <div className="main-container">
      <div style={{ width: '100%' }}>
        {/* Banner */}
        <div className="banner">
          <img
            src={bannerUrl ? `${apiBase}${bannerUrl}?t=${Date.now()}` : '/images/banner.jpg'}
            alt="Super Sale Banner"
            className="banner-img"
          />
        </div>

        {/* Divider */}
        <hr className="section-divider" />

        {/* Categories */}
        <div className="categories-row">
          {categories.map((cat, idx) => (
            <Link to={`/category/${encodeURIComponent(cat.name)}`} key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="category-card">
                <img src={cat.img} alt={cat.name} className="category-img" />
                <div className="category-label">{cat.name}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <hr className="section-divider" />

        {/* Search and Filters */}
        <div style={{ padding: '0 2rem' }}>
          <SearchAndFilters 
            onFiltersChange={handleFiltersChange} 
            initialFilters={filters}
          />
        </div>

        {/* Products */}
        <section className="products-section">
          <h2 style={{ marginBottom: '1.5rem' }}>
            {filters.search ? `Search Results for "${filters.search}"` : 'All Products'}
          </h2>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="products-grid">
              {searchLoading && (
                <div style={{ width: '100%', textAlign: 'center', color: '#888', padding: '2rem 0' }}>
                {filters.search ? `No products found matching "${filters.search}"` : 'No products found matching your criteria.'}
              </div>              )}
              {!searchLoading && products.length > 0 ? (
                products.map((p) => (
                  <Link key={p._id} to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                       <div className="product-card">
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }} />
                      <div style={{ padding: '1rem 0' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>{p.name}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="price">₹ {p.price}</span>
                          <span className="category">{p.category}</span>
                        </div>
                      </div>
                    </div>

                  </Link>
                ))
              ) : !searchLoading && (
                <div style={{ width: '100%', textAlign: 'center', color: '#888', padding: '2rem 0' }}>
                  {filters.search ? `No products found matching "${filters.search}"` : 'No products found matching your criteria.'}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home; 