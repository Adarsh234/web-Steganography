import React from 'react';
import { Link } from 'react-router-dom';


export default function Home() {
  return (
    <div className="text">
      <h2>Welcome to Your Steganography Website</h2>
      <p>Choose the option you want to perform:</p>
      <nav>
        <ul>
          <li><Link className='nav-button' to="/encode">Encode</Link></li>
          <li><Link className='nav-button' to="/decode">Decode</Link></li>
        </ul>
      </nav>
    </div>
  );
}
