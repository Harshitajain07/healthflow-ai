
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";

function Hero() {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    if (user.role === "patient") {
      navigate("/book-appointment");
    } else if (user.role === "doctor") {
      navigate("/doctor");
    } else if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  const handleTalkToAI = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    navigate("/ai-chat");
  };

  return (
    
      <section className="relative mx-auto w-full max-w-7xl overflow-hidden px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">

      <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-80 w-80 rounded-full bg-teal-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* Main message */}
        <div className="max-w-2xl">
          <p className="mb-6 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-teal-800">
            <span className="h-2 w-2 rounded-full bg-teal-600" />
            HEALTHCARE, THOUGHTFULLY CONNECTED
          </p>

          <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Your health deserves
            <span className="mt-1 block text-teal-700">
              a smarter approach.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Manage appointments, understand medical reports, and explore
            AI-powered health tools in one convenient place. HealthFlow AI
            brings your healthcare journey together.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleBookAppointment}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-teal-800 px-7 py-4 font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-900 focus:outline-none focus:ring-4 focus:ring-teal-200"
            >
              Book an appointment
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
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

            <button
              type="button"
              onClick={handleTalkToAI}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-4 font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-teal-600 hover:text-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-teal-700"
              >
                <path
                  d="m12 3 2.1 6.1L20 11l-5.9 2.1L12 19l-2.1-5.9L4 11l5.9-1.9L12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
              Explore AI assistant
            </button>
          </div>

          {/* Simple benefits row */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-slate-200 pt-5 sm:gap-x-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="m5 12 4 4L19 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-slate-700">
                Easy appointment booking
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="m12 3 2.1 6.1L20 11l-5.9 2.1L12 19l-2.1-5.9L4 11l5.9-1.9L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-slate-700">
                AI health tools
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M12 21s7-3.5 7-9V5l-7-3-7 3v7c0 5.5 7 9 7 9Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-slate-700">
                Secure health records
              </span>
            </div>
          </div>
        </div>

        {/* Main healthcare image */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl shadow-slate-900/10 sm:rounded-3xl sm:p-3">
            <img
              src={heroImage}
              alt="Healthcare professionals in a clinical setting"
              className="aspect-[5/4] w-full rounded-xl object-cover sm:rounded-2xl"
            />

            <div className="flex items-start gap-3 px-3 py-4 sm:px-4 sm:py-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                >
                  <path
                    d="M12 21s7-3.5 7-9V5l-7-3-7 3v7c0 5.5 7 9 7 9Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m9 12 2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Care, all in one place
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Keep appointments and medical information organized, with
                  AI tools to help you understand your health documents.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-slate-500">
            AI-generated health information is supportive and does not replace
            professional medical advice.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
