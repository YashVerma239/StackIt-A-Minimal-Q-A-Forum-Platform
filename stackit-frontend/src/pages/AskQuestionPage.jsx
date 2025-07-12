import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AskQuestionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    console.log("Token being sent:", token); // ✅ 1. Check token

    console.log("Sending data:", {
      title,
      description,
      tagsArray: tags.split(",").map((tag) => tag.trim()),
    }); // ✅ 2. See exactly what’s being sent

    // Check if token is missing
    if (!token) {
      alert("Please login to ask a question.");
      return;
    }

    if (!title || !description || !tags) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await API.post(
        "/questions",
        {
          title,
          description: `<p>${description}</p>`,
          tags: tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert("Question posted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Post error:", err.response?.data || err.message); // ✅ 3. Print backend error
      alert("Error posting question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📝 Ask a New Question</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Title of your question"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full border p-2 mb-3 rounded h-28"
          placeholder="Describe your question"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          className="w-full border p-2 mb-4 rounded"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Submit Question"}
        </button>
      </form>
    </div>
  );
}

export default AskQuestionPage;
