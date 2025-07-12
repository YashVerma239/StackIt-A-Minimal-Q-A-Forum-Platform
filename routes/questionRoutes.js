const express = require("express");
const router = express.Router();

const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
} = require("../controllers/questionController");

const protect = require("../middlewares/authMiddleware");

// ✅ Routes
router.post("/", protect, createQuestion);     // create new question
router.get("/", getAllQuestions);              // get all questions
router.get("/:id", getQuestionById);           // get a specific question

module.exports = router;
