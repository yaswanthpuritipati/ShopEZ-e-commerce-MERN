import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Register.css';
import BackButton from '../components/BackButton';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    axios.post('http://localhost:5000/api/auth/register', form)
      .then(() => {
        setSuccess(true);
        setLoading(false);
        setForm({ name: '', email: '', password: '' });
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Registration failed');
        setLoading(false);
      });
  };

  return (
    <div className="register-container">
      <BackButton />
      <h2 className="register-title">Register</h2>
      <hr className="register-divider" />
      <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
        <input
          className="register-input"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          placeholder="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <p className="register-error">{error}</p>}
        {success && <p className="register-success">Registration successful! You can now log in.</p>}
        <button
          className="register-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <hr className="register-divider" />
      <p className="register-link-text">
        Already have an account?{' '}
        <Link to="/login" className="register-link">Login</Link>
      </p>
    </div>
  );
};

export default Register; 