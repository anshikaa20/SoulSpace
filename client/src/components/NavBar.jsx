import React from 'react'
import { assets } from '../assets/assets'

const NavBar = () => {
  return (
    <div className="w-full flex justify-between items-center px-6 sm:px-12 py-3 fixed top-0 left-0 right-0 bg-black z-50">
      {/* Logo */}
      <img 
        src={assets.SoulSpace} 
        alt="SoulSpace Logo" 
        className="w-20 sm:w-24 cursor-pointer"
      />

      {/* Right side buttons */}
      <div className="flex gap-4">
        <button 
          className="px-6 py-2 border border-white text-white bg-transparent rounded transition-all
          hover:bg-white hover:text-black"
        >
          Log in
        </button>
        <button 
          className="px-6 py-2 border border-white text-white bg-transparent rounded transition-all
          hover:bg-white hover:text-black"
        >
          Sign up
        </button>
      </div>
    </div>
  )
}

export default NavBar
