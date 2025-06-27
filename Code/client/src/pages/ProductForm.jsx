import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProductForm.css';
import BackButton from '../components/BackButton';

const initialState = {
  name: '',
  price: '',
  image: '',
  description: '',
  category: '',
};

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/products/${id}`)
        .then(res => {
          setForm({
            name: res.data.name,
            price: res.data.price,
            image: res.data.image,
            description: res.data.description,
            category: res.data.category,
          });
          setLoading(false);
        })
        .catch(() => {
          setError('Error loading product');
          setLoading(false);
        });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data = new FormData();
    data.append('name', form.name);
    data.append('price', form.price);
    data.append('description', form.description);
    data.append('category', form.category);
    if (imageFile) {
      data.append('image', imageFile);
    } else if (form.image) {
      data.append('image', form.image);
    }
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const req = isEdit
      ? axios.put(`http://localhost:5000/api/products/${id}`, data, config)
      : axios.post('http://localhost:5000/api/products', data, config);
    req.then(() => {
      setLoading(false);
      navigate('/admin/products');
    })
    .catch(() => {
      setError('Error saving product');
      setLoading(false);
    });
  };

  // Preview logic
  const imagePreview = imageFile
    ? URL.createObjectURL(imageFile)
    : form.image
      ? form.image.startsWith('/uploads/')
        ? `http://localhost:5000${form.image}`
        : form.image
      : null;

  return (
    <div className="productform-container">
      <BackButton />
      <div className="productform-card">
        <h2 className="productform-title">{isEdit ? 'Edit' : 'Add'} Product</h2>
        <hr className="productform-divider" />
        <form className="productform-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            className="productform-input"
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="productform-input"
            placeholder="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            className="productform-input"
            placeholder="Image URL"
            name="image"
            value={form.image}
            onChange={handleChange}
            type="text"
            autoComplete="off"
          />
          <div className="productform-upload">
            <label>Or Upload Image:</label><br />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          {imagePreview && (
            <div className="productform-preview">
              <img src={imagePreview} alt="Preview" className="productform-preview-img" />
            </div>
          )}
          <textarea
            className="productform-input"
            placeholder="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
          />
          <input
            className="productform-input"
            placeholder="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />
          {error && <p className="productform-error">{error}</p>}
          <button
            className="productform-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 