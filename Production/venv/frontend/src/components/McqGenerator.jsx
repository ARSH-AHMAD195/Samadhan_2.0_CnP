import { useState, useCallback } from "react";
import axios from "axios";

const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      // NOTE: This uses the URL provided in your original request.
      const res = await axios.get(url, { params });
      return res.data;
    } catch (err) {
      console.error("API Fetch Error:", err);
      // Construct a user-friendly error message
      const errorMessage = `Error connecting to backend API (${url}). Please ensure your FastAPI service is running locally on port 8000.`;
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, fetchData };
};

function McqGenerator() {
  const [topic, setTopic] = useState("");
  const [mcq, setMcq] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const { isLoading, error, fetchData } = useFetch();

  const fetchMcq = async () => {
    if (!topic.trim()) return;
    setMcq(null);
    setShowAnswer(false);

    const data = await fetchData("http://localhost:8000/study/mcq", { topic });

    if (data) {
      // Assuming API returns { question, options, answer }
      const normalizedOptions = Array.isArray(data.options) ? data.options : [data.options].filter(Boolean);
      const normalizedAnswer = Array.isArray(data.answer) ? data.answer.join(", ") : String(data.answer || "N/A");

      if (data.question && normalizedOptions.length > 0) {
        setMcq({ question: data.question, options: normalizedOptions, answer: normalizedAnswer });
      } else {
        setMcq({ question: "Received invalid data structure from API.", options: [], answer: "N/A" });
      }
    } else if (error) {
        setMcq({ question: error, options: [], answer: "N/A" });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-teal-400">MCQ Generator</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="e.g., Photosynthesis steps or JavaScript Closures"
          className="flex-1 p-3 rounded-xl bg-gray-700 text-white placeholder-gray-500 border border-teal-400/50 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition duration-300"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchMcq()}
          disabled={isLoading}
        />
        <button
          onClick={fetchMcq}
          disabled={isLoading || !topic.trim()}
          className="bg-teal-500 hover:bg-teal-600 text-gray-900 font-bold px-6 py-3 rounded-xl transition duration-300 shadow-lg shadow-teal-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Generate'}
        </button>
      </div>

      <div className="min-h-[250px] p-5 rounded-xl bg-gray-800 border border-gray-700">
        {error && !mcq && <p className="text-red-400 font-semibold">{error}</p>}
        {isLoading ? (
          <p className="text-gray-400 animate-pulse">Forging question...</p>
        ) : mcq && mcq.question ? (
          <div className="space-y-4">
            <p className="font-semibold text-lg text-gray-100">{mcq.question}</p>
            <ul className="list-none space-y-2 text-gray-300">
              {mcq.options.map((opt, i) => (
                <li key={i} className={`p-2 rounded transition duration-200 ${
                  showAnswer && opt === mcq.answer
                    ? 'bg-green-600/70 text-white shadow-inner shadow-green-500/50 font-bold'
                    : 'hover:bg-gray-700'
                }`}>
                  <span className="font-mono pr-2 text-teal-400">{String.fromCharCode(65 + i)}.</span> {opt}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="mt-4 bg-gray-700 text-teal-400 border border-teal-400/50 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition duration-300"
            >
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>

            {showAnswer && (
              <p className="mt-2 text-green-400 font-bold text-lg">
                Correct Answer: {mcq.answer}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">A multiple-choice question will be generated here.</p>
        )}
      </div>
    </div>
  );
}
export default McqGenerator;
