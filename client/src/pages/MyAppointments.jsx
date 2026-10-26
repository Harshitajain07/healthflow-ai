
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function MyAppointments() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [actionLoading, setActionLoading] = useState("");

  // Load logged-in user
  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (savedUser) {
        setUser(savedUser);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error reading user:", error);
      setLoading(false);
    }
  }, []);

  // Get appointments belonging to the logged-in patient
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/appointments",
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );

        if (response.data.success) {
          const userId = user?.id || user?._id;

          const myAppointments = response.data.appointments.filter(
            (appointment) =>
              String(appointment.patient?._id) === String(userId)
          );

          setAppointments(myAppointments);
        }
      } catch (error) {
        console.error("Appointment Error:", error);
        setMessage(
          error.response?.data?.message ||
            "Unable to load appointments."
        );
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id || user?._id) {
      fetchAppointments();
    }
  }, [user]);

  // Cancel appointment
  const handleCancel = async (appointmentId) => {
    const appointment = appointments.find(
      (item) => item._id === appointmentId
    );

    if (!appointment) return;

    if (appointment.status === "Cancelled") {
      setMessage("This appointment is already cancelled.");
      setMessageType("info");
      return;
    }

    const confirmCancel = window.confirm(
      appointment.paymentStatus === "Paid"
        ? "This appointment has already been paid. Do you want to cancel it? This will not automatically refund your payment."
        : "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    setActionLoading(appointmentId);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/appointments/cancel/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAppointments((previousAppointments) =>
          previousAppointments.map((item) =>
            item._id === appointmentId
              ? {
                  ...item,
                  status: "Cancelled",
                }
              : item
          )
        );

        setMessage("Appointment cancelled successfully ✅");
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

  // Pay appointment
  const handlePayment = async (appointmentId) => {
    setActionLoading(appointmentId);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/appointments/pay/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAppointments((previousAppointments) =>
          previousAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? {
                  ...appointment,
                  paymentStatus: "Paid",
                  paymentAmount:
                    response.data.appointment?.paymentAmount ||
                    appointment.fee ||
                    500,
                }
              : appointment
          )
        );

        setMessage("Payment successful! 🎉");
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

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Loading appointments...
        </h2>
      </div>
    );
  }

  // No user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Please login first
          </h2>

          <p className="text-gray-500 mt-2">
            User information was not found.
          </p>

          <Link
            to="/login"
            className="inline-block mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Appointments
            </h1>

            <p className="text-gray-500 mt-1">
              View and manage your appointments
            </p>
          </div>

          <Link
            to="/book-appointment"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            + Book Appointment
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div
            role="status"
            className={`p-4 rounded-xl mb-6 text-center font-semibold ${
              messageType === "success"
                ? "bg-green-50 text-green-700"
                : messageType === "error"
                ? "bg-red-50 text-red-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* No appointments */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <div className="text-6xl mb-4">📅</div>

            <h2 className="text-2xl font-bold text-gray-800">
              No Appointments Found
            </h2>

            <p className="text-gray-500 mt-2">
              You don't have any appointments yet.
            </p>

            <Link
              to="/book-appointment"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700"
            >
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                {/* Doctor */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl">
                    👨‍⚕️
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {appointment.doctor?.fullName || "Doctor"}
                    </h2>

                    <p className="text-gray-500">
                      {appointment.doctor?.email || ""}
                    </p>
                  </div>
                </div>

                {/* Appointment details */}
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-500">📅 Date</span>

                    <span className="font-semibold text-gray-800">
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-500">🕐 Time</span>

                    <span className="font-semibold text-gray-800">
                      {appointment.appointmentTime}
                    </span>
                  </div>

                  <div className="border-b pb-3">
                    <p className="text-gray-500 mb-1">📝 Reason</p>

                    <p className="font-semibold text-gray-800">
                      {appointment.reason || "Not provided"}
                    </p>
                  </div>

                  {/* Consultation Fee */}
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-500">
                      💰 Consultation Fee
                    </span>

                    <span className="font-bold text-gray-800">
                      ₹{appointment.fee || 500}
                    </span>
                  </div>

                  {/* Appointment Status */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Status</span>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        appointment.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : appointment.status === "Cancelled"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appointment.status || "Pending"}
                    </span>
                  </div>

                  {/* Payment Status */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Payment</span>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        appointment.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : appointment.paymentStatus === "Failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appointment.paymentStatus || "Pending"}
                    </span>
                  </div>
                </div>

                {/* Pay Button */}
                {appointment.status === "Approved" &&
                  appointment.paymentStatus !== "Paid" && (
                    <button
                      onClick={() => handlePayment(appointment._id)}
                      disabled={actionLoading === appointment._id}
                      className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition"
                    >
                      {actionLoading === appointment._id
                        ? "Processing..."
                        : `💳 Pay ₹${appointment.fee || 500}`}
                    </button>
                  )}

                {/* Paid Message */}
                {appointment.paymentStatus === "Paid" && (
                  <div className="w-full mt-6 bg-green-50 text-green-700 py-3 rounded-xl text-center font-semibold">
                    ✅ Payment Completed — ₹
                    {appointment.paymentAmount ||
                      appointment.fee ||
                      500}
                  </div>
                )}

                {/* Cancel Button */}
                {["Pending", "Approved"].includes(
                  appointment.status
                ) && (
                  <button
                    onClick={() => handleCancel(appointment._id)}
                    disabled={actionLoading === appointment._id}
                    className="w-full mt-3 bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 disabled:opacity-50 transition"
                  >
                    {actionLoading === appointment._id
                      ? "Please wait..."
                      : "Cancel Appointment"}
                  </button>
                )}

                {appointment.status === "Cancelled" && (
                  <div className="w-full mt-3 bg-gray-100 text-gray-600 py-3 rounded-xl text-center font-semibold">
                    Appointment Cancelled
                  </div>
                )}

                {appointment.status === "Rejected" && (
                  <div className="w-full mt-3 bg-red-50 text-red-600 py-3 rounded-xl text-center font-semibold">
                    This appointment was rejected.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Back to dashboard */}
        <div className="mt-8 text-center">
          <Link
            to="/patient"
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MyAppointments;
