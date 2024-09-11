import React, { useState } from 'react';
import { uploadImage } from '../utils/api';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      if (!token) {
        setError('You must be logged in to upload images');
        return;
      }

      const data = await uploadImage(formData, token);
      if (data.msg) {
        alert('Image uploaded successfully');
        setError(null);
      } else {
        setError(data.msg);
      }
    } catch (err) {
      console.error(err);
      setError('Image upload failed');
    }
  };

  return (
    <div className='upload-container'>
      <h2>Upload Image</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleImageUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default ImageUpload;
