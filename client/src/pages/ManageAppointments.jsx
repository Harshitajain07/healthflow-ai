
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/appointments";

const FILTERS = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
  "Cancelled",
  "Paid",
  "Unpaid",
];

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return (
      <Navigate
        to={user.role === "doctor" ? "/doctor" : "/patient"}
        replace
      />
    );
  }

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        API_URL,
        getAuthConfig()
      );

      setAppointments(response.data.appointments || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Fetch Appointments Error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("You are not authorized to view these appointments.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load appointments. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Counts for filters
  const getCount = (filter) => {
    switch (filter) {
      case "Pending":
      case "Approved":
      case "Rejected":
      case "Cancelled":
        return appointments.filter(
          (appointment) => appointment.status === filter
        ).length;

      case "Paid":
        return appointments.filter(
          (appointment) => appointment.paymentStatus === "Paid"
        ).length;

      case "Unpaid":
        return appointments.filter(
          (appointment) => appointment.paymentStatus !== "Paid"
        ).length;

      default:
        return appointments.length;
    }
  };

  // Filter and search appointments
  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    if (selectedFilter === "Paid") {
      result = result.filter(
        (appointment) => appointment.paymentStatus === "Paid"
      );
    } else if (selectedFilter === "Unpaid") {
      result = result.filter(
        (appointment) => appointment.paymentStatus !== "Paid"
      );
    } else if (selectedFilter !== "All") {
      result = result.filter(
        (appointment) => appointment.status === selectedFilter
      );
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((appointment) => {
        const searchableValues = [
          appointment.patient?.fullName,
          appointment.patient?.email,
          appointment.doctor?.fullName,
          appointment.doctor?.email,
          appointment.reason,
          appointment.status,
          appointment.paymentStatus,
          appointment.appointmentTime,
        ];

        return searchableValues.some((value) =>
          String(value || "").toLowerCase().includes(query)
        );
      });
    }

    return result;
  }, [appointments, selectedFilter, search]);

  // Status colors
  const statusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "Rejected":
        return "border-red-200 bg-red-50 text-red-700";
      case "Cancelled":
        return "border-slate-200 bg-slate-100 text-slate-600";
      default:
        return "border-amber-200 bg-amber-50 text-amber-700";
    }
  };

  // Payment colors
  const paymentStyle = (status) => {
    switch (status) {
      case "Paid":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "Failed":
        return "border-red-200 bg-red-50 text-red-700";
      default:
        return "border-amber-200 bg-amber-50 text-amber-700";
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Not scheduled";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Paid revenue only
  const totalPaid = appointments
    .filter((appointment) => appointment.paymentStatus === "Paid")
    .reduce(
      (total, appointment) =>
        total +
        Number(appointment.paymentAmount || appointment.fee || 500),
      0
    );

  const statCards = [
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: "📅",
      color: "bg-teal-50 text-teal-700",
    },
    {
      title: "Pending Requests",
      value: getCount("Pending"),
      icon: "⏳",
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Approved",
      value: getCount("Approved"),
      icon: "✓",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Paid Revenue",
      value: `₹${totalPaid.toLocaleString("en-IN")}`,
      icon: "₹",
      color: "bg-indigo-50 text-indigo-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAF9] px-4 py-7 text-[#0B1023] sm:px-7 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-[10px] font-bold tracking-[2px] text-[#006B64]">
              ADMINISTRATION / APPOINTMENTS
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Appointment Management
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Monitor patient bookings, doctor decisions and payment activity.
            </p>
          </div>

          <button
            onClick={fetchAppointments}
            disabled={loading}
            className="rounded-xl bg-[#006B64] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#00564F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "↻ Refresh Data"}
          </button>
        </div>

        {/* Welcome Banner */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#006B64] to-[#00877C] p-6 text-white shadow-lg shadow-teal-900/10 sm:p-8">
          <div className="relative z-10">
            <p className="text-[10px] font-bold tracking-[2px] text-teal-100">
              ADMINISTRATION OVERVIEW
            </p>

            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
              Appointment Activity
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-50">
              Keep track of appointment requests, doctor decisions and
              patient payment activity from one central workspace.
            </p>

            <div className="mt-5 inline-flex rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold">
              {appointments.length} total appointment records
            </div>
          </div>

          <div className="pointer-events-none absolute -right-5 -top-10 text-[150px] opacity-10">
            📅
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>

            <button
              onClick={fetchAppointments}
              disabled={loading}
              className="font-bold underline disabled:opacity-50"
            >
              Try again
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <h3 className="mt-3 text-2xl font-extrabold text-[#0B1023]">
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${card.color}`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-[#0B1023]">
              Filter Appointments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a category to view specific appointment records.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  selectedFilter === filter
                    ? "border-[#006B64] bg-[#006B64] text-white shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
                }`}
              >
                {filter}
                <span className="ml-2 opacity-80">
                  {getCount(filter)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Appointment Directory */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#0B1023]">
                Appointment Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredAppointments.length} of {appointments.length} appointments
              </p>

              {lastUpdated && (
                <p className="mt-1 text-xs text-slate-400">
                  Last updated: {lastUpdated.toLocaleTimeString("en-IN")}
                </p>
              )}
            </div>

            <div className="w-full sm:max-w-sm">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient, doctor, reason..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-[#006B64]" />

              <p className="font-medium text-slate-500">
                Loading appointment records...
              </p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-16 text-center">
              <div className="mb-4 text-5xl">📅</div>

              <h3 className="text-lg font-bold text-slate-700">
                No appointments found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing the selected filter or search term.
              </p>

              {(search || selectedFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedFilter("All");
                  }}
                  className="mt-4 text-sm font-bold text-[#006B64] underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-[#F1F8F6] text-xs uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-bold">Patient</th>
                    <th className="px-5 py-4 font-bold">Doctor</th>
                    <th className="px-5 py-4 font-bold">Date & Time</th>
                    <th className="px-5 py-4 font-bold">Reason</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 font-bold">Payment</th>
                    <th className="px-5 py-4 font-bold">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment._id}
                      className="transition hover:bg-[#F8FCFB]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {appointment.patient?.fullName || "Unknown"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {appointment.patient?.email || "Patient"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-700">
                          {appointment.doctor?.fullName || "Unknown"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {appointment.doctor?.email || "Assigned doctor"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-700">
                          {formatDate(appointment.appointmentDate)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {appointment.appointmentTime || "Time not set"}
                        </p>
                      </td>

                      <td className="max-w-xs px-5 py-4">
                        <p
                          className="truncate text-sm text-slate-600"
                          title={appointment.reason || ""}
                        >
                          {appointment.reason || "Not provided"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${statusStyle(appointment.status)}`}
                        >
                          {appointment.status || "Pending"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${paymentStyle(appointment.paymentStatus)}`}
                        >
                          {appointment.paymentStatus || "Unpaid"}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-bold text-slate-800">
                        ₹
                        {Number(
                          appointment.paymentAmount ||
                            appointment.fee ||
                            500
                        ).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-slate-100 bg-[#FBFDFC] px-5 py-4">
            <p className="text-xs text-slate-500">
              HealthFlow AI · Appointment Administration
            </p>
          </div>
        </div>

        <footer className="mt-8 border-t border-slate-200 py-5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} HealthFlow AI · Intelligent Healthcare Management
        </footer>
      </div>
    </div>
  );
}

export default ManageAppointments;

