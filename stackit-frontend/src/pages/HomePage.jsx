import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function HomePage() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await API.get("/questions");
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err.message);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📄 All Questions</h2>
      {questions.length === 0 ? (
        <p>No questions yet.</p>
      ) : (
        questions.map((q) => (
          <div key={q._id} className="bg-white shadow-md rounded p-4 mb-4">
            <Link to={`/questions/${q._id}`}>
              <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                {q.title}
              </h3>
            </Link>
            <p
              className="text-sm text-gray-700 mt-1"
              dangerouslySetInnerHTML={{ __html: q.description }}
            />
            <div className="text-sm text-gray-500 mt-2">
              Tags: {q.tags.join(", ")} | Asked by: {q.user.name}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HomePage;
