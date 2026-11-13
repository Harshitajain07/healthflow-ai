
import { useRef, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function MedicalReportAI() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setError("");
    setSummary("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFile(null);
      event.target.value = "";
      setError("Please select a PDF, PNG, or JPG medical report.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      event.target.value = "";
      setError("File size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a medical report first.");
      return;
    }

    if (!user?.id) {
      setError("User information not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("report", file);
    formData.append("patient", user.id);

    try {
      setLoading(true);
      setError("");
      setSummary("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/reports/summarize",
        formData,
        {
          headers: {
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
        }
      );

      if (!response.data?.summary) {
        throw new Error("No summary was returned. Please try again.");
      }

      setSummary(response.data.summary);
    } catch (err) {
      console.error("Medical report analysis error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to analyze the medical report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!summary) {
      setError("Please analyze a medical report first.");
      return;
    }

    try {
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;

      // Header
      doc.setFillColor(13, 148, 136);
      doc.rect(0, 0, pageWidth, 42, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("HealthFlow AI", margin, 19);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Medical Report Summary", margin, 30);

      // Patient information
      doc.setTextColor(40, 50, 60);
      doc.setFontSize(10);
      doc.text(`Patient: ${user?.fullName || "Patient"}`, margin, 54);

      if (user?.email) {
        doc.text(`Email: ${user.email}`, margin, 61);
      }

      doc.setDrawColor(210, 220, 225);
      doc.line(margin, 68, pageWidth - margin, 68);

      // Clean basic Markdown formatting
      const cleanSummary = summary
        .replace(/^#{1,6}\s*/gm, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1")
        .replace(/[\u{1F000}-\u{1FAFF}]/gu, "")
        .replace(/[^\x20-\x7E\n\r\t]/g, " ")
        .replace(/[ \t]+/g, " ")
        .trim();

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(55, 65, 81);

      const lines = doc.splitTextToSize(cleanSummary, maxWidth);

      let y = 80;
      const lineHeight = 6;

      lines.forEach((line) => {
        if (y > pageHeight - 25) {
          doc.addPage();
          y = 20;
        }

        doc.text(line, margin, y);
        y += lineHeight;
      });

      // Disclaimer
      if (y > pageHeight - 35) {
        doc.addPage();
        y = 20;
      }

      y += 5;
      doc.setDrawColor(210, 220, 225);
      doc.line(margin, y, pageWidth - margin, y);

      y += 9;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Medical Disclaimer", margin, y);

      y += 6;
      doc.setFont("helvetica", "normal");

      const disclaimer =
        "This AI-generated summary is for educational purposes only. " +
        "It is not a medical diagnosis or a substitute for professional " +
        "medical advice. Consult your healthcare professional.";

      const disclaimerLines = doc.splitTextToSize(disclaimer, maxWidth);

      disclaimerLines.forEach((line) => {
        if (y > pageHeight - 15) {
          doc.addPage();
          y = 20;
        }

        doc.text(line, margin, y);
        y += 5;
      });

      doc.save("HealthFlow_AI_Medical_Report_Summary.pdf");
    } catch (err) {
      console.error("PDF download error:", err);
      setError("Unable to generate the PDF. Please try again.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setSummary("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
            HealthFlow AI / AI Healthcare Tools
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-800 sm:text-4xl">
            AI Medical Report Summarizer
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Upload your medical report and let AI explain the important
            findings in a clear and easy-to-understand format.
          </p>
        </div>

        {/* Upload Section */}
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-3xl">
              🏥
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Upload Medical Report
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                PDF, PNG, JPG or JPEG · Maximum 10 MB
              </p>
            </div>
          </div>

          <label
            htmlFor="medical-report"
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/50 px-5 py-10 text-center transition hover:border-teal-400 hover:bg-teal-50"
          >
            <span className="text-4xl">📄</span>

            <span className="mt-4 font-bold text-slate-800">
              Choose your medical report
            </span>

            <span className="mt-2 text-sm text-slate-500">
              Click below to browse files from your device
            </span>

            <span className="mt-5 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white">
              Browse Files
            </span>

            <input
              ref={fileInputRef}
              id="medical-report"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
            />
          </label>

          {/* Selected File */}
          {file && (
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-teal-100 bg-teal-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-2xl">
                  {file.type === "application/pdf" ? "📕" : "🖼️"}
                </span>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-800">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Remove File
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Analyze Button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || loading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-teal-700 px-6 py-4 font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Analyzing Medical Report...
              </>
            ) : (
              <>✨ Analyze Medical Report</>
            )}
          </button>
        </section>

        {/* Summary Section */}
        {summary && (
          <section className="mt-8 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
                  AI Generated Report
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-slate-800">
                  Medical Report Summary
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={downloadPDF}
                  className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                >
                  📥 Download PDF
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  New Report
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-5 sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <span className="text-2xl">🤖</span>
                  <h3 className="text-lg font-bold text-teal-900">
                    AI Analysis
                  </h3>
                </div>

                <div className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 sm:text-base">
                  {summary}
                </div>
              </div>
            </div>

            <div className="border-t border-amber-100 bg-amber-50 p-5">
              <p className="text-sm leading-6 text-amber-900">
                <strong>Medical Safety Notice:</strong> This AI-generated
                summary may contain errors. It is not a diagnosis or a
                substitute for professional medical advice. Always discuss
                your report and treatment decisions with your doctor.
              </p>
            </div>
          </section>
        )}

        {/* Safety Note */}
        {!summary && (
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-sm leading-6 text-amber-900">
              <strong>Important:</strong> Your report contains private
              medical information. Only upload documents you are authorized
              to share. Always consult your doctor about medical findings.
            </p>
          </div>
        )}

        <footer className="mt-8 border-t border-slate-200 py-5 text-center text-xs text-slate-400">
          HealthFlow AI · AI Medical Report Summarizer
        </footer>
      </div>
    </div>
  );
}

export default MedicalReportAI;
