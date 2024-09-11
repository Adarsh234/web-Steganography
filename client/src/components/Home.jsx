import React from 'react';
import { Link } from 'react-router-dom';


export default function Home() {
  return (
    <div className="text">
      <h2>Welcome to Your Steganography Website</h2>
      <p>Choose the option you want to perform:</p>
      <nav>
        <ul>
          <li><button><Link to="/encode">Encode</Link></button></li>
          <li><button><Link to="/decode">Decode</Link></button></li>
        </ul>
      </nav>
    </div>
  );
}
