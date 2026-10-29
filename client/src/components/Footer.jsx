
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      id="footer"
      className="mt-20 border-t border-slate-200 bg-slate-950 text-white"
    >
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3"
              aria-label="HealthFlow AI home"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-800 text-white">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  className="h-7 w-7"
                  aria-hidden="true"
                >
                  <path
                    d="M16 27S5 21 5 12a6 6 0 0 1 11-3 6 6 0 0 1 11 3c0 9-11 15-11 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 16h4l2-4 3 8 2-4h3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span className="text-xl font-bold tracking-tight">
                HealthFlow <span className="text-teal-300">AI</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              A connected healthcare experience for appointments, medical
              documents, and AI-assisted health information.
            </p>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Built as a full-stack healthcare technology project.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h2 className="text-sm font-semibold text-white">Explore</h2>

            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  to="/"
                  className="transition hover:text-teal-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/#features"
                  className="transition hover:text-teal-300"
                >
                  Services and AI tools
                </Link>
              </li>
              <li>
                <Link
                  to="/#doctors"
                  className="transition hover:text-teal-300"
                >
                  Doctors
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="transition hover:text-teal-300"
                >
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h2 className="text-sm font-semibold text-white">
              About HealthFlow AI
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Designed to bring everyday healthcare workflows together in
              one accessible web application.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              Full-stack healthcare platform
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="mx-auto max-w-3xl text-center text-xs leading-6 text-slate-400">
            HealthFlow AI provides AI-generated information for informational
            support only. It is not a substitute for diagnosis, treatment, or
            advice from a qualified healthcare professional. For emergencies,
            contact local emergency services.
          </p>

          <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
            <p>
              © {new Date().getFullYear()} HealthFlow AI. All rights reserved.
            </p>
            <Link
              to="/"
              className="transition hover:text-teal-300"
            >
              Back to top ↑
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
