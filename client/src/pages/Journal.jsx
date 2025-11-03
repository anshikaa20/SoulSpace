import React, { useState, useEffect } from "react";
import { encryptData, decryptData } from "../utils/crypto.js";
import {
  createJournal,
  getJournals,
  updateJournal,
  deleteJournal,
} from "../utils/journalApi.js";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search } from "lucide-react";

const Journal = () => {
  const [journals, setJournals] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);

  // Fetch journals on mount
  useEffect(() => {
    fetchJournals();
  }, []);

  // Fetch all journals (with decryption)
  const fetchJournals = async () => {
    try {
      const res = await getJournals();
      const journalsData = Array.isArray(res.data) ? res.data : res;

      const decrypted = await Promise.all(
        journalsData.map(async (j) => ({
          ...j,
          decryptedText: j.encryptedText
            ? await decryptData(j.encryptedText, j.iv)
            : "",
        }))
      );

      setJournals(decrypted);
    } catch (err) {
      console.error("Error fetching journals:", err);
    }
  };

  // Create or update journal
  const handleSave = async () => {
    if (!title || !content) return alert("Please fill in all fields.");

    try {
      // Encrypt content before sending
      const { encryptedData, iv } = await encryptData(content);

      // ✅ FIX: backend expects "encryptedText"
      const payload = { title, encryptedText: encryptedData, iv };

      if (editingId) {
        await updateJournal(editingId, payload);
        setEditingId(null);
      } else {
        await createJournal(payload);
      }

      setTitle("");
      setContent("");
      setShowCreateForm(false);
      fetchJournals();
    } catch (err) {
      console.error("Error saving journal:", err);
    }
  };

  // Delete journal
  const handleDelete = async (id) => {
    if (window.confirm("Delete this journal?")) {
      try {
        await deleteJournal(id);
        fetchJournals();
      } catch (err) {
        console.error("Error deleting journal:", err);
      }
    }
  };

  // Filter by search term
  const filteredJournals = journals.filter((j) =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 to-purple-100 text-gray-800 p-6 font-sans transition-all duration-500">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
          🌙 My Journal ✨
        </h1>

        {/* Search + Create */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-2/3">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search your thoughts..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white/70 focus:ring-2 focus:ring-pink-300 outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-full shadow-md transition-all"
          >
            <Plus size={18} /> New Entry
          </button>
        </div>

        {/* Journal List */}
        <div className="space-y-4">
          {filteredJournals.length === 0 ? (
            <p className="text-center text-gray-500">No journal entries found.</p>
          ) : (
            filteredJournals.map((j) => (
              <motion.div
                key={j._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedJournal(j)}
              >
                <h3 className="font-bold text-lg mb-2 text-gray-800">{j.title}</h3>
                <p className="text-gray-600 truncate">{j.decryptedText}</p>
                <div className="flex justify-end mt-2 space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCreateForm(true);
                      setTitle(j.title);
                      setContent(j.decryptedText);
                      setEditingId(j._id);
                    }}
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(j._id);
                    }}
                    className="text-sm text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setShowCreateForm(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X />
              </button>

              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {editingId ? "Edit Entry" : "Create a New Entry"}
              </h2>

              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 mb-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-300 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Write your thoughts..."
                className="w-full p-3 rounded-md border border-gray-300 h-40 resize-none focus:ring-2 focus:ring-pink-300 outline-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>

              <button
                onClick={handleSave}
                className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 mt-4 rounded-lg shadow-md transition-all"
              >
                Save Entry
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Full Journal Modal */}
      <AnimatePresence>
        {selectedJournal && (
          <motion.div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedJournal(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedJournal(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X />
              </button>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {selectedJournal.title}
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedJournal.decryptedText}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Journal;
