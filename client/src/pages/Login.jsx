import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import {useNavigate} from 'react-router-dom'
import { AppContent } from "../context/AppContext";
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify";

const Login = () => {

  const navigate=useNavigate()

  const {backendUrl,setIsLoggedin,getUserData}=useContext(AppContent)

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler =async(e)=>{
    try{
      e.preventDefault();
      axios.defaults.withCredentials=true
      if(state==='Sign Up'){
        const {data} = await axios.post(backendUrl+ '/api/auth/register',{name,email,password})
        if(data.success){
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        }else{
          toast.error(data.message)
        }
      } else{
        const {data} = await axios.post(backendUrl+ '/api/auth/login',{email,password})
        if(data.success){
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        }else{
          toast.error(data.message)
        }
      }
    } catch (error) {
        toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4e72a4] via-[#9f82bd] to-[#5274b4] px-4">
      <div className="relative w-full max-w-sm bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-8 sm:p-10">
        
        {/* Logo + Heading */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={assets.YourSoul}
            alt="Your Soul Logo"
            className="w-16 h-16 mb-3 rounded-2xl object-cover shadow-md opacity-95"
          />
          <h2 className="text-2xl font-semibold text-slate-800 mb-1 tracking-tight">
            {state === "Sign Up" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-slate-500 text-sm text-center leading-relaxed max-w-[220px]">
            {state === "Sign Up"
              ? "Give yourself another chance — we’re here for you."
              : "It’s okay not to be okay. You’re safe here."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler}className="space-y-4">
          {state === "Sign Up" && (
            <div className="px-4 py-3 rounded-xl border border-slate-200 bg-white/70 hover:border-pink-200 transition-all">
              <input 
              onChange={e=> setName(e.target.value)}
               value={name}
                type="text"
                placeholder="Full Name"
                className="bg-transparent outline-none text-slate-700 placeholder-slate-400 w-full"
                required
              />
            </div>
          )}

          <div className="px-4 py-3 rounded-xl border border-slate-200 bg-white/70 hover:border-pink-200 transition-all">
            <input
             onChange={e=> setEmail(e.target.value)}
               value={email}
              type="email"
              placeholder="Email Address"
              className="bg-transparent outline-none text-slate-700 placeholder-slate-400 w-full"
              required
            />
          </div>

          <div className="px-4 py-3 rounded-xl border border-slate-200 bg-white/70 hover:border-pink-200 transition-all">
            <input
             onChange={e=> setPassword(e.target.value)}
               value={password}
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-slate-700 placeholder-slate-400 w-full"
              required
            />
          </div>

          <div className="flex justify-end">
            <p onClick={()=>navigate('/reset-password')} className="text-right text-sm text-blue-500 cursor-pointer hover:text-blue-600 transition mt-[-4px]">
              Forgot password?
            </p>
          </div>

          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300">
            {state}
          </button>
        </form>

        {/* Switch between Login & Signup */}
        <div className="text-center mt-6">
          {state === "Sign Up" ? (
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-blue-600 cursor-pointer hover:underline transition"
              >
                Log in
              </span>
            </p>
          ) : (
            <p className="text-slate-500 text-sm">
              Don’t have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-blue-600 cursor-pointer hover:underline transition"
              >
                Sign up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
