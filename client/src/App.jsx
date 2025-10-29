import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import MoodDetection from './pages/MoodDetection'; 
import GuidedMeditation from './pages/GuidedMeditation'; // added guided meditation page
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/mood' element={<MoodDetection />} />
        <Route path='/guide/:emotion' element={<GuidedMeditation />} /> {/* new route added */}
      </Routes>
    </div>
  );
};  

export default App;

