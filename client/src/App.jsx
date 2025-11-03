import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import MoodDetection from "./pages/MoodDetection";
import GuidedMeditation from "./pages/GuidedMeditation";
import Journal from "./pages/Journal";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #FBD3E9 30%, #BBDEFB 100%)",
        backgroundAttachment: "fixed", // keeps gradient steady while scrolling
      }}
    >
      <ToastContainer />
      <Routes>
      < Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/mood' element={<MoodDetection />} />
        <Route path='/guide/:emotion' element={<GuidedMeditation />} /> {/* new route added */}
        <Route path="/journal" element={<Journal />} />
      </Routes>
    </div>
  );
};

export default App;
