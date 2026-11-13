
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function DoctorAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        navigate("/login", { replace: true });
        return;
      }

      const user = JSON.parse(savedUser);

      if (user.role !== "doctor") {
        navigate("/login", { replace: true });
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const allAppointments = response.data.appointments || [];

      const doctorAppointments = allAppointments.filter(
        (appointment) =>
          String(appointment.doctor?._id) === String(user.id)
      );

      setAppointments(doctorAppointments);
    } catch (err) {
      console.error("Failed to load appointments:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load appointments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/appointments/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchAppointments();
      alert(response.data.message || "Appointment status updated.");
    } catch (err) {
      console.error("Status update error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to update appointment status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "Cancelled":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-50 p-5 sm:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
              HealthFlow AI / Doctor Portal
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-slate-800">
              Doctor Appointments
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Review patient requests and manage appointment statuses.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/doctor"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              ← Dashboard
            </Link>

            <button
              onClick={fetchAppointments}
              disabled={loading}
              className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Appointments</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-800">
              {appointments.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Pending Requests</p>
            <h2 className="mt-2 text-3xl font-extrabold text-amber-600">
              {appointments.filter((a) => a.status === "Pending").length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Approved Appointments</p>
            <h2 className="mt-2 text-3xl font-extrabold text-emerald-600">
              {appointments.filter((a) => a.status === "Approved").length}
            </h2>
          </div>
        </div>

        {/* Appointment Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <h2 className="text-xl font-bold text-slate-800">
              Patient Appointment Records
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review each request and choose the appropriate action.
            </p>
          </div>

          {error && (
            <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
              <button
                onClick={fetchAppointments}
                className="ml-2 font-bold underline"
              >
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <div className="p-16 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-700" />
              <p className="text-sm font-medium text-slate-500">
                Loading patient appointments...
              </p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-16 text-center">
              <div className="mb-4 text-5xl">📅</div>
              <h3 className="text-lg font-bold text-slate-700">
                No appointments found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Patient appointment requests will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Patient</th>
                    <th className="px-5 py-4">Doctor</th>
                    <th className="px-5 py-4">Date & Time</th>
                    <th className="px-5 py-4">Reason</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {appointments.map((appointment) => (
                    <tr
                      key={appointment._id}
                      className="transition hover:bg-teal-50/40"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {appointment.patient?.fullName || "Unknown"}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Patient
                        </p>
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-700">
                        {appointment.doctor?.fullName || "Unknown"}
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
                          title={appointment.reason}
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
                        <div className="flex flex-wrap gap-2">
                          {appointment.status === "Pending" && (
                            <>
                              <button
                                disabled={updatingId === appointment._id}
                                onClick={() =>
                                  handleStatusChange(
                                    appointment._id,
                                    "Approved"
                                  )
                                }
                                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                              >
                                Approve
                              </button>

                              <button
                                disabled={updatingId === appointment._id}
                                onClick={() =>
                                  handleStatusChange(
                                    appointment._id,
                                    "Rejected"
                                  )
                                }
                                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {appointment.status === "Approved" && (
                            <button
                              disabled={updatingId === appointment._id}
                              onClick={() =>
                                handleStatusChange(
                                  appointment._id,
                                  "Cancelled"
                                )
                              }
                              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}

                          {appointment.status === "Rejected" && (
                            <button
                              disabled={updatingId === appointment._id}
                              onClick={() =>
                                handleStatusChange(
                                  appointment._id,
                                  "Approved"
                                )
                              }
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                              Approve Again
                            </button>
                          )}

                          {appointment.status === "Cancelled" && (
                            <button
                              disabled={updatingId === appointment._id}
                              onClick={() =>
                                handleStatusChange(
                                  appointment._id,
                                  "Pending"
                                )
                              }
                              className="rounded-lg bg-teal-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-teal-800 disabled:opacity-50"
                            >
                              Restore
                            </button>
                          )}

                          {updatingId === appointment._id && (
                            <span className="self-center text-xs text-slate-500">
                              Updating...
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
            <p className="text-xs text-slate-500">
              HealthFlow AI · Doctor Appointment Management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorAppointments;
