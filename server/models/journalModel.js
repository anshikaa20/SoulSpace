import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  encryptedText: { type: String, required: true },
  iv: { type: String, required: true }, // Initialization vector for AES
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Journal", journalSchema);
