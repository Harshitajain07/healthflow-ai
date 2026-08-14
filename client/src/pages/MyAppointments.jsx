import { useEffect, useState } from "react";
import axios from "axios";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/appointments"
      );

      setAppointments(response.data.appointments);

    } catch (error) {
        console.log("ERROR:", error);
        console.log("Response:", error.response);
        console.log("Data:", error.response?.data);

        alert(error.response?.data?.message || error.message);
    }
  };

  const handleCancelAppointment = async (id) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/appointments/cancel/${id}`
    );

    alert(response.data.message);

    // Refresh appointment list
    fetchAppointments();

  } catch (error) {
    alert(error.response?.data?.message || "Failed to cancel appointment");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        📅 My Appointments
      </h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr>
              <th className="p-4">Doctor</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>

            </tr>

          </thead>

          <tbody>

            {appointments.map((appointment) => (

              <tr key={appointment._id} className="text-center border-b">

                <td className="p-4">
                  {appointment.doctor?.fullName}
                </td>

                <td className="p-4">
                  {new Date(
                    appointment.appointmentDate
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">
                  {appointment.appointmentTime}
                </td>

                <td className="p-4">
                  {appointment.reason}
                </td>

                <td className="p-4 font-semibold text-blue-600">
                  {appointment.status}
                </td>

                <td className="p-4">
                    <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        disabled={appointment.status === "Cancelled"}
                        className={`px-4 py-2 rounded-lg text-white ${
                            appointment.status === "Cancelled"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600"
                        }`}
                    >
                        {appointment.status === "Cancelled"
                            ? "Cancelled"
                            : "Cancel"}
                    </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default MyAppointments;