
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.role !== "doctor") {
        navigate("/login", { replace: true });
        return;
      }

      setUser(parsedUser);
    } catch {
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:5000/api/appointments/stats?doctorId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setStats({
          total: response.data.total || 0,
          pending: response.data.pending || 0,
          approved: response.data.approved || 0,
          rejected: response.data.rejected || 0,
          cancelled: response.data.cancelled || 0,
        });
      }
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load appointment statistics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user, fetchStats]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-700" />
          <p className="font-medium text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Appointments",
      value: stats.total,
      icon: "📅",
      color: "bg-teal-50 text-teal-700",
      description: "All assigned appointments",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: "⏳",
      color: "bg-amber-50 text-amber-700",
      description: "Awaiting your response",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: "✓",
      color: "bg-emerald-50 text-emerald-700",
      description: "Confirmed appointments",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: "✕",
      color: "bg-red-50 text-red-700",
      description: "Rejected requests",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: "↩",
      color: "bg-slate-100 text-slate-600",
      description: "Cancelled appointments",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white px-5 py-5 shadow-sm sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
              HealthFlow AI / Doctor Portal
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-800 sm:text-3xl">
              Doctor Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-xl">
              👨‍⚕️
            </div>
            <div>
              <p className="text-xs text-slate-500">Welcome back</p>
              <p className="font-bold text-slate-800">{user.fullName}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-5 sm:p-8">
        {/* Welcome Banner */}
        <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-teal-800 to-teal-600 p-6 text-white shadow-lg sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-100">
            Your Medical Workspace
          </p>

          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            Welcome, {user.fullName}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-teal-50 sm:text-base">
            Manage your patient appointments, review incoming requests, and
            keep track of your appointment activity from one place.
          </p>

          <Link
            to="/doctor-appointments"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-teal-800 shadow-sm transition hover:bg-teal-50"
          >
            Manage Appointments <span>→</span>
          </Link>
        </section>

        {/* Statistics Heading */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">
              Appointment Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A summary of your patient appointment activity.
            </p>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="w-fit rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-semibold text-teal-800 transition hover:bg-teal-50 disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "↻ Refresh Statistics"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={fetchStats}
              className="ml-2 font-bold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${card.color}`}
                >
                  {card.icon}
                </div>

                <span className="text-3xl font-extrabold text-slate-800">
                  {loading ? "—" : card.value}
                </span>
              </div>

              <h3 className="mt-5 font-bold text-slate-800">
                {card.title}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {card.description}
              </p>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-800">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Access your most frequently used doctor tools.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              to="/doctor-appointments"
              className="group flex items-center gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-teal-300 hover:bg-teal-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-2xl">
                📋
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-slate-800">
                  Manage Appointments
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Review and update patient requests.
                </p>
              </div>

              <span className="text-xl text-teal-700 transition group-hover:translate-x-1">
                →
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-4 rounded-xl border border-red-100 p-5 text-left transition hover:border-red-300 hover:bg-red-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
                ↪
              </div>

              <div>
                <h3 className="font-bold text-slate-800">Logout</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Securely sign out of your account.
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 border-t border-slate-200 py-5 text-center text-xs text-slate-400">
          HealthFlow AI · Doctor Portal
        </footer>
      </main>
    </div>
  );
}

export default DoctorDashboard;
