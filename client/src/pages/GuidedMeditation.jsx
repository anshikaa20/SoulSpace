import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import meditationData from "../data/MeditationData";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

const GuidedMeditation = () => {
  const { emotion } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Get meditation content (fallback to neutral if emotion not found)
  const meditation = meditationData[emotion] || meditationData["neutral"];

  // Handle background music
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Pause on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-r ${meditation.bgColor} text-black relative overflow-hidden`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-lg p-10 bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/60"
      >
        {/* Title */}
        <h2 className="text-4xl font-bold mb-4 capitalize">{meditation.title}</h2>

        {/* Message */}
        <p className="text-lg mb-6 leading-relaxed">{meditation.message}</p>

        {/* Exercise */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="bg-white/50 rounded-2xl p-4 border border-gray-200 text-gray-800 shadow-inner mb-6"
        >
          <h3 className="text-xl font-semibold mb-2">Guided Exercise 🧘‍♀️</h3>
          <p className="text-base leading-relaxed">{meditation.exercise}</p>
        </motion.div>

        {/* Music Controls */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={toggleMusic}
            className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? "Pause Music" : "Play Music"}
          </button>

          <audio ref={audioRef} src={meditation.music} loop />
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/mood")}
            className="bg-gradient-to-r from-[#9CB5F8] via-[#FFFFFF] to-[#9DB5FB] text-black px-6 py-2 rounded-full hover:scale-105 transition"
          >
            Back to Mood Detection
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default GuidedMeditation;


