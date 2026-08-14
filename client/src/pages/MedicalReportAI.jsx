import { useState } from "react";
import axios from "axios";

function MedicalReportAI() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a report.");
      return;
    }

    const formData = new FormData();

    formData.append("report", file);

    // Send logged-in patient ID
    formData.append("patient", user._id);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/reports/summarize",
        formData
      );

      setSummary(response.data.summary);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to analyze report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-4xl font-bold text-blue-700 mb-6">
          📄 AI Medical Report Summarizer
        </h1>

        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-6"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Analyzing..." : "Analyze Report"}
        </button>

        {summary && (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg whitespace-pre-wrap">
            {summary}
          </div>
        )}

      </div>

    </div>
  );
}

export default MedicalReportAI;