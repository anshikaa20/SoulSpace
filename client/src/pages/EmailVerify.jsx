import React, { useContext, useEffect, useRef, useState } from "react"; 
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";


const EmailVerify = () => {

  axios.defaults.withCredentials=true;
  const {backendUrl,isLoggedin, userData,getUserData} = useContext(AppContent)
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // Handle typing
  const handleInput = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus(); // move to next
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

 
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pasted)) {
      toast.error("Please paste only numbers");
      return;
    }

    const digits = pasted.split("").slice(0, 6);
    const newOtp = [...otp];

    digits.forEach((digit, i) => {
      newOtp[i] = digit;
      if (inputRefs.current[i]) inputRefs.current[i].value = digit;
    });

    setOtp(newOtp);

    // auto-submit if all filled
    if (digits.length === 6) {
      setTimeout(() => handleSubmit(new Event("submit")), 100);
    }
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    try{
    e.preventDefault();
    const otpArray = inputRefs.current.map(e=>e.value)
    const otp= otpArray.join('')

    const {data}=await axios.post(backendUrl+ '/api/auth/verify-account',{otp})
    if(data.success){
      toast.success(data.message)
      getUserData()
      navigate('/')
    } else{
      toast.error(data.message)
    }
    } catch(error){
      toast.error(error.message)
    }
    
  }

  useEffect(()=>{
    isLoggedin&& userData && userData.isAccountVerified && navigate ('/')
  },[isLoggedin,userData])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#4e72a4] via-[#9f82bd] to-[#5274b4] px-4">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.YourSoul}
        alt="Your Soul Logo"
        className="w-16 h-16 mb-3 rounded-2xl object-cover shadow-md opacity-95 cursor-pointer"
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-xl shadow-2xl w-96 text-center"
      >
        <h1 className="text-white text-2xl font-semibold mb-4">
          Email Verify OTP
        </h1>
        <p className="text-indigo-300 mb-6 text-sm">
          Enter the 6-digit code sent to your email id.
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-between mb-8">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                required
                value={otp[index]}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : null} // only handle paste from first box
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full hover:opacity-90 transition"
        >
          Verify email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;