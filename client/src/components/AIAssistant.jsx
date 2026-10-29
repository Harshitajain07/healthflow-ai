
import { useNavigate } from "react-router-dom";

const aiFeatures = [
  {
    number: "01",
    title: "AI Symptom Checker",
    description:
      "Explore possible explanations for symptoms and learn when to seek medical care.",
    icon: "✳",
  },
  {
    number: "02",
    title: "Medicine Information",
    description:
      "Get AI-assisted explanations about medicines and their common uses.",
    icon: "✚",
  },
  {
    number: "03",
    title: "Medical Report Summarizer",
    description:
      "Turn complex medical reports into clearer, easier-to-understand summaries.",
    icon: "▤",
  },
  {
    number: "04",
    title: "AI Health Chat",
    description:
      "Ask health-related questions and explore general health information.",
    icon: "↗",
  },
];

function AIAssistant() {
  const navigate = useNavigate();

  const handleExploreAI = () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    navigate("/ai-chat");
  };

  return (
    <section
      id="ai-assistant"
      className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              Intelligent healthcare
            </div>

            <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Healthcare, made
              <span className="block text-teal-700">
                easier with AI.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Explore AI-assisted tools designed to help you understand
              symptoms, medical documents, medicines, and general health
              information — all in one place.
            </p>

            <button
              type="button"
              onClick={handleExploreAI}
              className="mt-8 inline-flex items-center justify-center gap-3 rounded-xl bg-teal-800 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            >
              Explore AI Tools
              <span aria-hidden="true">→</span>
            </button>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              AI-generated information is for informational purposes and
              does not replace professional medical advice.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {aiFeatures.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-xl font-semibold text-teal-800 transition group-hover:bg-teal-100">
                    {feature.icon}
                  </span>

                  <span className="text-sm font-semibold tracking-wider text-slate-400">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIAssistant;
