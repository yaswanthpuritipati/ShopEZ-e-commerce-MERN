import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminUsers.css';
import BackButton from '../components/BackButton';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState('');
  const [actionMsgType, setActionMsgType] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Error fetching users');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!user || !user.isAdmin) return;
    fetchUsers();
  }, [user]);

  const handlePromoteDemote = (u) => {
    if (!window.confirm(`Are you sure you want to ${u.isAdmin ? 'demote' : 'promote'} this user?`)) return;
    axios.patch(`http://localhost:5000/api/users/${u._id}/role`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => {
        setActionMsg(res.data.message);
        setActionMsgType('success');
        setSnackbarOpen(true);
        fetchUsers();
      })
      .catch(err => {
        setActionMsg(err.response?.data?.error || 'Action failed');
        setActionMsgType('error');
        setSnackbarOpen(true);
      });
  };

  const handleDelete = (u) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    axios.delete(`http://localhost:5000/api/users/${u._id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => {
        setActionMsg(res.data.message);
        setActionMsgType('success');
        setSnackbarOpen(true);
        fetchUsers();
      })
      .catch(err => {
        setActionMsg(err.response?.data?.error || 'Delete failed');
        setActionMsgType('error');
        setSnackbarOpen(true);
      });
  };

  if (!user || !user.isAdmin) return <div className="adminusers-unauth">Unauthorized</div>;

  return (
    <div className="adminusers-container">
      <BackButton />
      <h2 className="adminusers-title">All Users</h2>
      <hr className="adminusers-divider" />
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="adminusers-error">{error}</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="adminusers-table-wrapper">
          <table className="adminusers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.isAdmin ? 'Yes' : 'No'}</td>
                  <td>{new Date(u.createdAt).toLocaleString()}</td>
                  <td>
                    {u._id !== user._id && (
                      <>
                        <button
                          className={`adminusers-action-btn ${u.isAdmin ? 'demote' : 'promote'}`}
                          onClick={() => handlePromoteDemote(u)}
                          title={u.isAdmin ? 'Demote' : 'Promote'}
                        >
                          {u.isAdmin ? '⬇️ Demote' : '⬆️ Promote'}
                        </button>
                        <button
                          className="adminusers-action-btn delete"
                          onClick={() => handleDelete(u)}
                          title="Delete"
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {snackbarOpen && (
        <div className={`adminusers-msg ${actionMsgType}`}>{actionMsg}</div>
      )}
    </div>
  );
};

export default AdminUsers; 