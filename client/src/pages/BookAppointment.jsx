
import { useEffect, useState } from "react";
import axios from "axios";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/doctors"
        );

        if (response.data.success) {
          setDoctors(response.data.doctors || []);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        alert("Failed to load doctors. Please check that the server is running.");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = async (event) => {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      alert("Your login session was not found. Please log in again.");
      return;
    }

    if (user.role !== "patient") {
      alert("Only patient accounts can book appointments.");
      return;
    }

    if (!doctor || !appointmentDate || !appointmentTime || !reason.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (new Date(`${appointmentDate}T${appointmentTime}`) <= new Date()) {
      alert("Please select a future appointment date and time.");
      return;
    }

    try {
      setBooking(true);

      const response = await axios.post(
        "http://localhost:5000/api/appointments/book",
        {
          doctor,
          appointmentDate,
          appointmentTime,
          reason: reason.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "Appointment booked successfully!");

      setDoctor("");
      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");
    } catch (error) {
      console.error("Booking Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-[500px]">
        <h1 className="text-3xl font-bold text-center text-blue-700">
          📅 Book Appointment
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Choose a doctor and schedule your appointment
        </p>

        <form onSubmit={handleBookAppointment}>
          <div className="mt-6">
            <label htmlFor="doctor" className="font-semibold">
              Select Doctor
            </label>

            <select
              id="doctor"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="w-full mt-2 p-3 border rounded-xl bg-white"
              required
              disabled={loadingDoctors || booking}
            >
              <option value="">
                {loadingDoctors ? "Loading doctors..." : "Select a doctor"}
              </option>

              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.fullName} - {doc.email}
                </option>
              ))}
            </select>

            {!loadingDoctors && doctors.length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                No doctors found. Please try again later.
              </p>
            )}
          </div>

          <div className="mt-5">
            <label htmlFor="appointmentDate" className="font-semibold">
              Appointment Date
            </label>

            <input
              id="appointmentDate"
              type="date"
              value={appointmentDate}
              min={new Date().toLocaleDateString("en-CA")}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full mt-2 p-3 border rounded-xl"
              required
              disabled={booking}
            />
          </div>

          <div className="mt-5">
            <label htmlFor="appointmentTime" className="font-semibold">
              Appointment Time
            </label>

            <input
              id="appointmentTime"
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full mt-2 p-3 border rounded-xl"
              required
              disabled={booking}
            />
          </div>

          <div className="mt-5">
            <label htmlFor="reason" className="font-semibold">
              Reason for Appointment
            </label>

            <textarea
              id="reason"
              rows="4"
              placeholder="Enter reason for appointment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-2 p-3 border rounded-xl"
              required
              disabled={booking}
            />
          </div>

          <button
            type="submit"
            disabled={booking || loadingDoctors || doctors.length === 0}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition"
          >
            {booking ? "Booking..." : "📅 Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;
