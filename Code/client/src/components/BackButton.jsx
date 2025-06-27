import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BackButton.css';

const BackButton = ({ style, className }) => {
  const navigate = useNavigate();
  return (
    <button
      className={`back-btn${className ? ' ' + className : ''}`}
      style={style}
      onClick={() => navigate(-1)}
      type="button"
    >
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ marginRight: 6 }}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Back
      </span>
    </button>
  );
};

export default BackButton; 