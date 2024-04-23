// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


const Navbar = ({ categories }) => {
  
  const userId = localStorage.getItem('userId');

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        {categories.map(category => (
        <li key={category}>
          <Link to={`/${category.toLowerCase()}`} className="nav-link" >
            {category}
          </Link>
        </li>
      ))}
        <li>
          {userId && (
            <Link to="/cart" className="nav-link">Cart</Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
