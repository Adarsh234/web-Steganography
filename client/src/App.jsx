import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Encode from './components/Encode';
import Decode from './components/Decode';
import Navbar from './components/Navbar'; 
import UploadImage from './components/ImageUpload'
import './App.css'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/upload-image' element={<UploadImage/>}/>
        <Route path="/encode" element={<Encode />} />
        <Route path="/decode" element={<Decode />} />
      </Routes>
    </Router>
  );
};

export default App;
