// src/component/Register.js
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import  axios from 'axios';


const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/register", formData);
      console.log(response.data);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("_id", response.data._id);
      setFormData({ name: "", email: "", password: "" });
      navigate("/login");
    } catch (error) {
      // Update error state to display the message
      setError(error.response?.data?.message || "Registration failed. Please try again.");
      console.error(error);
    }
  };


  const r1 = useNavigate();
  const singup = () => {
    r1("/login");
  };


  return (
    <div className='register-container'>
      <h2>Register</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
      <label>Username:</label>
        <input
        type='text'
        name='username'
        placeholder='Username'
        value={formData.username}
        onChange={handleChange}
        />
        <label>Email:</label>
        <input
          type="email"
          name='email'
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <label>Password:</label>
        <input
          type="password"
          name='password'
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit" className='submit'>Register</button>
      </form>
      <button className='b1' onClick={singup}>
          Already have a account? Sign-in!
        </button>
    </div>
  );
};

export default Register;
