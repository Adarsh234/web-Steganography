import React, { useState } from 'react';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const username = localStorage.getItem("username"); // Retrieve username from localStorage
      if (!username) {
        setError('You must be logged in to upload images');
        return;
      }

      const response = await fetch('/steganography/encode', {
        method: 'POST',
        headers: {
          'username': username // Send the username in the headers
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert('Image uploaded successfully');
        setError(null);
      } else {
        setError(data.msg || 'Image upload failed');
      }
    } catch (err) {
      console.error(err);
      setError('Image upload failed');
    }
  };

  return (
    <div className='upload-container'>
      <h2>Upload Image</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleImageUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default ImageUpload;
