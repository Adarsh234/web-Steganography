// src/components/Encode.js
import React, { useState } from 'react';
import { encodeMessageInImage } from '../utils/Steganography.jsx';

function Encode() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [encodedImage, setEncodedImage] = useState(null);

  // Handle the image input change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle the message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Handle encoding process
  const handleEncode = () => {
    if (image && message) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        encodeMessageInImage(message, imageData).then(encodedImage => {
          setEncodedImage(encodedImage);
        });
      };
      reader.readAsDataURL(image);
    }
  };

  return (
    <div className="encode-container">
      <h2>Encode Message in Image</h2>
      <div className="input-row">
        <div>
          <label>Choose Image: </label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div>
          <label>Enter Message: </label>
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter your message"
          />
        </div>
      </div>
      <button className='btn' onClick={handleEncode}>Encode</button>
      {encodedImage && (
        <div>
          <h3 className='h3'>Encoded Image:</h3>
          <img src={encodedImage} alt="Encoded" />
          <a href={encodedImage} download="encoded-image.png" className='encode-img'>
            Download Encoded Image
          </a>
        </div>
      )}
    </div>
  );
}

export default Encode;