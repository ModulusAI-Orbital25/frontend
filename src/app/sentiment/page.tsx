'use client';

import { useState } from "react";
import axios from "axios";
import {
  Tooltip,
  Pie,
  PieChart
} from "recharts";

const SentimentPage = () => {
  const [modules, setModules] = useState<string[]>([""]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleModuleChange = (index: number, value: string) => {
    const updated = [...modules];
    updated[index] = value.toUpperCase();
    setModules(updated);
  };

  const addModule = () => {
    setModules([...modules, ""]);
  };

  const analyzeModules = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/sentiment/bert", {
        modules: modules.filter((mod) => mod.trim() !== ""),
      });
      setResults(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
  <div className="min-h-screen bg-gray-100 px-6 py-10">
    <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
      📊 Module Sentiment Compass
    </h1>

    <div className="space-y-3 max-w-xl mx-auto">
      {modules.map((mod, idx) => (
        <input
          key={idx}
          value={mod}
          onChange={(e) => handleModuleChange(idx, e.target.value)}
          placeholder="Enter module code (e.g. CS2100)"
          className="p-3 rounded-md border w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      ))}
    </div>

    <div className="mt-6 flex justify-center gap-4">
      <button
        onClick={addModule}
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow transition"
      >
        ➕ Add Module
      </button>
      <button
        onClick={analyzeModules}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
      >
        🚀 Analyze
      </button>
    </div>

    {loading && <p className="mt-6 text-center text-blue-600">Analyzing...</p>}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      {results.map((res, idx) => (
        <div
          key={idx}
          className="bg-white p-6 rounded-2xl shadow-md border w-full max-w-xl mx-auto"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
            📘 {res.module}
          </h2>

          {res.error ? (
            <p className="text-red-500 text-center">Error: {res.error}</p>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <PieChart width={250} height={250}>
                  <Pie
                    data={[
                      {
                        name: "Positive",
                        value: res.sentiment_distribution.label_2,
                        fill: "#00C49F",
                      },
                      {
                        name: "Neutral",
                        value: res.sentiment_distribution.label_1,
                        fill: "#FFBB28",
                      },
                      {
                        name: "Negative",
                        value: res.sentiment_distribution.label_0,
                        fill: "#FF4C4C",
                      },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  />
                  <Tooltip />
                </PieChart>
              </div>

              <div className="w-full">
                <h3 className="font-medium text-sm text-gray-600 mb-2">Sample Comments:</h3>
                <ul className="text-sm text-gray-800 list-disc ml-5 space-y-1">
                  {res.sample_comments.map((c: string, i: number) => (
                    <li key={i}>{c.slice(0, 90)}...</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  </div>
);
};

export default SentimentPage;