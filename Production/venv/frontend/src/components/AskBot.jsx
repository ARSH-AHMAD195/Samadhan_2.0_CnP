import { useState } from "react";
import axios from "axios";

function AskBot() {
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [youtubeLink, setYoutubeLink] = useState("");

  const askBot = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/study/ask?query=${query}%${youtubeLink}`);
      let { question, answer } = res.data;

      // normalize
      if (!Array.isArray(answer)) {
        answer = [answer];
      }

      setChat((prev) => [...prev, { question, answer }]);
      setQuery("");
    } catch (err) {
      console.error(err);
    }
  };

  const getEmbedLink = (link) => {
  try {
    const url = new URL(link);

    // Case: standard YouTube link
    if (url.hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Case: short YouTube link
    if (url.hostname === "youtu.be") {
      const videoId = url.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return null;
    } catch {
      return null;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 h-screen p-4">
      {/* Left Panel: YouTube */}
      <div className="w-full sm:w-2/3 h-[60%] border rounded p-2 bg-gray-700 text-white ">
        <h2 className="text-lg font-semibold mb-2">Watch YouTube</h2>
        <input
          type="text"
          placeholder="Paste YouTube link"
          className="w-full border px-2 py-1 rounded mb-2"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
        />
        {youtubeLink && getEmbedLink(youtubeLink) && (
          <iframe
            width="100%"
            height="300"
            src={getEmbedLink(youtubeLink)}
            title="YouTube video"
            allowFullScreen
          ></iframe>
        )}

      </div>

      {/* Right Panel: Chat Bot */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Ask the Bot</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Ask a question"
            className="flex-1 border px-3 py-2 rounded"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={askBot} className="bg-fuchsia-500 hover:bg-fuchsia-600 text-gray-900 font-bold px-6 py-3 rounded-xl transition duration-300 shadow-lg shadow-fuchsia-500/50 disabled:opacity-50 disabled:cursor-not-allowed">
            Ask
          </button>
        </div>
        <div className="space-y-3">
          {chat.map((c, i) => (
            <div key={i} className="border p-3 rounded text-gray-800 font-bold bg-gray-50">
              <p><b>Q:</b> {c.question}</p>
              <p><b>A:</b></p>
              <ul className="list-none pl-6">
                {c.answer.map((ans, idx) => (
                  <li key={idx}>{ans}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AskBot;
