import React, { useRef, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { assets } from "../assets/assets";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState("email"); // "email" → "otp" → "password"
  const inputRefs = useRef([]);

  // ✅ Handle OTP Input
  const handleInput = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1].focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtp(pasted.split(""));
    } else {
      toast.error("Please paste a valid 6-digit OTP");
    }
  };

  // ✅ Step 1: Send Reset OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      if (data.success) {
        toast.success("OTP sent to your email");
        setStep("otp");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // ✅ Step 2: Verify OTP (Client Side)
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return toast.error("Please enter all 6 digits");
    setStep("password");
  };

  // ✅ Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (!email || otpCode.length !== 6 || !newPassword)
      return toast.error("Email, OTP, and new password are required");

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp: otpCode,
        newPassword, // ✅ correct key
      });

      if (data.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#4e72a4] via-[#9f82bd] to-[#5274b4] px-4">
      <img
        src={assets.YourSoul}
        alt="Your Soul Logo"
        className="w-16 h-16 mb-3 rounded-2xl object-cover shadow-md opacity-95 cursor-pointer"
        onClick={() => navigate("/")}
      />

      <form
        onSubmit={
          step === "email"
            ? handleSendOtp
            : step === "otp"
            ? handleVerifyOtp
            : handleResetPassword
        }
        className="bg-slate-900 p-8 rounded-xl shadow-2xl w-96 text-center"
      >
        <h1 className="text-white text-2xl font-semibold mb-4">
          {step === "email"
            ? "Reset Password"
            : step === "otp"
            ? "Verify OTP"
            : "Set New Password"}
        </h1>

        <p className="text-indigo-300 mb-6 text-sm">
          {step === "email"
            ? "Enter your registered email to receive OTP."
            : step === "otp"
            ? "Enter the 6-digit OTP sent to your email."
            : "Enter your new password below."}
        </p>

        {/* ✅ Email Field */}
        {step === "email" && (
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-6 px-4 py-3 rounded-md bg-[#333A5C] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        )}

        {/* ✅ OTP Inputs */}
        {step === "otp" && (
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
                  onPaste={handlePaste}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-12 text-white text-center text-xl rounded-md bg-[#333A5C] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ))}
          </div>
        )}

        {/* ✅ New Password Field */}
        {step === "password" && (
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            required
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-6 px-4 py-3 rounded-md bg-[#333A5C] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        )}

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full hover:opacity-90 transition"
        >
          {step === "email"
            ? "Send OTP"
            : step === "otp"
            ? "Verify OTP"
            : "Reset Password"}
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-indigo-300 mt-4 text-sm cursor-pointer hover:text-white transition"
        >
          Back to Login
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
