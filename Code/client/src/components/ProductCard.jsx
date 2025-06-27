import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product, showPrice, onAddToCart, onPlaceOrder }) => (
  <div className="product-card">
    <Link to={`/product/${product._id || product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <h4>{product.name}</h4>
        <div className="product-price-row">
          {product.discountedPrice ? (
            <>
              <span className="discounted-price">₹ {product.discountedPrice}</span>
              <span className="original-price" style={{ textDecoration: 'line-through', color: '#888', marginLeft: 8 }}>₹ {product.price}</span>
            </>
          ) : (
            <span className="price">₹ {product.price}</span>
          )}
          <span className="category">{product.category}</span>
        </div>
        <p>{product.description}</p>
      </div>
    </Link>
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <button onClick={() => onAddToCart(product)}>Add to Cart</button>
      <button onClick={() => onPlaceOrder(product)}>Place Order</button>
    </div>
  </div>
);

export default ProductCard; 

