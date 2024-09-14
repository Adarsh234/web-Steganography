import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const redirect = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/login", formData);
      console.log(response.data);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("_id", response.data._id);
      setFormData({ username: "", password: "" });
      navigate("/");
    } catch (error) {
      // Update error state to display the message
      setError(error.response?.data?.message || "Registration failed. Please try again.");
      console.error(error);
    }
  };

  const l1 = useNavigate();
  const singup = () => {
    l1("/");
  }


  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name='username'
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className='login'>Login</button>
      </form>
      <button className='b1 log' onClick={singup}>
          Don't have an account? Register!
        </button>
    </div>
  );
};

export default Login;
