// src/utils/api.js
const API_URL = 'http://localhost:5000'; // Replace with your backend URL

export const registerUser = (userData) => {
  return fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  }).then(response => response.json());
};

export const loginUser = (userData) => {
  return fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  }).then(response => response.json());
};

export const uploadImage = (imageData, token) => {
  return fetch(`${API_URL}/images/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: imageData, // FormData for image file
  }).then(response => response.json());
};
