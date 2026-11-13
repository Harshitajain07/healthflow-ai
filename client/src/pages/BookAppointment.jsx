
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function BookAppointment() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchDoctors = useCallback(async () => {
    try {
      setLoadingDoctors(true);
      setError("");

      const authConfig = getAuthConfig();

      if (!authConfig) {
        setError("Your login session was not found. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }

      const response = await axios.get(
        `${API}/doctors`,
        authConfig
      );

      if (response.data.success) {
        setDoctors(response.data.doctors || []);
      } else {
        setDoctors([]);
        setError("Unable to load doctors. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);

      if (err.response?.status === 401) {
        setError("Your login session has expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      } else if (err.response?.status === 403) {
        setError("Your account does not have permission to view doctors.");
      } else {
        setError(
          err.response?.data?.message ||
          "Could not load doctors. Please try again."
        );
      }

      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  }, [navigate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!token || !user || user.role !== "patient") {
      navigate("/login", { replace: true });
      return;
    }

    fetchDoctors();
  }, [fetchDoctors, navigate]);

  const handleBookAppointment = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    let user;

    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      setError("Your login session is invalid. Please log in again.");
      navigate("/login", { replace: true });
      return;
    }

    const authConfig = getAuthConfig();

    if (!user || !authConfig) {
      setError("Your login session was not found. Please log in again.");
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "patient") {
      setError("Only patient accounts can book appointments.");
      return;
    }

    if (!doctor || !appointmentDate || !appointmentTime || !reason.trim()) {
      setError("Please complete all fields before booking.");
      return;
    }

    const selectedDateTime = new Date(
      `${appointmentDate}T${appointmentTime}`
    );

    if (
      Number.isNaN(selectedDateTime.getTime()) ||
      selectedDateTime <= new Date()
    ) {
      setError("Please select a future appointment date and time.");
      return;
    }

    try {
      setBooking(true);

      const response = await axios.post(
        `${API}/appointments/book`,
        {
          doctor,
          appointmentDate,
          appointmentTime,
          reason: reason.trim(),
        },
        authConfig
      );

      setSuccess(
        response.data.message ||
          "Your appointment request was submitted successfully!"
      );

      setDoctor("");
      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");
    } catch (err) {
      console.error("Booking error:", err);

      if (err.response?.status === 401) {
        setError("Your login session has expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to book your appointment. Please try again."
        );
      }
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">
              Patient Portal
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Book an Appointment
            </h1>

            <p className="mt-2 text-slate-500">
              Schedule a consultation with one of our available doctors.
            </p>
          </div>

          <Link
            to="/patient"
            className="inline-flex w-fit items-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-9">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-3xl">
                📅
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Appointment Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Fill in the details below.
                </p>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
              >
                <p className="font-semibold">
                  ✓ Appointment request submitted
                </p>

                <p className="mt-1">{success}</p>

                <Link
                  to="/my-appointments"
                  className="mt-3 inline-block font-semibold underline"
                >
                  View My Appointments →
                </Link>
              </div>
            )}

            <form onSubmit={handleBookAppointment}>
              <div className="mb-6">
                <label
                  htmlFor="doctor"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Select Doctor *
                </label>

                <select
                  id="doctor"
                  value={doctor}
                  onChange={(e) => {
                    setDoctor(e.target.value);
                    setError("");
                  }}
                  required
                  disabled={
                    loadingDoctors || booking || doctors.length === 0
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">
                    {loadingDoctors
                      ? "Loading doctors..."
                      : doctors.length === 0
                        ? "No doctors available"
                        : "Choose a doctor"}
                  </option>

                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.fullName} - {doc.email}
                    </option>
                  ))}
                </select>

                {!loadingDoctors && doctors.length === 0 && (
                  <button
                    type="button"
                    onClick={fetchDoctors}
                    className="mt-2 text-sm font-semibold text-teal-700 hover:underline"
                  >
                    Try loading doctors again
                  </button>
                )}
              </div>

              <div className="mb-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="appointmentDate"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Appointment Date *
                  </label>

                  <input
                    id="appointmentDate"
                    type="date"
                    value={appointmentDate}
                    min={getTodayDate()}
                    onChange={(e) => {
                      setAppointmentDate(e.target.value);
                      setError("");
                    }}
                    required
                    disabled={booking}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-50 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="appointmentTime"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Appointment Time *
                  </label>

                  <input
                    id="appointmentTime"
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => {
                      setAppointmentTime(e.target.value);
                      setError("");
                    }}
                    required
                    disabled={booking}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-50 disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label
                  htmlFor="reason"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Reason for Appointment *
                </label>

                <textarea
                  id="reason"
                  rows={5}
                  maxLength={1000}
                  placeholder="Briefly describe why you want to consult the doctor..."
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setError("");
                  }}
                  required
                  disabled={booking}
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 disabled:bg-slate-100"
                />

                <p className="mt-2 text-right text-xs text-slate-400">
                  {reason.length}/1000 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  booking || loadingDoctors || doctors.length === 0
                }
                className="w-full rounded-xl bg-teal-600 px-6 py-4 font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:-translate-y-0.5 hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
              >
                {booking
                  ? "Submitting Your Request..."
                  : "📅 Confirm Appointment Request"}
              </button>

              <p className="mt-4 text-center text-xs text-slate-400">
                Your appointment will be submitted for doctor approval.
              </p>
            </form>
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-lg">
              <div className="mb-4 text-3xl">🩺</div>

              <h3 className="text-lg font-bold">Your Health Matters</h3>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Choose an available doctor and provide a suitable date and
                time for your consultation.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900">
                What happens next?
              </h3>

              <div className="mt-5 space-y-5">
                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 font-bold text-teal-700">
                    1
                  </span>

                  <div>
                    <p className="font-semibold text-slate-800">
                      Submit request
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Send your appointment details.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 font-bold text-teal-700">
                    2
                  </span>

                  <div>
                    <p className="font-semibold text-slate-800">
                      Doctor review
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      The doctor reviews your request.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 font-bold text-teal-700">
                    3
                  </span>

                  <div>
                    <p className="font-semibold text-slate-800">
                      Check your status
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Track the request in My Appointments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
