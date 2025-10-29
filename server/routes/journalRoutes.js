import express from "express";
import {
  createJournal,
  getJournals,
  updateJournal,
  deleteJournal,
} from "../controllers/journalController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

// Create a new journal entry
router.post("/", userAuth, createJournal);

// Get all journals for the logged-in user
router.get("/", userAuth, getJournals);

// Update a specific journal entry
router.put("/:id", userAuth, updateJournal);

// Delete a specific journal entry
router.delete("/:id", userAuth, deleteJournal);

export default router;
