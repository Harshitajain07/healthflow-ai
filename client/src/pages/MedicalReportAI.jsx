import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

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

    if (!user || !user.id) {
      alert("User information not found. Please login again.");
      return;
    }

    const formData = new FormData();

    formData.append("report", file);
    formData.append("patient", user.id);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/reports/summarize",
        formData
      );

      setSummary(response.data.summary);

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to analyze report."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Download Summary as PDF
  // ============================
  const downloadPDF = () => {
    if (!summary) {
      alert("Please analyze a medical report first.");
      return;
    }

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("HealthFlow AI", margin, 20);

    // Subtitle
    doc.setFontSize(16);
    doc.text("Medical Report Summary", margin, 32);

    // Patient information
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const patientName = user?.fullName || "Patient";
    const patientEmail = user?.email || "";

    doc.text(`Patient: ${patientName}`, margin, 44);

    if (patientEmail) {
      doc.text(`Email: ${patientEmail}`, margin, 51);
    }

    // Line
    doc.line(margin, 57, pageWidth - margin, 57);

    // Summary text
    doc.setFontSize(11);

    const cleanSummary = summary
      .replace(/#{1,6}/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "");

    const lines = doc.splitTextToSize(cleanSummary, maxWidth);

    let y = 68;

    lines.forEach((line) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }

      doc.text(line, margin, y);
      y += 7;
    });

    // Footer on last page
    doc.setFontSize(9);

    if (y > pageHeight - 30) {
      doc.addPage();
      y = 20;
    }

    doc.line(margin, y, pageWidth - margin, y);

    y += 8;

    doc.text(
      "AI analysis is for educational purposes only and is not",
      margin,
      y
    );

    y += 5;

    doc.text(
      "a substitute for professional medical advice.",
      margin,
      y
    );

    // Download
    doc.save("HealthFlow_AI_Medical_Report_Summary.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-5xl mx-auto">

        {/* Upload Section */}
        <div className="bg-white shadow-lg rounded-xl p-8">

          <h1 className="text-4xl font-bold text-blue-700 mb-3">
              AI Medical Report Summarizer
          </h1>

          <p className="text-gray-600 mb-6">
            Upload your medical report and let AI summarize
            the important information in an easy-to-understand format.
          </p>

          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full mb-4 p-3 border rounded-lg"
          />

          {file && (
            <p className="text-gray-700 mb-4">
              📎 Selected file:{" "}
              <strong>{file.name}</strong>
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {loading ? "🔄 Analyzing..." : "🔍 Analyze Report"}
          </button>

        </div>


        {/* Summary Section */}
        {summary && (
          <div className="mt-8 bg-white shadow-lg rounded-xl p-8">

            <h2 className="text-3xl font-bold text-blue-700 mb-6">
              🤖 Medical Report Summary
            </h2>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">

              <h3 className="text-xl font-bold text-blue-700 mb-4">
                📋 AI Analysis
              </h3>

              <div className="whitespace-pre-wrap text-gray-700 leading-7">
                {summary}
              </div>

            </div>


            {/* Download Button */}
            <div className="mt-6 flex justify-center">

              <button
                onClick={downloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition"
              >
                📥 Download Summary as PDF
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default MedicalReportAI;