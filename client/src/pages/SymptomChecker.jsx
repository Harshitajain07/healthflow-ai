
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const examples = [
    "I have a headache and mild fever.",
    "I have been experiencing a cough and sore throat.",
    "I feel tired and have body aches.",
    "I have stomach pain and nausea.",
  ];

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      setError("Please describe your symptoms first.");
      return;
    }

    if (symptoms.trim().length < 5) {
      setError("Please provide more details about your symptoms.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/ai/symptoms",
        { symptoms: symptoms.trim() },
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      if (!response.data?.result) {
        throw new Error("No analysis was returned. Please try again.");
      }

      setResult(response.data.result);
    } catch (err) {
      console.error("Symptom analysis error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "AI analysis failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms("");
    setResult("");
    setError("");
  };

  // Remove escaped Markdown characters if the AI returns them.
  const formattedResult = result.replace(
    /\\([*`_#[\]()])/g,
    "$1"
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
            HealthFlow AI / AI Healthcare Tools
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-800 sm:text-4xl">
            AI Symptom Checker
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Describe how you are feeling and let AI provide general
            health information to help you understand your symptoms.
          </p>
        </div>

        {/* Symptom Input Card */}
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-3xl">
              🤖
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Describe Your Symptoms
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Include when they started and how you feel.
              </p>
            </div>
          </div>

          <textarea
            rows={6}
            maxLength={2000}
            placeholder="For example: I have had a headache since yesterday, along with mild fever and tiredness..."
            value={symptoms}
            onChange={(e) => {
              setSymptoms(e.target.value);
              setError("");
              setResult("");
            }}
            disabled={loading}
            className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50 disabled:opacity-60"
          />

          <div className="mt-2 flex justify-end">
            <span className="text-xs text-slate-400">
              {symptoms.length}/2000 characters
            </span>
          </div>

          {/* Example Symptoms */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Need help getting started? Try an example:
            </p>

            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setSymptoms(example);
                    setError("");
                    setResult("");
                  }}
                  className="rounded-xl border border-teal-100 bg-teal-50 px-3 py-2 text-left text-xs font-medium text-teal-800 transition hover:border-teal-300 hover:bg-teal-100 disabled:opacity-50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={analyzeSymptoms}
              disabled={loading || !symptoms.trim()}
              className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-teal-700 px-6 py-4 font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Analyzing Symptoms...
                </>
              ) : (
                <>✨ Analyze Symptoms</>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </section>

        {/* AI Results */}
        {result && (
          <section className="mt-8 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
                AI Generated Response
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-slate-800">
                Symptom Analysis
              </h2>
            </div>

            <div className="p-6 sm:p-8">
              <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-5 sm:p-7">

                <div className="mb-5 flex items-center gap-3">
                  <span className="text-2xl">🤖</span>
                  <h3 className="font-bold text-teal-900">
                    AI Health Insights
                  </h3>
                </div>

                {/* Properly formatted Markdown */}
                <div className="break-words text-sm leading-7 text-slate-700 sm:text-base">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="mb-4 mt-6 text-2xl font-bold text-slate-800">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="mb-3 mt-6 text-xl font-bold text-slate-800">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="mb-2 mt-5 text-lg font-bold text-teal-800">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-4 list-disc space-y-2 pl-6">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-4 list-decimal space-y-2 pl-6">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="pl-1">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold text-slate-800">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                      hr: () => (
                        <hr className="my-5 border-slate-200" />
                      ),
                    }}
                  >
                    {formattedResult}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="border-t border-amber-100 bg-amber-50 p-5">
              <p className="text-sm leading-6 text-amber-900">
                <strong>Medical Safety Notice:</strong> This AI-generated
                analysis is for general information only. It cannot
                diagnose a condition or replace professional medical
                evaluation. Please discuss your symptoms with a qualified
                healthcare professional.
              </p>
            </div>
          </section>
        )}

        {/* Emergency Warning */}
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <span className="text-xl">🚨</span>

            <div>
              <h3 className="font-bold text-red-800">
                Emergency Warning
              </h3>

              <p className="mt-1 text-sm leading-6 text-red-700">
                If you experience chest pain, severe breathing difficulty,
                signs of a stroke, sudden severe headache, loss of
                consciousness, or another potentially life-threatening
                symptom, seek emergency medical help immediately. Do not
                wait for an AI response.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 border-t border-slate-200 py-5 text-center text-xs text-slate-400">
          HealthFlow AI · AI Symptom Checker
        </footer>

      </div>
    </div>
  );
}

export default SymptomChecker;

