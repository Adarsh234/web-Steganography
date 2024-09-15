import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import { useEffect } from "react";
import Login from './components/Login';
import Register from './components/Register';
import Encode from './components/Encode';
import Decode from './components/Decode';
import Navbar from './components/Navbar'; 
import UploadImage from './components/ImageUpload'
import Logout from './components/Logout';
import Footer from './components/Footer';
import './App.css'
import { AuthProvider } from './context/AuthContext';


function App (){
  const redirect = useNavigate();
  const location = useLocation()

  useEffect(() => {
  if (localStorage.getItem("username")) {
    redirect("/home");
  } else {
    redirect("/");
  }
}, []);
useEffect(() => {
  console.log('App component rendered!');
}, []);

const hideNavbarOn = ['/login', '/'];
const hideFooterOn =  ['/login', '/', '/logout'];

return (
  <AuthProvider>
    {!hideNavbarOn.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route index element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
          <Route path="/home" element={<Home />} />
          <Route path="/upload-image" element={<UploadImage />} />
          <Route path="/encode" element={<Encode />} />
          <Route path="/decode" element={<Decode />} />
      </Routes>
      {!hideFooterOn.includes(location.pathname) && <Footer />}
  </AuthProvider>
);
};

export default App;
