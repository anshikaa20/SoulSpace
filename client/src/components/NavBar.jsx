import React, { useContext, useState } from "react";
import { Menu, X } from "lucide-react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContent);

  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopUserMenuOpen, setDesktopUserMenuOpen] = useState(false);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    setUserData(null);
    setIsLoggedin(false);
    navigate("/Login");
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="w-full flex flex-col items-center sticky top-0 z-50 pb-2 bg-transparent">
      <div className="w-[95%] flex items-center justify-between mt-3">
        {/* Logo */}
        <img
          src={assets.YourSoul}
          alt="Logo"
          className="h-14 object-contain cursor-pointer"
          onClick={() => scrollToSection("home")}
        />

        {/* Hamburger Icon (Mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-black"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* 🌈 Desktop Menu - Transparent Glassy */}
        <div className="hidden sm:flex items-center gap-6 py-2 px-8 rounded-2xl justify-center flex-1 max-w-[650px] mx-8 border border-white/70 
                        bg-gradient-to-r from-[#FBD3E9]/40 via-white/20 to-[#BBE1FA]/40 
                        backdrop-blur-lg shadow-lg text-black font-medium transition-all duration-300">
          

          <button onClick={() => scrollToSection("")} className="hover:underline">
            Home
          </button>

          <button onClick={() => scrollToSection("about")} className="hover:underline">
            About
          </button>

          <button onClick={() => navigate("/mood")} className="hover:underline">
            Let's Meditate
          </button>

          <button onClick={() => navigate("/journal")} className="hover:underline">
            Journal
          </button>
        </div>

        {/* ✨ Desktop Auth Buttons - Transparent Style */}
        <div className="hidden sm:flex gap-3 items-center relative bg-white/20 backdrop-blur-md border border-white/40 rounded-full px-3 py-1">
          {userData ? (
            <div
              className="w-8 h-8 flex justify-center items-center rounded-full bg-white text-black cursor-pointer"
              onClick={() => setDesktopUserMenuOpen(!desktopUserMenuOpen)}
            >
              {userData.name[0].toUpperCase()}
              {desktopUserMenuOpen && (
                <ul className="absolute top-10 right-0 z-10 bg-white/90 text-black rounded shadow-lg w-36 backdrop-blur-md">
                  {!userData.isAccountVerified && (
                    <li
                      onClick={sendVerificationOtp}
                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    >
                      Verify email
                    </li>
                  )}
                  <li
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/Login")}
              className="hidden sm:flex gap-3 items-center relative hover:underline text-neutral-950"
            >
              Log in
            </button>
          )}
        </div>
      </div>

      {/* 📱 Transparent Mobile Dropdown */}
      {menuOpen && (
        <div className="sm:hidden w-[90%] mt-3 rounded-2xl border border-white/40 
                        bg-gradient-to-r from-[#FBD3E9]/40 via-white/20 to-[#BBE1FA]/40 
                        backdrop-blur-lg shadow-lg transition-all duration-300">
          <div className="flex flex-col items-center gap-4 py-5 text-black font-medium">
            <button
              onClick={() => scrollToSection("home")}
              className="px-4 py-1 rounded-full border border-black bg-white/70 hover:bg-white transition-all"
            >
              Home
            </button>

            <button onClick={() => scrollToSection("about")} className="hover:underline">
              About
            </button>

            <button
              onClick={() => {
                navigate("/mood");
                setMenuOpen(false);
              }}
              className="hover:underline"
            >
              Let's Meditate
            </button>

            <button
              onClick={() => {
                navigate("/journal");
                setMenuOpen(false);
              }}
              className="hover:underline"
            >
              Journal
            </button>

            {/* Login / Logout */}
            {userData ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="px-4 py-1 border border-black rounded-md hover:bg-white/50 transition-all text-sm"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/Login");
                  setMenuOpen(false);
                }}
                className="px-4 py-1 border border-black rounded-md hover:bg-white/50 transition-all text-sm"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
