import React, { useState, useEffect, useRef } from "react";
import { encryptData, decryptData } from "../utils/crypto.js";
import {
  createJournal,
  getJournals,
  updateJournal,
  deleteJournal,
} from "../utils/journalApi.js";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, Calendar } from "lucide-react";
import { useDebounce } from "use-debounce";

const Journal = () => {
  const [journals, setJournals] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState(""); // ISO date (YYYY-MM-DD)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 400);
  const [debouncedSearchDate] = useDebounce(searchDate, 400);
  

  const datePickerRef = useRef(null);

  useEffect(() => {
    fetchJournals();

    // Close date picker when clicking outside
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      const { encryptedData, iv } = await encryptData(content);
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

  // Format date & time
  const formatDateTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter journals by title/content/date
  const filteredJournals = journals.filter((j) => {
    const lowerSearch = searchTerm.trim().toLowerCase();

    // Filter by date if selected
    if (searchDate) {
      const entryDate = j.createdAt
        ? new Date(j.createdAt).toISOString().slice(0, 10)
        : "";
      const matchesDate = entryDate === searchDate;

      const matchesText =
        lowerSearch &&
        (j.title.toLowerCase().includes(lowerSearch) ||
          j.decryptedText.toLowerCase().includes(lowerSearch));

      return lowerSearch ? matchesDate && matchesText : matchesDate;
    }

    // No date selected → text search only
    if (!lowerSearch) return true;
    return (
      j.title.toLowerCase().includes(lowerSearch) ||
      j.decryptedText.toLowerCase().includes(lowerSearch) ||
      (j.createdAt &&
        new Date(j.createdAt)
          .toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
          .toLowerCase()
          .includes(lowerSearch))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 to-purple-100 text-gray-800 p-6 font-sans transition-all duration-500">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
          🌙 My Journal ✨
        </h1>

        {/* Search + New Entry Row */}
        <div className="flex items-center gap-3 mb-6 relative">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search your thoughts..."
              className="w-full pl-12 pr-32 py-3 rounded-full bg-white/80 focus:ring-2 focus:ring-pink-300 outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Calendar Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDatePicker((s) => !s);
              }}
              className="absolute right-10 top-2.5 p-2 rounded-full hover:bg-white/60 transition"
            >
              <Calendar size={18} className="text-gray-600" />
            </button>

            {/* Clear Date Filter */}
            {searchDate && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchDate("");
                }}
                className="absolute right-2 top-2.5 p-2 rounded-full hover:bg-white/60 transition"
                title="Clear date filter"
              >
                <X size={18} className="text-gray-600" />
              </button>
            )}

            {/* Date Picker Dropdown */}
            {showDatePicker && (
              <div
                ref={datePickerRef}
                className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg p-3 z-50"
              >
                <label className="block text-xs text-gray-500 mb-1">
                  Select date to filter
                </label>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => {
                    setSearchDate(e.target.value);
                  }}
                  className="w-full p-2 rounded-md border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* New Entry Button beside search bar */}
          <button
            onClick={() => {
              setShowCreateForm(true);
              setEditingId(null);
              setTitle("");
              setContent("");
            }}
            className="flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-full shadow-md transition-all whitespace-nowrap"
          >
            <Plus size={16} /> Create Journal
          </button>
        </div>


        {/* Journal List */}
        <div className="space-y-5">
          {filteredJournals.length === 0 ? (
            <p className="text-center text-gray-500">No journal entries found.</p>
          ) : (
            filteredJournals.map((j) => (
              <motion.div
                key={j._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-pink-50"
                onClick={() => setSelectedJournal(j)}
              >
                <h3 className="font-bold text-lg text-gray-800">{j.title}</h3>
                <p className="text-gray-700 mt-2">{j.decryptedText}</p>
                <p className="text-sm text-gray-500 mt-3 italic">
                  {formatDateTime(j.createdAt)}
                </p>

                <div className="flex justify-end gap-4 mt-3">
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
              className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-lg relative"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
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
                className="w-full p-2 mb-3 rounded-md border border-gray-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                placeholder="Write your thoughts..."
                className="w-full p-3 rounded-md border border-gray-300 h-40 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>

              <button
                onClick={handleSave}
                className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 mt-4 rounded-lg"
              >
                Save Entry
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
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
              className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-lg relative"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
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
              <p className="text-gray-700 whitespace-pre-wrap mb-3">
                {selectedJournal.decryptedText}
              </p>
              <p className="text-sm text-gray-500 italic">
                {formatDateTime(selectedJournal.createdAt)}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Journal;
