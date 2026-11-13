const express = require("express");
const mongoose = require("mongoose");
const Note = require("../models/Note");
const { protect } = require("../middleware/auth");
const appEvents = require("../utils/events");

const router = express.Router();

// All note routes require a valid JWT.
router.use(protect);

// POST /api/notes
router.post("/", async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Note.create({
      title,
      content,
      owner: req.user._id
    });

    appEvents.emit("noteCreated", note);

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

// GET /api/notes - users can see only their own notes
router.get("/", async (req, res, next) => {
  try {
    const notes = await Note.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
});

// GET /api/notes/:id
router.get("/:id", async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
});

// PUT /api/notes/:id
router.put("/:id", async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.content !== undefined) updates.content = req.body.content;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/notes/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
