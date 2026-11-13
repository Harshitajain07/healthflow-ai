

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

const navigationLinks = [
  { label: "Dashboard", path: "/patient", icon: "🏠" },
  { label: "Book Appointment", path: "/book-appointment", icon: "📅" },
  { label: "My Appointments", path: "/my-appointments", icon: "📋" },
  { label: "AI Symptom Checker", path: "/symptom-checker", icon: "🩺" },
  { label: "Prescription Reader", path: "/prescription-reader", icon: "💊" },
  { label: "Report Summarizer", path: "/report-summarizer", icon: "📄" },
  { label: "AI Health Chat", path: "/ai-chat", icon: "🤖" },
  { label: "My Profile", path: "/my-profile", icon: "👤" },
];

function PatientDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [doctors, setDoctors] = useState(0);
  const [appointments, setAppointments] = useState(0);
  const [reports, setReports] = useState(0);

  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check login and patient role.
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user?.id || user.role !== "patient") {
      navigate("/login", { replace: true });
    }
  }, [navigate, user]);

  // Fetch dashboard information.
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user?.id || user.role !== "patient") {
      return;
    }

    let cancelled = false;

    const fetchDashboardData = async () => {
      setLoading(true);
      setDashboardError("");

      // Authentication configuration for protected API requests.
      const authConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const results = await Promise.allSettled([
        // Doctors list — authentication token included.
        axios.get(`${API}/doctors`, authConfig),

        // Patient appointments.
        axios.get(`${API}/appointments`, authConfig),

        // Patient medical reports.
        axios.get(
          `${API}/reports/patient/${user.id}`,
          authConfig
        ),
      ]);

      if (cancelled) return;

      const [doctorResult, appointmentResult, reportResult] = results;
      const failedRequests = [];

      // Doctors.
      if (doctorResult.status === "fulfilled") {
        const data = doctorResult.value.data;

        if (data.success && Array.isArray(data.doctors)) {
          setDoctors(data.doctors.length);
        } else {
          failedRequests.push("doctors");
        }
      } else {
        console.error(
          "Doctors request failed:",
          doctorResult.reason
        );
        failedRequests.push("doctors");
      }

      // Appointments.
      if (appointmentResult.status === "fulfilled") {
        const data = appointmentResult.value.data;

        if (data.success && Array.isArray(data.appointments)) {
          const myAppointments = data.appointments.filter(
            (appointment) => {
              const patientId =
                appointment.patient?._id || appointment.patient;

              return String(patientId) === String(user.id);
            }
          );

          setAppointments(myAppointments.length);
        } else {
          failedRequests.push("appointments");
        }
      } else {
        console.error(
          "Appointments request failed:",
          appointmentResult.reason
        );
        failedRequests.push("appointments");
      }

      // Medical reports.
      if (reportResult.status === "fulfilled") {
        const data = reportResult.value.data;

        if (data.success && Array.isArray(data.reports)) {
          setReports(data.reports.length);
        } else {
          failedRequests.push("reports");
        }
      } else {
        console.error(
          "Reports request failed:",
          reportResult.reason
        );
        failedRequests.push("reports");
      }

      if (!cancelled) {
        if (failedRequests.length > 0) {
          setDashboardError(
            "Some dashboard information could not be loaded. Please refresh the page or try again later."
          );
        }

        setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Logout.
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const firstName =
    user?.fullName?.trim().split(" ")[0] || "Patient";

  const stats = [
    {
      title: "My Appointments",
      value: appointments,
      icon: "📅",
      color: "text-blue-600",
      background: "bg-blue-50",
      description: "Your scheduled appointments",
    },
    {
      title: "Available Doctors",
      value: doctors,
      icon: "👨‍⚕️",
      color: "text-emerald-600",
      background: "bg-emerald-50",
      description: "Doctors listed in the system",
    },
    {
      title: "Medical Reports",
      value: reports,
      icon: "📄",
      color: "text-purple-600",
      background: "bg-purple-50",
      description: "Your uploaded medical reports",
    },
  ];

  const quickActions = [
    {
      title: "Book Appointment",
      description: "Schedule a consultation with a doctor.",
      icon: "📅",
      path: "/book-appointment",
      background: "bg-blue-600",
      hover: "hover:bg-blue-700",
    },
    {
      title: "My Appointments",
      description: "View and manage your appointments.",
      icon: "📋",
      path: "/my-appointments",
      background: "bg-emerald-600",
      hover: "hover:bg-emerald-700",
    },
    {
      title: "AI Symptom Checker",
      description: "Explore AI-powered health guidance.",
      icon: "🩺",
      path: "/symptom-checker",
      background: "bg-violet-600",
      hover: "hover:bg-violet-700",
    },
  ];

  const aiServices = [
    {
      title: "Prescription Reader",
      description:
        "Upload prescriptions and explore AI-generated explanations.",
      icon: "💊",
      path: "/prescription-reader",
    },
    {
      title: "Medical Report Summarizer",
      description:
        "Understand medical reports with AI-powered summaries.",
      icon: "📄",
      path: "/report-summarizer",
    },
    {
      title: "AI Health Chat",
      description:
        "Ask general health questions using your AI assistant.",
      icon: "🤖",
      path: "/ai-chat",
    },
  ];

  if (
    !user ||
    user.role !== "patient" ||
    !localStorage.getItem("token")
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:hidden">
        <Link
          to="/patient"
          className="text-xl font-bold text-slate-900"
        >
          HealthFlow <span className="text-teal-600">AI</span>
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen((previous) => !previous)
          }
          aria-label={
            mobileMenuOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={mobileMenuOpen}
          className="rounded-lg bg-slate-100 px-3 py-2 text-xl"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } fixed inset-x-0 top-[65px] z-30 max-h-[calc(100vh-65px)] overflow-y-auto border-b border-slate-200 bg-white md:sticky md:top-0 md:block md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r`}
      >
        <div className="hidden border-b border-slate-100 p-6 md:block">
          <Link to="/patient">
            <h1 className="text-2xl font-bold text-slate-900">
              HealthFlow <span className="text-teal-600">AI</span>
            </h1>
          </Link>
          <p className="mt-1 text-sm text-slate-500">
            Patient Portal
          </p>
        </div>

        <div className="border-b border-slate-100 px-5 py-4 md:hidden">
          <p className="font-semibold text-slate-800">
            {user.fullName}
          </p>
          <p className="text-sm text-slate-500">
            {user.email}
          </p>
        </div>

        <nav className="space-y-1 p-4">
          {navigationLinks.map((item) => {
            const active = item.path === "/patient";

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-teal-700"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4 md:mt-6">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-10">
        {/* Welcome Header */}
        <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-teal-600">
              PATIENT DASHBOARD
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back, {firstName} 👋
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {currentDate}
            </p>
          </div>

          <Link
            to="/my-profile"
            className="flex items-center gap-3 self-start rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md sm:self-auto"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-lg font-bold text-white">
              {user.fullName?.charAt(0).toUpperCase() || "P"}
            </div>

            <div className="max-w-[190px]">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user.fullName}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user.email}
              </p>
            </div>

            <span className="text-slate-400">→</span>
          </Link>
        </section>

        {/* Dashboard Error */}
        {dashboardError && (
          <div
            role="alert"
            className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
          >
            ⚠️ {dashboardError}
          </div>
        )}

        {/* Statistics */}
        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">
              Your Overview
            </h3>

            {loading && (
              <span className="text-xs text-slate-400">
                Updating information...
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>

                    <h3 className={`mt-3 text-4xl font-bold ${stat.color}`}>
                      {loading ? "—" : stat.value}
                    </h3>

                    <p className="mt-2 text-xs text-slate-400">
                      {stat.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${stat.background}`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <h3 className="text-xl font-bold text-slate-900">
            Quick Actions
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Access your most frequently used services.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className={`group rounded-2xl p-6 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${action.background} ${action.hover}`}
              >
                <span className="text-4xl">
                  {action.icon}
                </span>

                <h4 className="mt-5 text-lg font-bold">
                  {action.title}
                </h4>

                <p className="mt-2 text-sm text-white/80">
                  {action.description}
                </p>

                <p className="mt-5 text-sm font-semibold">
                  Explore service{" "}
                  <span className="inline-block transition group-hover:translate-x-1">
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* AI Services */}
        <section className="mt-10">
          <h3 className="text-xl font-bold text-slate-900">
            AI Health Services
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Explore the AI tools available in your healthcare portal.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {aiServices.map((service) => (
              <Link
                key={service.path}
                to={service.path}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl">
                  {service.icon}
                </div>

                <h4 className="mt-5 font-bold text-slate-800 transition group-hover:text-teal-700">
                  {service.title}
                </h4>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {service.description}
                </p>

                <p className="mt-5 text-sm font-semibold text-teal-700">
                  Open tool →
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Health Tip */}
        <section className="mt-10 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-teal-800 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl">
              💡
            </div>

            <div>
              <h3 className="text-xl font-bold">
                A Healthy Reminder
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-teal-50">
                Stay hydrated, eat a balanced diet, remain physically active,
                and make time for proper sleep. Small healthy habits can make
                a meaningful difference.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-200 py-5 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} HealthFlow AI. Your healthcare companion.
        </footer>
      </main>
    </div>
  );
}

export default PatientDashboard;

