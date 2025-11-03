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

      let emotion = data.emotion || data.label || data.final_label;

      if (!emotion) {
        alert("Couldn't detect emotion. Please try again.");
        return;
      }

      navigate(`/guide/${emotion.toLowerCase()}`);
    } catch (error) {
      console.error("Error analyzing mood:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen radial-gradient(125% 125% at 50% 10%, #FBD3E9 30%, #BBDEFB 100%) text-black px-6">
      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-10 w-full max-w-xl text-center border border-white/60">
        <h1 className="text-3xl font-semibold mb-6 flex items-center justify-center gap-2">
          How are you feeling today? <span className="text-2xl">🌸</span>
        </h1>

        <textarea
          className="w-full p-4 rounded-xl bg-white/60 border border-[#9CB5F8] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9CB5F8] shadow-inner"
          rows="5"
          placeholder="Type how you're feeling today..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-2xl text-lg font-medium transition transform ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#A5B8FF] via-[#FFFFFF] to-[#A5B8FF] hover:scale-105 hover:shadow-md"
          }`}
        >
          {loading ? "Reflecting..." : "Let's Reflect"}
        </button>
      </div>
    </div>
  );
};

export default MoodDetection;




