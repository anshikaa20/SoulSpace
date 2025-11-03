// src/utils/journalApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/journal",
  withCredentials: true, // important for JWT cookies
});

// Helper to handle API responses consistently
const handleResponse = (res) => {
  if (res.data?.success === false) {
    throw new Error(res.data.message || "Request failed");
  }
  return res.data;
};

// Create a new journal entry
export const createJournal = async (data) => {
  try {
    const res = await API.post("/", data);
    return handleResponse(res);
  } catch (err) {
    console.error("Error creating journal:", err);
    throw err;
  }
};

// Get all journals of the logged-in user
export const getJournals = async () => {
  try {
    const res = await API.get("/");
    return handleResponse(res);
  } catch (err) {
    console.error("Error fetching journals:", err);
    throw err;
  }
};

// Update a specific journal entry
export const updateJournal = async (id, data) => {
  try {
    const res = await API.put(`/${id}`, data);
    return handleResponse(res);
  } catch (err) {
    console.error("Error updating journal:", err);
    throw err;
  }
};

// Delete a specific journal entry
export const deleteJournal = async (id) => {
  try {
    const res = await API.delete(`/${id}`);
    return handleResponse(res);
  } catch (err) {
    console.error("Error deleting journal:", err);
    throw err;
  }
};
