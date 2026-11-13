
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

function MyAppointments() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [actionLoading, setActionLoading] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Load logged-in user.
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!savedUser || !token) {
        navigate("/login", { replace: true });
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.role !== "patient") {
        navigate("/login", { replace: true });
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("User loading error:", error);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Fetch appointments belonging to the logged-in patient.
  const fetchAppointments = useCallback(async (showRefresh = false) => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login", { replace: true });
      return;
    }

    let currentUser;

    try {
      currentUser = JSON.parse(savedUser);
    } catch {
      navigate("/login", { replace: true });
      return;
    }

    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setMessage("");

    try {
      const response = await axios.get(`${API}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const userId = currentUser.id || currentUser._id;

        const allAppointments = response.data.appointments || [];

        const myAppointments = allAppointments.filter((appointment) => {
          const patientId =
            appointment.patient?._id || appointment.patient;

          return String(patientId) === String(userId);
        });

        setAppointments(myAppointments);
      } else {
        setMessage("Unable to retrieve your appointments.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Appointment Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load appointments. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (user?.id || user?._id) {
      fetchAppointments();
    }
  }, [user, fetchAppointments]);

  // Refresh appointments.
  const handleRefresh = () => {
    fetchAppointments(true);
  };

  // Cancel appointment.
  const handleCancel = async (appointmentId) => {
    const appointment = appointments.find(
      (item) => item._id === appointmentId
    );

    if (!appointment) return;

    if (!["Pending", "Approved"].includes(appointment.status)) {
      setMessage("This appointment cannot be cancelled.");
      setMessageType("info");
      return;
    }

    const confirmCancel = window.confirm(
      appointment.paymentStatus === "Paid"
        ? "This appointment has already been paid. Do you want to cancel it? Your payment will not be automatically refunded."
        : "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    setActionLoading(appointmentId);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API}/appointments/cancel/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAppointments((previous) =>
          previous.map((item) =>
            item._id === appointmentId
              ? { ...item, status: "Cancelled" }
              : item
          )
        );

        setMessage("Appointment cancelled successfully.");
        setMessageType("success");
      }
    } catch (error) {
      console.error("Cancel Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to cancel appointment."
      );
      setMessageType("error");
    } finally {
      setActionLoading("");
    }
  };

  // Pay appointment.
  const handlePayment = async (appointmentId) => {
    const appointment = appointments.find(
      (item) => item._id === appointmentId
    );

    if (
      !appointment ||
      appointment.status !== "Approved" ||
      appointment.paymentStatus === "Paid"
    ) {
      return;
    }

    setActionLoading(appointmentId);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API}/appointments/pay/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAppointments((previous) =>
          previous.map((item) =>
            item._id === appointmentId
              ? {
                  ...item,
                  paymentStatus: "Paid",
                  paymentAmount:
                    response.data.appointment?.paymentAmount ||
                    item.fee ||
                    500,
                }
              : item
          )
        );

        setMessage("Payment successful!");
        setMessageType("success");
      }
    } catch (error) {
      console.error("Payment Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Payment failed. Please try again."
      );
      setMessageType("error");
    } finally {
      setActionLoading("");
    }
  };

  // Appointment statistics.
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(
    (item) => item.status === "Pending"
  ).length;
  const approvedAppointments = appointments.filter(
    (item) => item.status === "Approved"
  ).length;
  const paidAppointments = appointments.filter(
    (item) => item.paymentStatus === "Paid"
  ).length;

  // Status badge styling.
  const getStatusStyle = (status) => {
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

  const getPaymentStyle = (status) => {
    if (status === "Paid") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "Failed") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  // Loading screen.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
          <p className="mt-4 font-medium text-slate-600">
            Loading your appointments...
          </p>
        </div>
      </div>
    );
  }

  // Login check.
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-slate-800">
            Please login first
          </h2>

          <Link
            to="/login"
            className="mt-5 inline-block rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white hover:bg-teal-800"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold tracking-widest text-teal-700">
              HEALTHFLOW AI / PATIENT PORTAL
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              My Appointments
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View your consultations, appointment status and payments.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-xl border border-teal-200 bg-white px-5 py-3 text-sm font-semibold text-teal-800 shadow-sm transition hover:bg-teal-50 disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "↻ Refresh"}
            </button>

            <Link
              to="/book-appointment"
              className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
            >
              + Book Appointment
            </Link>
          </div>
        </section>

        {/* Welcome Banner */}
        <section className="mt-7 overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900 to-teal-600 p-6 text-white shadow-lg sm:p-8">
          <p className="text-sm font-medium text-teal-100">
            YOUR HEALTHCARE AT A GLANCE
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Hello, {user.fullName?.trim().split(" ")[0] || "Patient"}!
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-teal-50">
            Keep track of your appointments and stay informed about your
            upcoming consultations with HealthFlow AI.
          </p>
        </section>

        {/* Feedback Message */}
        {message && (
          <div
            role="status"
            className={`mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm font-medium ${
              messageType === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : messageType === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-blue-200 bg-blue-50 text-blue-800"
            }`}
          >
            <span>
              {messageType === "success"
                ? "✓"
                : messageType === "error"
                ? "⚠"
                : "ℹ"}
            </span>
            <p>{message}</p>
            <button
              onClick={() => setMessage("")}
              className="ml-auto font-bold"
              aria-label="Dismiss message"
            >
              ✕
            </button>
          </div>
        )}

        {/* Statistics */}
        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Appointment Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick summary of your healthcare activity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Total Appointments",
                value: totalAppointments,
                icon: "📅",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                label: "Pending",
                value: pendingAppointments,
                icon: "⏳",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                label: "Approved",
                value: approvedAppointments,
                icon: "✓",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                label: "Payments Completed",
                value: paidAppointments,
                icon: "💳",
                color: "text-violet-600",
                bg: "bg-violet-50",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${stat.bg}`}
                  >
                    {stat.icon}
                  </div>
                </div>

                <p className={`mt-4 text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Appointment Cards */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Your Appointment Records
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review the details and manage your appointments.
              </p>
            </div>

            <span className="w-fit rounded-full bg-teal-50 px-4 py-2 text-xs font-bold text-teal-800">
              {totalAppointments} {totalAppointments === 1 ? "Record" : "Records"}
            </span>
          </div>

          {appointments.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-teal-50 text-4xl">
                📅
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No Appointments Found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                You haven't booked an appointment yet. Schedule a consultation
                to get started.
              </p>

              <Link
                to="/book-appointment"
                className="mt-6 inline-block rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800"
              >
                Book Your First Appointment →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {appointments.map((appointment) => {
                const busy = actionLoading === appointment._id;
                const fee = appointment.fee || 500;

                return (
                  <article
                    key={appointment._id}
                    className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg"
                  >
                    {/* Card Header */}
                    <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50/70 p-5 sm:p-6">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-2xl">
                        👨‍⚕️
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                          Consultation with
                        </p>

                        <h3 className="mt-1 truncate text-lg font-bold text-slate-900">
                          {appointment.doctor?.fullName || "Doctor"}
                        </h3>

                        <p className="truncate text-sm text-slate-500">
                          {appointment.doctor?.email || "Doctor information"}
                        </p>
                      </div>

                      <span className="hidden rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm sm:block">
                        Appointment
                      </span>
                    </div>

                    {/* Card Details */}
                    <div className="space-y-4 p-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-medium text-slate-500">
                            📅 Appointment Date
                          </p>

                          <p className="mt-2 font-semibold text-slate-800">
                            {new Date(
                              appointment.appointmentDate
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-medium text-slate-500">
                            🕒 Appointment Time
                          </p>

                          <p className="mt-2 font-semibold text-slate-800">
                            {appointment.appointmentTime}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          📝 Reason for Visit
                        </p>

                        <p className="mt-2 rounded-xl border border-slate-100 p-4 text-sm font-medium leading-relaxed text-slate-800">
                          {appointment.reason || "Not provided"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <span className="text-sm text-slate-500">
                          Consultation Fee
                        </span>

                        <span className="text-lg font-bold text-slate-900">
                          ₹{fee}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-500">
                          Appointment Status
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                            appointment.status
                          )}`}
                        >
                          {appointment.status || "Pending"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-500">
                          Payment Status
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getPaymentStyle(
                            appointment.paymentStatus
                          )}`}
                        >
                          {appointment.paymentStatus || "Pending"}
                        </span>
                      </div>

                      {/* Payment Button */}
                      {appointment.status === "Approved" &&
                        appointment.paymentStatus !== "Paid" && (
                          <button
                            onClick={() => handlePayment(appointment._id)}
                            disabled={busy}
                            className="w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {busy
                              ? "Processing..."
                              : `💳 Pay ₹${fee}`}
                          </button>
                        )}

                      {/* Paid Message */}
                      {appointment.paymentStatus === "Paid" && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                          <p className="font-semibold text-emerald-800">
                            ✓ Payment Completed
                          </p>
                          <p className="mt-1 text-sm text-emerald-700">
                            Amount paid: ₹
                            {appointment.paymentAmount || fee}
                          </p>
                        </div>
                      )}

                      {/* Cancel Button */}
                      {["Pending", "Approved"].includes(
                        appointment.status
                      ) && (
                        <button
                          onClick={() => handleCancel(appointment._id)}
                          disabled={busy}
                          className="w-full rounded-xl border border-red-200 bg-red-50 py-3 font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {busy ? "Please wait..." : "Cancel Appointment"}
                        </button>
                      )}

                      {appointment.status === "Cancelled" && (
                        <div className="rounded-xl bg-slate-100 py-3 text-center text-sm font-semibold text-slate-600">
                          This appointment has been cancelled.
                        </div>
                      )}

                      {appointment.status === "Rejected" && (
                        <div className="rounded-xl border border-red-100 bg-red-50 py-3 text-center text-sm font-semibold text-red-700">
                          This appointment was rejected.
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer Navigation */}
        <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 py-6 sm:flex-row">
          <Link
            to="/patient"
            className="text-sm font-semibold text-teal-700 transition hover:text-teal-900"
          >
            ← Back to Dashboard
          </Link>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} HealthFlow AI · Your Healthcare Companion
          </p>
        </footer>
      </div>
    </div>
  );
}

export default MyAppointments;

