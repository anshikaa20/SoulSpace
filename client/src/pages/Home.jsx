import React from "react";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import About from "../components/About";

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden scroll-smooth">
      {/* FIXED NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar />
      </div>

      {/* HEADER / HERO SECTION */}
      <section id="header" className="relative h-screen w-full flex items-center justify-center pt-20">
        <Header />
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="relative w-full pt-24"> 
        {/* 👆 Add top padding here (adjust depending on NavBar height) */}
        <About />
      </section>
    </div>
  );
};

export default Home;
