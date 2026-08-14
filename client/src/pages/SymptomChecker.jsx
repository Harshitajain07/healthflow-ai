import { useState } from "react";
import axios from "axios";

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeSymptoms = async () => {
    if (!symptoms) {
      alert("Please enter symptoms");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/symptoms",
        {
          symptoms,
        }
      );

      setResult(response.data.result);

    } catch (error) {
      alert("AI analysis failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        🤖 AI Symptom Checker
      </h1>

      <textarea
        rows="6"
        placeholder="Describe your symptoms..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        className="w-full border rounded-lg p-4"
      />

      <button
        onClick={analyzeSymptoms}
        className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Analyzing..." : "Analyze Symptoms"}
      </button>

      {result && (
        <div className="bg-white mt-8 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            AI Result
          </h2>

          <pre className="whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}

    </div>
  );
}

export default SymptomChecker;