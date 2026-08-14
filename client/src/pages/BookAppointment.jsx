import { useState } from "react";
import axios from "axios";

function BookAppointment() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);


  const [doctor, setDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

const handleBookAppointment = async () => {
  console.log("Book button clicked");

  console.log("User:", user);

  try {
    const response = await axios.post(
      "http://localhost:5000/api/appointments/book",
      {
        patient: user.id,
        doctor,
        appointmentDate,
        appointmentTime,
        reason,
      }
    );

    console.log(response);

    alert(response.data.message);

    setDoctor("");
    setAppointmentDate("");
    setAppointmentTime("");
    setReason("");

  } catch (error) {
    console.log("ERROR:", error);

    console.log("Response:", error.response);

    console.log("Data:", error.response?.data);

    alert(error.response?.data?.message || error.message);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-[500px]">

        <h1 className="text-3xl font-bold text-center text-blue-700">
          📅 Book Appointment
        </h1>

        {/* Doctor */}
        <div className="mt-6">
          <label className="font-semibold">Doctor ID</label>

          <input
            type="text"
            placeholder="Enter Doctor ID"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        {/* Date */}
        <div className="mt-5">
          <label className="font-semibold">Appointment Date</label>

          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        {/* Time */}
        <div className="mt-5">
          <label className="font-semibold">Appointment Time</label>

          <input
            type="time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        {/* Reason */}
        <div className="mt-5">
          <label className="font-semibold">Reason</label>

          <textarea
            rows="4"
            placeholder="Enter reason for appointment"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full mt-2 p-3 border rounded-xl"
          ></textarea>
        </div>

        <button
          onClick={handleBookAppointment}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
        >
          Book Appointment
        </button>

      </div>

    </div>
  );
}

export default BookAppointment;