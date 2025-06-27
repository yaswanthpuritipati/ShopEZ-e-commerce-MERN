import React from 'react';
import '../styles/Filters.css';

const Filters = () => (
  <aside className="filters">
    <h3>Filters</h3>
    <div>
      <strong>Sort By</strong>
      <div><input type="radio" name="sort" defaultChecked /> Popular</div>
      <div><input type="radio" name="sort" /> Price (low to high)</div>
      <div><input type="radio" name="sort" /> Price (high to low)</div>
      <div><input type="radio" name="sort" /> Discount</div>
    </div>
    <div>
      <strong>Categories</strong>
      <div><input type="checkbox" /> mobiles</div>
      <div><input type="checkbox" /> Electronics</div>
      <div><input type="checkbox" /> Sports-Equipment</div>
      <div><input type="checkbox" /> Fashion</div>
      <div><input type="checkbox" /> Groceries</div>
    </div>
    <div>
      <strong>Gender</strong>
      <div><input type="checkbox" /> Men</div>
      <div><input type="checkbox" /> Women</div>
      <div><input type="checkbox" /> Unisex</div>
    </div>
  </aside>
);

export default Filters; 