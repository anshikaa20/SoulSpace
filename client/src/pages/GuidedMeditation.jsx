import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import meditationData from "../data/MeditationData";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";

const GuidedMeditation = () => {
  const { emotion } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const audioRef = useRef(null);

  const meditation = meditationData[emotion] || meditationData["neutral"];
  const lines = meditation.exercise
    ? meditation.exercise.split(".").filter((line) => line.trim() !== "")
    : [];

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let timer;
    if (lines.length > 0 && lineIndex < lines.length - 1) {
      timer = setTimeout(() => {
        setLineIndex((prev) => prev + 1);
      }, 12000); // each line shows for 5 seconds
    }
    return () => clearTimeout(timer);
  }, [lineIndex, lines.length]);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-r ${meditation.bgColor} text-black relative overflow-hidden transition-all duration-1000`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-lg p-10 bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/70 relative"
      >
        {/* 🌙 Title */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-4 capitalize drop-shadow-sm"
        >
          {meditation.title}
        </motion.h2>

        {/* 💬 Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg mb-6 leading-relaxed text-gray-800"
        >
          {meditation.message}
        </motion.p>

        {/* 🧘 Guided Flow */}
        {lines.length > 0 && (
          <div className="min-h-[100px] flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={lineIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
                className="text-xl font-medium text-gray-900 italic"
              >
                {lines[lineIndex].trim()}.
              </motion.p>
            </AnimatePresence>
          </div>
        )}

        {/* End Message */}
        {lineIndex === lines.length - 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-gray-700 text-base italic"
          >
            You’re done. Take a deep breath. 🌸
          </motion.p>
        )}

        {/* 🎵 Music Controls */}
        <div className="flex flex-col items-center gap-4 mt-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleMusic}
            className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? "Pause Music" : "Play Music"}
          </motion.button>

          <audio ref={audioRef} src={meditation.music} loop />
        </div>

        {/* 🔙 Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <button
            onClick={() => navigate("/mood")}
            className="bg-gradient-to-r from-[#9CB5F8] via-[#FFFFFF] to-[#9DB5FB] text-black px-6 py-2 rounded-full hover:scale-105 transition"
          >
            Back to My Space
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GuidedMeditation;
