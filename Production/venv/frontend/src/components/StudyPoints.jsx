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

function StudyPoints() {
  const [topic, setTopic] = useState("");
  const [points, setPoints] = useState([]);
  const [videos, setVideos] = useState([]); // New state for videos
  const { isLoading, error, fetchData } = useFetch();

  const fetchPoints = async () => {
    if (!topic.trim()) return;
    setPoints([]);
    setVideos([]); // Clear videos on new search

    const data = await fetchData("http://localhost:8000/study/points", { topic });

    if (data) {
      // Normalize and set study points from the new response structure
      let newPoints = data.response ? data.response.split('\n').filter(p => p.trim()) : [];
      if (newPoints.length === 0) {
        newPoints = ["No study points returned for this topic. Please check the backend service output."];
      }
      setPoints(newPoints);

      // Set videos from the new response structure
      if (Array.isArray(data.videos)) {
        setVideos(data.videos);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">Get Key Points & Videos</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="e.g., Quantum Entanglement or The Roman Empire"
          className="flex-1 p-3 rounded-xl bg-gray-700 text-white placeholder-gray-500 border border-cyan-400/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition duration-300"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchPoints()}
          disabled={isLoading}
        />
        <button
          onClick={fetchPoints}
          disabled={isLoading || !topic.trim()}
          className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold px-6 py-3 rounded-xl transition duration-300 shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Get Points & Videos'}
        </button>
      </div>

      <div className="min-h-[200px] p-4 rounded-xl bg-gray-800 border border-gray-700">
        {error && <p className="text-red-400 font-semibold">{error}</p>}
        {isLoading ? (
          <p className="text-gray-400 animate-pulse">Processing brilliance...</p>
        ) : (
          <>
            {points.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">Key Study Points</h3>
                <ul className="list-none list-outside space-y-3 pl-5 text-gray-200">
                  {points.map((p, i) => (
                    <li key={i} className="leading-relaxed marker:text-cyan-400">{p}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {videos.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">Related Videos</h3>
                <ul className="list-none list-outside space-y-3 pl-5 text-gray-200">
                  {videos.map((video, i) => (
                    <li key={i} className="leading-relaxed marker:text-cyan-400">
                      <a href={video.url} rel="noopener noreferrer" className="text-white hover:text-cyan-400 transition-colors duration-300">
                        {video.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {!isLoading && points.length === 0 && videos.length === 0 && (
              <p className="text-gray-500">Study points and videos will appear here after generation.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StudyPoints;