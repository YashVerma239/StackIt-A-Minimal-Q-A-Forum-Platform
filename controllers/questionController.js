const Question = require("../models/Question");

exports.createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    const question = await Question.create({
      title,
      description,
      tags,
      user: req.user._id,
    });

    res.status(201).json({ msg: "Question created", question });
  } catch (err) {
    res.status(500).json({ msg: "Error creating question", error: err.message });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("user", "name").sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching questions", error: err.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("user", "name");
    if (!question) return res.status(404).json({ msg: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching question", error: err.message });
  }
};
