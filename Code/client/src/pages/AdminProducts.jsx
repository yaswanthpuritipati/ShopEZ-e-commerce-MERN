import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminProducts.css';
import BackButton from '../components/BackButton';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
    // eslint-disable-next-line
  }, [user]);

  const fetchProducts = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching products.');
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    axios.delete(`http://localhost:5000/api/products/${id}`)
      .then(() => {
        fetchProducts();
      })
      .catch(() => alert('Error deleting product.'));
  };

  if (!user || !user.isAdmin) {
    return null; // Or show a message if you prefer
  }

  return (
    <div className="adminproducts-container">
      <BackButton />
      <div className="adminproducts-header-row">
        <h2 className="adminproducts-title">Admin: All Products</h2>
        <button
          className="adminproducts-add-btn"
          onClick={() => navigate('/admin/products/new')}
        >
          ➕ Add Product
        </button>
      </div>
      <hr className="adminproducts-divider" />
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="adminproducts-error">{error}</p>
      ) : (
        <div className="adminproducts-table-wrapper">
          <table className="adminproducts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹ {p.price}</td>
                  <td><img src={p.image} alt={p.name} className="adminproducts-img" /></td>
                  <td>
                    <button
                      className="adminproducts-action-btn edit"
                      onClick={() => navigate(`/admin/products/${p._id}/edit`)}
                      title="Edit"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="adminproducts-action-btn delete"
                      onClick={() => handleDelete(p._id)}
                      title="Delete"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts; 