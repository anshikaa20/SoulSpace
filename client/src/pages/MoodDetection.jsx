import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MoodDetection = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!text.trim()) return alert("Please enter your thoughts!");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      // Adjusted to match backend structure
      let emotion = data.emotion || data.label || data.final_label;

      if (!emotion) {
        alert("Couldn't detect emotion. Please try again.");
        return;
      }

      // Redirect to guided meditation page for detected emotion
      navigate(`/guide/${emotion.toLowerCase()}`);

    } catch (error) {
      console.error("Error analyzing mood:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#9CB5F8] via-[#FFFFFF] to-[#9DB5FB] text-black px-6">
    <div className="bg-white/70 backdrop-blur-lg shadow-lg rounded-3xl p-10 w-full max-w-xl text-center border border-white/60">
      <h1 className="text-3xl font-semibold mb-6">
        How are you feeling today? ☁️
      </h1>

      <textarea
        className="w-full p-4 rounded-xl bg-white/50 border border-[#9CB5F8] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9CB5F8]"
        rows="5"
        placeholder="Type how you're feeling today..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className={`mt-6 w-full py-3 rounded-2xl text-lg font-medium transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-[#9CB5F8] via-[#FFFFFF] to-[#9DB5FB] hover:scale-105"
        }`}
      >
        {loading ? "Analyzing..." : "Analyze Mood"}
      </button>
    </div>
  </div>
 );

};

export default MoodDetection;



