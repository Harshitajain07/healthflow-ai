
import { useNavigate } from "react-router-dom";

const features = [
  {
    number: "01",
    title: "Seamless appointments",
    description:
      "Find your way to better-organized care with a simple appointment booking and tracking experience.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <rect
          x="3.5"
          y="5"
          width="17"
          height="16"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M7.5 3v4M16.5 3v4M3.5 10h17M8 14h3M8 17h6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
    label: "APPOINTMENT MANAGEMENT",
    action: "Book an appointment",
    destination: "/book-appointment",
  },
  {
    number: "02",
    title: "AI health companion",
    description:
      "Explore AI-powered health conversations and get help understanding general health information.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path
          d="m12 3 2.1 6.1L20 11l-5.9 2.1L12 19l-2.1-5.9L4 11l5.9-1.9L12 3Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "AI-POWERED ASSISTANCE",
    action: "Explore AI assistant",
    destination: "/ai-chat",
  },
  {
    number: "03",
    title: "Medical documents",
    description:
      "Keep medical information organized and use AI tools to help interpret uploaded reports and prescriptions.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path
          d="M7 3.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5a1.5 1.5 0 0 1 1-1.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M14 3.5V9h5M9 13h6M9 16.5h6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
    label: "DOCUMENT WORKSPACE",
    action: "Explore medical tools",
    destination: "/medical-report",
  },
];

function Features() {
  const navigate = useNavigate();

  const handleFeatureClick = (destination) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    if (destination === "/book-appointment") {
      if (user.role === "patient") {
        navigate(destination);
      } else if (user.role === "doctor") {
        navigate("/doctor");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/login");
      }
      return;
    }

    navigate(destination);
  };

  return (
    <section
      id="features"
      className="scroll-mt-24 border-t border-slate-100 bg-slate-50/70 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800 sm:text-sm">
            One connected experience
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Healthcare, made
            <span className="text-teal-700"> more manageable.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Thoughtful tools to help you manage appointments, explore AI
            assistance, and make sense of your medical documents.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/5 sm:p-8"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-800 transition duration-300 group-hover:bg-teal-800 group-hover:text-white">
                  {feature.icon}
                </div>

                <span className="text-sm font-semibold tracking-wider text-slate-300">
                  {feature.number}
                </span>
              </div>

              <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.16em] text-teal-800 sm:text-xs">
                {feature.label}
              </p>

              <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {feature.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600 sm:text-base">
                {feature.description}
              </p>

              <button
                type="button"
                onClick={() => handleFeatureClick(feature.destination)}
                className="mt-7 inline-flex w-fit items-center gap-2 border-b border-transparent pb-1 text-sm font-semibold text-teal-800 transition hover:border-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-4"
              >
                {feature.action}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-6 text-slate-500">
          AI-generated health information is for informational support and is
          not a substitute for professional medical advice.
        </p>
      </div>
    </section>
  );
}

export default Features;
