// src/components/Decode.js
import React, { useState } from 'react';
import { decodeMessageFromImage } from '../utils/Steganography.jsx';

function Decode() {
  const [image, setImage] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState('');

  // Handle the image input change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle decoding process
  const handleDecode = () => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        decodeMessageFromImage(imageData).then(message => {
          setDecodedMessage(message);
        });
      };
      reader.readAsDataURL(image);
    }
  };

  return (
    <div className="decode-container">
      <h2>Decode Message from Image</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button  className='btn' onClick={handleDecode}>Decode</button>
      {decodedMessage && (
        <div>
          <h3 className='h3'>Decoded Message:</h3>
          <p>{decodedMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Decode;
