
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(user && token);

  const dashboardPath = {
    patient: "/patient",
    doctor: "/doctor",
    admin: "/admin",
  };

  const handleAccount = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    navigate(dashboardPath[user.role] || "/login");
    setMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/#doctors" },
    { label: "Services", href: "/#features" },
    { label: "Contact", href: "/#footer" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <nav
        className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex shrink-0 items-center gap-3"
          aria-label="HealthFlow AI home"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-800 text-white shadow-sm">
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

          <span className="leading-tight">
            <span className="block text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
              HealthFlow <span className="text-teal-700">AI</span>
            </span>
            <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.17em] text-slate-500 sm:block">
              Intelligent healthcare
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-800"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Account action */}
        <div className="hidden md:block">
          <button
            type="button"
            onClick={handleAccount}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-900 focus:outline-none focus:ring-4 focus:ring-teal-100"
          >
            {isLoggedIn ? "My dashboard" : "Sign in"}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
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
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="absolute inset-x-0 top-full border-b border-slate-200 bg-white p-5 shadow-xl md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-teal-50 hover:text-teal-800"
                >
                  {item.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={handleAccount}
                className="mt-2 rounded-xl bg-teal-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-900"
              >
                {isLoggedIn ? "My dashboard" : "Sign in"}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
