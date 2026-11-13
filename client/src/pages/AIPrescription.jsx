
import { useRef, useState } from "react";
import axios from "axios";

function AIPrescription() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setError("");
    setResult("");
    setCopied(false);

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
      setError("Please select a PDF, PNG, or JPG prescription.");
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

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a prescription before analyzing.");
      return;
    }

    const formData = new FormData();
    formData.append("prescription", file);

    try {
      setLoading(true);
      setError("");
      setResult("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/prescriptions/analyze",
        formData,
        {
          headers: {
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
        }
      );

      const analysis = response.data?.analysis;

      if (!analysis) {
        throw new Error("No analysis was returned. Please try again.");
      }

      setResult(analysis);
    } catch (err) {
      console.error("Prescription analysis error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to analyze the prescription. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy the analysis. Please select and copy it manually.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult("");
    setError("");
    setCopied(false);

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
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
            HealthFlow AI / AI Healthcare Tools
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-800 sm:text-4xl">
            AI Prescription Reader
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Upload a doctor's prescription and use AI to understand the
            medicines, dosage instructions, precautions, and other details.
          </p>
        </div>

        {/* Upload Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-3xl">
              🩺
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Upload Prescription
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Supported formats: PDF, PNG, JPG · Maximum size: 10 MB
              </p>
            </div>
          </div>

          <label
            htmlFor="prescription-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/50 px-5 py-10 text-center transition hover:border-teal-400 hover:bg-teal-50"
          >
            <span className="text-4xl">📄</span>

            <span className="mt-4 font-bold text-slate-800">
              Choose your prescription
            </span>

            <span className="mt-2 text-sm text-slate-500">
              Click here to browse files from your device
            </span>

            <span className="mt-5 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white">
              Browse Files
            </span>

            <input
              ref={fileInputRef}
              id="prescription-upload"
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

          {/* Error */}
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
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-teal-700 px-6 py-4 font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Analyzing Prescription...
              </>
            ) : (
              <>✨ Analyze Prescription</>
            )}
          </button>
        </div>

        {/* Analysis Results */}
        {result && (
          <section className="mt-8 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
                  AI Generated Report
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-800">
                  Prescription Analysis
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-xl border border-teal-200 px-4 py-2.5 text-sm font-semibold text-teal-800 transition hover:bg-teal-50"
                >
                  {copied ? "✓ Copied" : "Copy Analysis"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  New Analysis
                </button>
              </div>
            </div>

            <div className="whitespace-pre-wrap break-words p-6 text-sm leading-7 text-slate-700 sm:p-8 sm:text-base">
              {result}
            </div>

            <div className="border-t border-amber-100 bg-amber-50 p-5">
              <p className="text-sm leading-6 text-amber-900">
                <strong>Important:</strong> AI-generated information may
                contain errors. Always confirm medicine names, dosage,
                and instructions with your doctor or pharmacist. Do not
                start, stop, or change medication based only on this analysis.
              </p>
            </div>
          </section>
        )}

        {/* Safety Note */}
        {!result && (
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-sm leading-6 text-amber-900">
              <strong>Medical Safety Notice:</strong> This tool is intended
              to help you understand prescription information. It does not
              replace professional medical advice or a doctor's instructions.
            </p>
          </div>
        )}

        <footer className="mt-8 border-t border-slate-200 py-5 text-center text-xs text-slate-400">
          HealthFlow AI · AI Prescription Reader
        </footer>
      </div>
    </div>
  );
}

export default AIPrescription;
