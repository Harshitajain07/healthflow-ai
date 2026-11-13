
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [userResponse, appointmentResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/auth/stats", config),
        axios.get("http://localhost:5000/api/appointments", config),
      ]);

      const appointments = appointmentResponse.data.success
        ? appointmentResponse.data.appointments || []
        : [];

      const paidAppointments = appointments.filter(
        (appointment) => appointment.paymentStatus === "Paid"
      );

      const totalRevenue = paidAppointments.reduce(
        (total, appointment) =>
          total +
          (appointment.paymentAmount || appointment.fee || 500),
        0
      );

      setStats({
        doctors: userResponse.data.doctors || 0,
        patients: userResponse.data.patients || 0,
        appointments: appointments.length,
        revenue: totalRevenue,
      });
    } catch (err) {
      console.error("Admin Dashboard Error:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      setError("Unable to load dashboard statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "admin") {
      navigate(user.role === "doctor" ? "/doctor" : "/patient", {
        replace: true,
      });
      return;
    }

    fetchStats();
  }, [user, navigate, fetchStats]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const statCards = [
    {
      title: "Total Doctors",
      value: stats.doctors,
      icon: "👨‍⚕️",
      subtitle: "Registered professionals",
      color: "text-teal-700",
      background: "bg-teal-50",
      accent: "bg-teal-600",
    },
    {
      title: "Total Patients",
      value: stats.patients,
      icon: "👥",
      subtitle: "Registered patient accounts",
      color: "text-blue-700",
      background: "bg-blue-50",
      accent: "bg-blue-600",
    },
    {
      title: "Appointments",
      value: stats.appointments,
      icon: "📅",
      subtitle: "Total recorded appointments",
      color: "text-indigo-700",
      background: "bg-indigo-50",
      accent: "bg-indigo-600",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.revenue.toLocaleString("en-IN")}`,
      icon: "💰",
      subtitle: "From paid appointments",
      color: "text-amber-700",
      background: "bg-amber-50",
      accent: "bg-amber-500",
    },
  ];

  const actions = [
    {
      title: "Manage Doctors",
      description:
        "Add new doctors, review professional details and manage doctor accounts.",
      icon: "👨‍⚕️",
      path: "/manage-doctors",
      tag: "MEDICAL TEAM",
      color: "bg-teal-50",
      iconColor: "text-teal-700",
    },
    {
      title: "Manage Patients",
      description:
        "Explore registered patients and manage patient information.",
      icon: "👥",
      path: "/manage-patients",
      tag: "PATIENT RECORDS",
      color: "bg-blue-50",
      iconColor: "text-blue-700",
    },
    {
      title: "Manage Appointments",
      description:
        "Review appointments and monitor their current status.",
      icon: "📅",
      path: "/manage-appointments",
      tag: "SCHEDULING",
      color: "bg-indigo-50",
      iconColor: "text-indigo-700",
    },
  ];

  const navigation = [
    { label: "Dashboard", icon: "▦", path: "/admin" },
    { label: "Manage Doctors", icon: "⚕", path: "/manage-doctors" },
    { label: "Manage Patients", icon: "♧", path: "/manage-patients" },
    { label: "Appointments", icon: "▣", path: "/manage-appointments" },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#0B1023] md:flex">
      {/* Sidebar */}
      <aside className="flex w-full shrink-0 flex-col justify-between bg-gradient-to-b from-[#006B64] to-[#004E49] p-5 text-white md:fixed md:inset-y-0 md:w-64 md:p-6">
        <div>
          {/* Brand */}
          <Link to="/admin" className="mb-9 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-2xl">
              ♡
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                HealthFlow <span className="text-teal-200">AI</span>
              </h1>
              <p className="text-[9px] font-semibold tracking-[2px] text-teal-100">
                INTELLIGENT HEALTHCARE
              </p>
            </div>
          </Link>

          {/* Sidebar heading */}
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[2px] text-teal-200">
            WORKSPACE
          </p>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigation.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 ${
                  index === 0
                    ? "bg-white text-[#006B64] shadow-md"
                    : "text-teal-50 hover:bg-white/15 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}

                {index === 0 && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-[#006B64]" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Admin Profile and Logout */}
        <div className="mt-6 border-t border-white/20 pt-5">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/10 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold text-[#006B64]">
              {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {user?.fullName || "Administrator"}
              </p>
              <p className="text-xs text-teal-100">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 md:ml-64 md:px-10 md:py-9">
        {/* Top Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold tracking-[2px] text-[#006B64]">
              HEALTHFLOW AI / ADMINISTRATION
            </p>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#0B1023] sm:text-3xl">
              Welcome, {user?.fullName || "Administrator"} 👋
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Here's what's happening across your healthcare platform.
            </p>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="rounded-xl border border-[#B8DED8] bg-white px-5 py-3 text-sm font-semibold text-[#006B64] shadow-sm transition hover:bg-[#F0FAF8] disabled:opacity-50"
          >
            {loading ? "↻ Refreshing..." : "↻ Refresh Data"}
          </button>
        </header>

        {/* Welcome Banner */}
        <section className="relative mb-9 overflow-hidden rounded-2xl bg-gradient-to-r from-[#006B64] to-[#00877C] p-6 text-white shadow-lg shadow-teal-900/10 sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-[1.5px] text-teal-50">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              ADMINISTRATOR CONTROL CENTER
            </div>

            <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
              Everything under control.
              <br />
              <span className="text-teal-100">
                One connected experience.
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50">
              Manage your healthcare community, oversee appointments and keep
              your platform running smoothly.
            </p>
          </div>

          <div className="pointer-events-none absolute -right-5 -top-12 text-[180px] opacity-[0.09]">
            🏥
          </div>

          <div className="pointer-events-none absolute -bottom-20 right-28 h-48 w-48 rounded-full border-[25px] border-white/10" />
        </section>

        {/* Statistics */}
        <section className="mb-10">
          <div className="mb-5">
            <p className="mb-1 text-[10px] font-bold tracking-[2px] text-[#006B64]">
              PLATFORM PERFORMANCE
            </p>

            <h2 className="text-xl font-extrabold text-[#0B1023]">
              Dashboard Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Key statistics from your healthcare system.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}

              <button onClick={fetchStats} className="font-bold underline">
                Try again
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-600">
                    {card.title}
                  </p>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.background} text-2xl`}
                  >
                    {card.icon}
                  </div>
                </div>

                <h3
                  className={`mt-5 text-3xl font-extrabold tracking-tight ${card.color}`}
                >
                  {loading ? "..." : card.value}
                </h3>

                <p className="mt-2 text-xs text-slate-500">{card.subtitle}</p>

                <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full w-1/2 rounded-full ${card.accent} transition-all duration-500 group-hover:w-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <div className="mb-5">
            <p className="mb-1 text-[10px] font-bold tracking-[2px] text-[#006B64]">
              QUICK ACCESS
            </p>

            <h2 className="text-xl font-extrabold text-[#0B1023]">
              Manage Your Platform
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a section to continue managing your healthcare system.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {actions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${action.color} text-2xl`}
                  >
                    {action.icon}
                  </div>

                  <span className="rounded-full bg-slate-50 px-3 py-1 text-[9px] font-bold tracking-wider text-slate-500">
                    {action.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0B1023] transition group-hover:text-[#006B64]">
                  {action.title}
                </h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                  {action.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm font-bold text-[#006B64]">
                    Open section
                  </span>

                  <span className="text-lg text-[#006B64] transition-transform duration-200 group-hover:translate-x-2">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} HealthFlow AI. All rights reserved.
          </p>

          <p className="text-xs font-medium text-[#006B64]">
            Intelligent Healthcare Management
          </p>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;

