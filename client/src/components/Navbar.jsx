import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header>
      <h1>Steganography Website</h1>
      <nav>
        <ul>
        {/* <li className='li'><Link to="/home">Home</Link></li> */}
          <li className='li'><Link to="/encode">Encode</Link></li>
          <li className='li'><Link to="/decode">Decode</Link></li>
          <li className='li'><Link to="/upload-image">Upload Images</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
