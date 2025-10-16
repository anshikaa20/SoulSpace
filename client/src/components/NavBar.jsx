import React, { useContext, useState } from "react";
import { Menu, X } from "lucide-react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedin } = useContext(AppContent);

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);
  const [desktopUserMenuOpen, setDesktopUserMenuOpen] = useState(false);

  const handleLogout = () => {
    setUserData(null);
    setIsLoggedin(false);
    navigate("/Login");
  };



  return (
    <div className="bg-black w-full flex flex-col items-center sticky top-0 z-50 pb-2">
      {/* Main Navbar Row */}
      <div className="w-[95%] flex items-center justify-between mt-3">

        {/* Logo */}
        <img
          src={assets.YourSoul}
          alt="Logo"
          className="h-14 object-contain"
        />

        {/* Hamburger Menu for Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-white"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Center Gradient Nav (Desktop only) */}
        <div className="hidden sm:flex bg-gradient-to-r from-[#9CB5F8] via-[#FFFFFF] to-[#9DB5FB] rounded-2xl p-[6px] justify-center flex-1 max-w-[650px] mx-8">
          <div className="bg-white border border-black rounded-xl flex items-center justify-center gap-6 py-2 px-8 text-black font-medium">
            <button className="px-3 py-1 rounded-full border border-black bg-white hover:bg-gray-100">
              Home
            </button>
            <button className="hover:underline">About</button>
            <button className="hover:underline">Blogs</button>
            <button className="hover:underline">Let's Meditate</button>
            <button className="hover:underline">Journal</button>
          </div>
        </div>

        {/* Auth Buttons (Desktop only) */}
        <div className="hidden sm:flex gap-3 items-center relative">
          {userData ? (
            <div
              className="w-8 h-8 flex justify-center items-center rounded-full bg-white text-black cursor-pointer"
              onClick={() => setDesktopUserMenuOpen(!desktopUserMenuOpen)}
            >
              {userData.name[0].toUpperCase()}
              {desktopUserMenuOpen && (
                <ul className="absolute top-10 right-0 z-10 bg-gray-100 text-black rounded shadow-lg w-36">
                  {!userData.isAccountVerified && <li className="py-2 px-4 hover:bg-gray-200 cursor-pointer">
                    Verify email
                  </li> }
                  
                  <li
                    className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
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
              className="px-4 py-1.5 border border-white text-white rounded-md hover:bg-white hover:text-black transition-all text-sm"
            >
              Log in
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-gradient-to-r from-[#9CB5F8] via-[#FFFFFF] to-[#9DB5FB] rounded-2xl mt-3 w-[90%]">
          <div className="bg-white border border-black rounded-xl flex flex-col items-center gap-4 py-4 text-black font-medium">
            <button className="px-3 py-1 rounded-full border border-black bg-white hover:bg-gray-100">
              Home
            </button>
            <button className="hover:underline">About</button>
            <button className="hover:underline">Blogs</button>
            <button className="hover:underline">Let's Meditate</button>
            <button className="hover:underline">Journal</button>

            <div className="flex gap-3 mt-3 relative">
              {userData ? (
                <div>
                  <div
                    onClick={() => setMobileUserMenuOpen(!mobileUserMenuOpen)}
                    className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white cursor-pointer"
                  >
                    {userData.name[0].toUpperCase()}
                  </div>

                  {mobileUserMenuOpen && (
                    <ul className="absolute right-0 mt-2 w-32 bg-gray-100 text-black rounded shadow-lg z-10">
                      {!userData.isAccountVerified &&  <li className="py-2 px-4 hover:bg-gray-200 cursor-pointer">
                        Verify email
                      </li> }
                     
                      <li
                        className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
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
                  className="px-4 py-1.5 border border-black rounded hover:bg-gray-100 transition-all hover:underline text-sm"
                >
                  Log in
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
