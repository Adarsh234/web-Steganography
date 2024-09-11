import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>Steganography App</h1>
      <nav>
        <ul>
        <li className='li'><Link to="/">Home</Link></li>
          <li className='li'><Link to="/login">Login</Link></li>
          <li className='li'><Link to="/register">Register</Link></li>
          <li className='li'><Link to="/upload-image">Upload Images</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
