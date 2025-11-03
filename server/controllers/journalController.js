import Journal from "../models/journalModel.js";

// CREATE a new journal entry
export const createJournal = async (req, res) => {
  try {
    const { title, encryptedText, iv, userId } = req.body;

    const journal = await Journal.create({
      userId, // ✅ use this
      title,
      encryptedText,
      iv,
    });

    res.status(201).json(journal);
  } catch (error) {
    console.error("Error creating journal:", error);
    res.status(500).json({ message: "Failed to save journal" });
  }
};

// READ all journals for the logged-in user
export const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.body.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(journals);
  } catch (error) {
    console.error("Error fetching journals:", error);
    res.status(500).json({ message: "Failed to fetch journals" });
  }
};

// UPDATE
export const updateJournal = async (req, res) => {
  try {
    const { title, encryptedText, iv, userId } = req.body;

    const updated = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId },
      { title, encryptedText, iv },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Journal not found" });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating journal:", error);
    res.status(500).json({ message: "Failed to update journal" });
  }
};

// DELETE
export const deleteJournal = async (req, res) => {
  try {
    const deleted = await Journal.findOneAndDelete({
      _id: req.params.id,
      userId: req.body.userId,
    });

    if (!deleted)
      return res.status(404).json({ message: "Journal not found" });

    res.status(200).json({ message: "Journal deleted successfully" });
  } catch (error) {
    console.error("Error deleting journal:", error);
    res.status(500).json({ message: "Failed to delete journal" });
  }
};
