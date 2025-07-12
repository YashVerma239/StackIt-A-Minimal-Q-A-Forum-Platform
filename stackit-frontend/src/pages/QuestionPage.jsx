import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function QuestionPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qRes = await API.get(`/questions/${id}`);
        setQuestion(qRes.data);

        const aRes = await API.get(`/answers/${id}`);
        setAnswers(aRes.data);
      } catch (err) {
        console.error("Error loading question or answers:", err.message);
      }
    };

    fetchData();
  }, [id]);

  const handleVote = async (answerId, voteType) => {
    console.log("Voting:", voteType, "on answer", answerId);
    try {
      await API.post(
        `/answers/${answerId}/vote`,
        { voteType },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const aRes = await API.get(`/answers/${id}`);
      setAnswers(aRes.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Error voting");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to post an answer.");
      return;
    }

    if (newAnswer.trim().length < 5) {
      alert("Answer must be at least 5 characters.");
      return;
    }

    try {
      setLoading(true);
      await API.post(
        "/answers",
        {
          questionId: id,
          content: `<p>${newAnswer}</p>`,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setNewAnswer("");
      const aRes = await API.get(`/answers/${id}`);
      setAnswers(aRes.data);
    } catch (err) {
      console.error("Error posting answer:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!question) return <p className="p-4">Loading question...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{question.title}</h2>
      <div
        className="text-gray-700 mb-4"
        dangerouslySetInnerHTML={{ __html: question.description }}
      />
      <div className="text-sm text-gray-500 mb-4">
        Tags: {question.tags.join(", ")} | Asked by: {question.user.name}
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">💬 Answers</h3>
      {answers.length === 0 ? (
        <p>No answers yet.</p>
      ) : (
        answers.map((a) => (
          <div key={a._id} className="bg-gray-100 p-3 rounded mb-3">
            <div
              className="text-gray-800"
              dangerouslySetInnerHTML={{ __html: a.content }}
            />
            <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
              <span>
                Votes: {a.votes} | By: {a.user.name}
                {a.isAccepted && (
                  <span className="text-green-600 font-semibold ml-2">
                    ✔ Accepted
                  </span>
                )}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => handleVote(a._id, "up")}
                  className="text-green-600 hover:underline"
                >
                  👍
                </button>
                <button
                  onClick={() => handleVote(a._id, "down")}
                  className="text-red-600 hover:underline"
                >
                  👎
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      <h3 className="text-lg font-bold mt-8 mb-2">✍️ Post Your Answer</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="w-full border p-2 rounded h-32 mb-2"
          placeholder="Write your answer here..."
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Posting..." : "Submit Answer"}
        </button>
      </form>
    </div>
  );
}

export default QuestionPage;
