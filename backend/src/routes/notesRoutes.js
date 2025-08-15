import express from "express";
import { createNote, deleteNode, getAllNotes, updateNote, getNoteById } from "../controllers/notesControllers.js";
const router = express.Router();

// GET all notes
router.get("/", getAllNotes);
// GET  notes BY ID
router.get("/:id", getNoteById);
// POST a new note
router.post("/", createNote);
// PUT (update) a note by ID
router.put("/:id", updateNote);
// DELETE a note by ID
router.delete("/:id", deleteNode);

export default router;
