import { useEffect, useState } from "react";
import axios from "axios";

function DoctorAppointments() {
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
      console.log(error);
      alert(error.response?.data?.message || error.message);
    }
  };

  // ✅ KEEP THIS OUTSIDE useEffect
  const handleStatusChange = async (id, status) => {
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
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        👨‍⚕️ Doctor Appointments
      </h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-green-600 text-white">
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

              <tr key={appointment._id} className="text-center border-b">

                <td className="p-4">
                  {appointment.patient?.fullName}
                </td>

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

                  {appointment.status === "Pending" ? (

                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(
                            appointment._id,
                            "Approved"
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleStatusChange(
                            appointment._id,
                            "Rejected"
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>

                  ) : (
                    "-"
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default DoctorAppointments;