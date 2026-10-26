import { useEffect, useState } from "react";
import axios from "axios";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (user.role !== "doctor") {
      window.location.href = "/patient";
      return;
    }

    fetchAppointments();
  }, []);

  // ============================
  // Fetch Doctor Appointments
  // ============================
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/appointments"
      );

      const allAppointments = response.data.appointments || [];

      const doctorAppointments = allAppointments.filter(
        (appointment) =>
          appointment.doctor?._id === user.id
      );

      setAppointments(doctorAppointments);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          error.message
      );
    }
  };

  // ============================
  // Update Appointment Status
  // ============================
  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/appointments/status/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      fetchAppointments();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update appointment status"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Page Header */}
      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        👨‍⚕️ Doctor Appointments
      </h1>

      {/* Appointment Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <div className="overflow-x-auto">

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

              {appointments.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-gray-500"
                  >
                    No appointments found.
                  </td>
                </tr>

              ) : (

                appointments.map((appointment) => (

                  <tr
                    key={appointment._id}
                    className="text-center border-b hover:bg-gray-50"
                  >

                    {/* Patient */}
                    <td className="p-4">
                      {appointment.patient?.fullName || "Unknown"}
                    </td>

                    {/* Doctor */}
                    <td className="p-4">
                      {appointment.doctor?.fullName || "Unknown"}
                    </td>

                    {/* Date */}
                    <td className="p-4">
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Time */}
                    <td className="p-4">
                      {appointment.appointmentTime}
                    </td>

                    {/* Reason */}
                    <td className="p-4">
                      {appointment.reason || "Not provided"}
                    </td>

                    {/* Status */}
                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          appointment.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : appointment.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : appointment.status === "Cancelled"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {appointment.status}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="p-4">

                      {/* Pending Actions */}
                      {appointment.status === "Pending" && (
                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() =>
                              handleStatusChange(
                                appointment._id,
                                "Approved"
                              )
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
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

                        </div>
                      )}

                      {/* Approved Action */}
                      {appointment.status === "Approved" && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              appointment._id,
                              "Cancelled"
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      )}

                      {/* Rejected Action */}
                      {appointment.status === "Rejected" && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              appointment._id,
                              "Approved"
                            )
                          }
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Approve Again
                        </button>
                      )}

                      {/* Cancelled Action */}
                      {appointment.status === "Cancelled" && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              appointment._id,
                              "Pending"
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Restore
                        </button>
                      )}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default DoctorAppointments;