import { useState } from "react";
import axios from "axios";

function AIPrescription() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    alert("Button Clicked");
    console.log("Button Clicked");

    if (!file) {
      alert("Please select a prescription.");
      return;
    }

    const formData = new FormData();
    formData.append("prescription", file);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/prescriptions/analyze",
        formData
      );

      setResult(response.data.analysis);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to analyze prescription."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-blue-700 mb-6">
          🩺 AI Prescription Reader
        </h1>

        <p className="text-gray-600 mb-6">
          Upload a doctor's prescription (PDF or Image) and let AI extract
          medicines, dosage, precautions and instructions.
        </p>

        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-6"
        />

        <br />

        <button
          onClick={handleAnalyze}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Analyzing..." : "Analyze Prescription"}
        </button>

        {result && (
          <div className="mt-8 bg-gray-100 rounded-lg p-6 whitespace-pre-wrap">
            <h2 className="text-2xl font-bold mb-4">
              🩺 AI Analysis
            </h2>

            {result}
          </div>
        )}

      </div>
    </div>
  );
}

export default AIPrescription;