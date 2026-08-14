import { useEffect, useState } from "react";
import axios from "axios";

function ManageAppointments() {
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
      alert("Failed to load appointments");
    }
  };

  const updateStatus = async (id, status) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/appointments/status/${id}`,
      {
        status,
      }
    );

    alert(response.data.message);

    fetchAppointments();

  } catch (error) {
    alert(error.response?.data?.message || error.message);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        📅 Manage Appointments
      </h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4">Patient</th>
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

              <tr
                key={appointment._id}
                className="border-b text-center"
              >

                <td className="p-4">
                  {appointment.patient?.fullName}
                </td>

                <td className="p-4">
                  {appointment.doctor?.fullName}
                </td>

                <td className="p-4">
                  {new Date(appointment.appointmentDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })}
                </td>

                <td className="p-4">
                  {appointment.appointmentTime}
                </td>

                <td className="p-4">
                  {appointment.reason}
                </td>

                <td className="p-4 font-bold">
                  {appointment.status}
                </td>

                <td className="p-4">

                <button
                    onClick={() => updateStatus(appointment._id, "Approved")}
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                >
                    Approve
                </button>

                <button
                    onClick={() => updateStatus(appointment._id, "Rejected")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                Reject
                </button>

                <button
                    onClick={() => updateStatus(appointment._id, "Cancelled")}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                >
                Cancel
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

export default ManageAppointments;