import { useState, useEffect } from "react";
import StudyPoints from "./components/StudyPoints";
import AskBot from "./components/AskBot";
import McqGenerator from "./components/McqGenerator";

function App() {
  const [activeTab, setActiveTab] = useState("points");

  // Custom Tailwind scrollbar styles for dark theme
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
          height: 8px;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #A78BFA; /* fuchsia-400 */
          border-radius: 4px;
      }
      .scrollbar-thin::-webkit-scrollbar-track {
          background-color: #1F2937; /* gray-800 */
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const tabs = [
    { id: "points", label: "Study Points", color: "cyan" },
    { id: "ask", label: "Ask Bot", color: "fuchsia" },
    { id: "mcq", label: "MCQ Generator", color: "teal" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center font-sans">
      {/* Load Tailwind and Custom Font */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
        h1 { font-family: 'Orbitron', sans-serif; }
      `}</style>

      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 shadow-2xl shadow-gray-900 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6">
          {/* Branding */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-teal-400 tracking-wider mb-4 sm:mb-0">
            UPLYFT
          </h1>

          {/* Tabs / Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`
                  px-5 py-2.5 rounded-lg text-sm font-semibold transition duration-300
                  ${activeTab === tab.id
                    ? `bg-${tab.color}-500 hover:bg-${tab.color}-600 text-gray-900 shadow-lg shadow-${tab.color}-500/50 border border-${tab.color}-400`
                    : `bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-700`
                  }
                `}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Container (Padded to clear the fixed navbar) */}
      <div className="pt-32 sm:pt-40 w-full max-w-4xl bg-gray-900/90 shadow-2xl rounded-2xl p-6 sm:p-10 border border-gray-700/50 mb-10">
        <p className="text-gray-400 mb-8 text-center max-w-lg mx-auto">
            Your AI-powered assistant for faster, smarter learning.
        </p>

        {/* Tab Content */}
        <div className="w-full">
            {activeTab === "points" && <StudyPoints />}
            {activeTab === "ask" && <AskBot />}
            {activeTab === "mcq" && <McqGenerator />}
        </div>
      </div>
    </div>
  );
}

export default App;