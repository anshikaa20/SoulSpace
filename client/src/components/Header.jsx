import React from "react";

const HeroShape = ({ children }) => {
  return (
    <div
      className="
        fixed inset-x-0 top-[96px] bottom-[32px]
        flex items-center justify-center z-0
      "
    >
      {/* Outer gradient box */}
      <div
        className="
          relative
          w-[92%] h-[72vh]
          max-w-[1000px]
          mx-auto
          rounded-[36px]
          overflow-hidden
          shadow-lg
          flex items-center justify-center
          bg-gradient-to-r from-[#9CB5F8] via-white to-[#9DB5FB]
          md:w-[88%] md:max-w-[1400px]
          md:rounded-[60px] md:h-full
        "
      >

       {/* Text overlay for mobile – inside the blue box */}
<div className="absolute top-14 w-full flex justify-center md:hidden">
  <h2 className="text-3xl text-black text-center font-serif">
    ARE YOU OKAY?
  </h2>
</div>


        {/* Two-image wrapper */}
        <div
          className="
            flex
            w-[95%] h-auto
            gap-3 px-3 py-3
            items-center justify-center
            md:w-[96%] md:h-[94%] md:px-2 md:py-2 md:gap-3
          "
        >
          {/* LEFT image (60%) */}
          <div
            className="
              flex-[1.5]
            h-full
              overflow-hidden
              rounded-[28px]
              md:h-full md:aspect-auto md:rounded-[40px]
              flex
            "
          >
            <img
              src="/Right_bg.png"
              alt="Left Illustration"
              className="w-full h-full object-cover"
              draggable="false"
            />
          </div>
          
{/* Text overlay – only on desktop */}
<div className="hidden md:block absolute inset-0 flex-col justify-start items-start px-16 pt-20">
  <div className="text-left text-black font-serif">
    <h2 className="text-[4.5rem] leading-[4.8rem] font-light tracking-tight">
      ARE<br />YOU<br />OKAY?
    </h2>
    <p className="mt-6 text-lg font-light tracking-wide max-w-sm">
      Give yourself another chance,<br />
      it’s okay not to be okay.
    </p>
  </div>
</div>

          {/* RIGHT image (40%) */}
          <div
            className="
              flex-[1]
             h-full
              overflow-hidden
              rounded-[28px]
              md:h-full md:aspect-auto md:rounded-[40px]
              flex
            "
          >
            <img
              src="/Left_bg.png"
              alt="Right Illustration"
              className="w-full h-full object-cover"
              draggable="false"
            />
          </div>
        </div>

    {/* Mobile subtext below images – inside the blue box */}
<div className="absolute bottom-10 w-full flex justify-center md:hidden">
  <p className="text-center text-base font-light text-black leading-snug font-serif">
    Give yourself another chance,<br />it’s okay not to be okay.
  </p>
</div>

        {/* Center overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {children}
        </div>

    {/* “One Day at a Time” overlay – bridging left and right halves */}
<div className="absolute z-10 flex justify-center items-center w-full h-full">
  <img
    src="/OneDay.png" // update path if needed
    alt="One Day at a Time"
    className="
      absolute z-10 object-contain 
      draggable=false

      /* Default (Mobile) */
      left-[60%] -translate-x-1/2 
      top-[38%] w-[60px]
      rounded-[20px] 
      /* Tablet & Desktop overrides */
      md:left-[60%] md:top-[10%] md:w-[180px]
    "
    draggable="false"
  />
</div>
      </div>
    </div>
  );
};

export default HeroShape;
