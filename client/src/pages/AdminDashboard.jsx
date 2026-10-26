import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0,
  });

  useEffect(() => {
    // Check login
    if (!user) {
      window.location.href = "/login";
      return;
    }

    // Only admin can access this page
    if (user.role !== "admin") {
      if (user.role === "doctor") {
        window.location.href = "/doctor";
      } else {
        window.location.href = "/patient";
      }
      return;
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get doctor and patient statistics
      const userResponse = await axios.get(
        "http://localhost:5000/api/auth/stats"
      );

      // Get all appointments
      const appointmentResponse = await axios.get(
        "http://localhost:5000/api/appointments"
      );

      const appointments = appointmentResponse.data.success
        ? appointmentResponse.data.appointments
        : [];

      // Total appointments
      const totalAppointments = appointments.length;

      // Only Paid appointments generate revenue
      const paidAppointments = appointments.filter(
        (appointment) => appointment.paymentStatus === "Paid"
      );

      // Calculate total revenue
      const totalRevenue = paidAppointments.reduce(
        (total, appointment) => {
          return total + (appointment.paymentAmount || appointment.fee || 500);
        },
        0
      );

      setStats({
        doctors: userResponse.data.doctors || 0,
        patients: userResponse.data.patients || 0,
        appointments: totalAppointments,
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error("Admin Dashboard Error:", error);
      alert("Failed to load dashboard statistics");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-purple-700 text-white p-6 flex flex-col justify-between">

        <div>

          <h1 className="text-2xl font-bold mb-10">
            🏥 HealthFlow AI
          </h1>

          <ul className="space-y-5">

            <li>
              <Link
                to="/admin"
                className="hover:text-purple-200"
              >
                📊 Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/manage-doctors"
                className="hover:text-purple-200"
              >
                👨‍⚕️ Manage Doctors
              </Link>
            </li>

            <li>
              <Link
                to="/manage-patients"
                className="hover:text-purple-200"
              >
                👥 Manage Patients
              </Link>
            </li>

            <li>
              <Link
                to="/manage-appointments"
                className="hover:text-purple-200"
              >
                📅 Appointments
              </Link>
            </li>

          </ul>

        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 py-3 rounded-lg font-semibold"
        >
          🚪 Logout
        </button>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold">
          Welcome, {user?.fullName} 👋
        </h1>

        <p className="text-gray-500 mt-2">
          Administrator Panel
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">

          {/* Doctors */}
          <div className="bg-white shadow-lg rounded-xl p-6">

            <h2 className="text-gray-500">
              👨‍⚕️ Doctors
            </h2>

            <p className="text-4xl font-bold text-green-600 mt-3">
              {stats.doctors}
            </p>

          </div>

          {/* Patients */}
          <div className="bg-white shadow-lg rounded-xl p-6">

            <h2 className="text-gray-500">
              👥 Patients
            </h2>

            <p className="text-4xl font-bold text-blue-600 mt-3">
              {stats.patients}
            </p>

          </div>

          {/* Appointments */}
          <div className="bg-white shadow-lg rounded-xl p-6">

            <h2 className="text-gray-500">
              📅 Appointments
            </h2>

            <p className="text-4xl font-bold text-purple-600 mt-3">
              {stats.appointments}
            </p>

          </div>

          {/* Revenue */}
          <div className="bg-white shadow-lg rounded-xl p-6">

            <h2 className="text-gray-500">
              💰 Revenue
            </h2>

            <p className="text-4xl font-bold text-red-600 mt-3">
              ₹{stats.revenue}
            </p>

          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-5">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <Link
              to="/manage-doctors"
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold text-green-600">
                👨‍⚕️ Manage Doctors
              </h3>

              <p className="text-gray-500 mt-2">
                Add, view and manage doctors.
              </p>
            </Link>

            <Link
              to="/manage-patients"
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold text-blue-600">
                👥 Manage Patients
              </h3>

              <p className="text-gray-500 mt-2">
                View and manage registered patients.
              </p>
            </Link>

            <Link
              to="/manage-appointments"
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold text-purple-600">
                📅 Manage Appointments
              </h3>

              <p className="text-gray-500 mt-2">
                View and manage all appointments.
              </p>
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;