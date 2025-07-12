const Answer = require("../models/Answer");

exports.postAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;
    const answer = await Answer.create({
      question: questionId,
      content,
      user: req.user._id,
    });
    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ msg: "Error posting answer" });
  }
};

exports.getAnswersByQuestion = async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId }).populate("user", "name");
    res.status(200).json(answers);
  } catch (err) {
    res.status(500).json({ msg: "Error loading answers" });
  }
};

exports.voteAnswer = async (req, res) => {
  const { voteType } = req.body;
  const userId = req.user._id;
  const answerId = req.params.id;

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ msg: "Answer not found" });

    const alreadyVoted = answer.votedBy.find(
      (v) => v.user.toString() === userId.toString()
    );

    if (alreadyVoted) {
      alreadyVoted.voteType = voteType;
    } else {
      answer.votedBy.push({ user: userId, voteType });
    }

    const voteScore = answer.votedBy.reduce((sum, v) => {
      return sum + (v.voteType === "up" ? 1 : -1);
    }, 0);

    answer.votes = voteScore;
    await answer.save();

    res.status(200).json({ msg: "Vote recorded", votes: voteScore });
  } catch (err) {
    res.status(500).json({ msg: "Error voting", error: err.message });
  }
};
