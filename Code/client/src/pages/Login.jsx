import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';
import BackButton from '../components/BackButton';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    axios.post('http://localhost:5000/api/auth/login', form)
      .then(res => {
        login(res.data.user, res.data.token);
        setLoading(false);
        navigate('/'); // Redirect to home or dashboard
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Login failed');
        setLoading(false);
      });
  };

  return (
    <div className="login-container">
      <BackButton />
      <h2 className="login-title">Login</h2>
      <hr className="login-divider" />
      <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
        <input
          className="login-input"
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="login-input"
          placeholder="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <p className="login-error">{error}</p>}
        <button
          className="login-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <hr className="login-divider" />
      <p className="login-link-text">
        Don't have an account?{' '}
        <Link to="/register" className="login-link">Register</Link>
      </p>
    </div>
  );
};

export default Login; 