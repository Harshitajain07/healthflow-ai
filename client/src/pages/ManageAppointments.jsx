import { useEffect, useState } from "react";
import axios from "axios";

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/appointments"
      );

      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Failed to load appointments:", error);
      alert("Failed to load appointments");
    }
  };

  // ============================
  // Filter Appointments
  // ============================
  const getFilteredAppointments = () => {
    switch (selectedFilter) {
      case "Pending":
        return appointments.filter(
          (appointment) => appointment.status === "Pending"
        );

      case "Approved":
        return appointments.filter(
          (appointment) => appointment.status === "Approved"
        );

      case "Rejected":
        return appointments.filter(
          (appointment) => appointment.status === "Rejected"
        );

      case "Cancelled":
        return appointments.filter(
          (appointment) => appointment.status === "Cancelled"
        );

      case "Paid":
        return appointments.filter(
          (appointment) => appointment.paymentStatus === "Paid"
        );

      case "Unpaid":
        return appointments.filter(
          (appointment) => appointment.paymentStatus !== "Paid"
        );

      case "All":
      default:
        return appointments;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  // ============================
  // Filter Counts
  // ============================
  const getCount = (filterName) => {
    switch (filterName) {
      case "All":
        return appointments.length;

      case "Pending":
        return appointments.filter(
          (appointment) => appointment.status === "Pending"
        ).length;

      case "Approved":
        return appointments.filter(
          (appointment) => appointment.status === "Approved"
        ).length;

      case "Rejected":
        return appointments.filter(
          (appointment) => appointment.status === "Rejected"
        ).length;

      case "Cancelled":
        return appointments.filter(
          (appointment) => appointment.status === "Cancelled"
        ).length;

      case "Paid":
        return appointments.filter(
          (appointment) => appointment.paymentStatus === "Paid"
        ).length;

      case "Unpaid":
        return appointments.filter(
          (appointment) => appointment.paymentStatus !== "Paid"
        ).length;

      default:
        return 0;
    }
  };

  const filters = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
    "Cancelled",
    "Paid",
    "Unpaid",
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* ============================
          Header
      ============================ */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-blue-700">
          📅 Appointment Management
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor and manage all patient appointments
        </p>

      </div>

      {/* ============================
          Filters
      ============================ */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">

        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Filter Appointments
        </h2>

        <div className="flex flex-wrap gap-3">

          {filters.map((filter) => (

            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-5 py-3 rounded-lg font-semibold transition ${
                selectedFilter === filter
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter} ({getCount(filter)})
            </button>

          ))}

        </div>

      </div>

      {/* ============================
          Current Filter
      ============================ */}
      <div className="mb-4 flex justify-between items-center">

        <p className="text-gray-600 font-semibold">
          Current Filter:
          <span className="text-blue-600 ml-2">
            {selectedFilter}
          </span>
        </p>

        <p className="text-gray-600 font-semibold">
          Showing {filteredAppointments.length} appointment(s)
        </p>

      </div>

      {/* ============================
          Appointment Table
      ============================ */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="p-4">
                  Patient
                </th>

                <th className="p-4">
                  Doctor
                </th>

                <th className="p-4">
                  Date
                </th>

                <th className="p-4">
                  Time
                </th>

                <th className="p-4">
                  Reason
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4">
                  Payment
                </th>

                <th className="p-4">
                  Amount
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredAppointments.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="p-10 text-center"
                  >

                    <div className="text-4xl mb-3">
                      📅
                    </div>

                    <p className="text-gray-500 font-semibold">
                      No appointments found for "{selectedFilter}"
                    </p>

                  </td>

                </tr>

              ) : (

                filteredAppointments.map((appointment) => (

                  <tr
                    key={appointment._id}
                    className="border-b text-center hover:bg-gray-50"
                  >

                    {/* Patient */}
                    <td className="p-4 font-semibold">
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

                    {/* Payment */}
                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          appointment.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : appointment.paymentStatus === "Failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {appointment.paymentStatus || "Pending"}
                      </span>

                    </td>

                    {/* Amount */}
                    <td className="p-4 font-bold">
                      ₹{appointment.paymentAmount || appointment.fee || 500}
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

export default ManageAppointments;