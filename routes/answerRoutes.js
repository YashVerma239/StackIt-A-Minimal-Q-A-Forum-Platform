const express = require("express");
const router = express.Router();
const {
  postAnswer,
  getAnswersByQuestion,
  voteAnswer,
} = require("../controllers/answerController");

const protect = require("../middlewares/authMiddleware");

router.post("/", protect, postAnswer);
router.get("/:questionId", getAnswersByQuestion);
router.post("/:id/vote", protect, voteAnswer);

module.exports = router;
