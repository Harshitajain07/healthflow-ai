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
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get user statistics
      const userResponse = await axios.get(
        "http://localhost:5000/api/auth/stats"
      );

      // Get appointment statistics
      const appointmentResponse = await axios.get(
        "http://localhost:5000/api/appointments/stats"
      );

      setStats({
        doctors: userResponse.data.doctors,
        patients: userResponse.data.patients,
        appointments: appointmentResponse.data.total,
        revenue: 0,
      });
    } catch (error) {
      console.log(error);
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
              <Link to="/admin" className="hover:text-purple-200">
                📊 Dashboard
              </Link>
            </li>

            <li>
              <Link to="/manage-doctors" className="hover:text-purple-200">
                👨‍⚕️ Manage Doctors
              </Link>
            </li>

            <li>
              <Link to="/manage-patients" className="hover:text-purple-200">
                👥 Manage Patients
              </Link>
            </li>

            <li>
              <Link to="/manage-appointments" className="hover:text-purple-200">
                📅 Appointments
              </Link>
            </li>

          </ul>

        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-gray-500">👨 Doctors</h2>
            <p className="text-4xl font-bold text-green-600 mt-3">
              {stats.doctors}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-gray-500">👥 Patients</h2>
            <p className="text-4xl font-bold text-blue-600 mt-3">
              {stats.patients}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-gray-500">📅 Appointments</h2>
            <p className="text-4xl font-bold text-purple-600 mt-3">
              {stats.appointments}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-gray-500">💰 Revenue</h2>
            <p className="text-4xl font-bold text-red-600 mt-3">
              ₹{stats.revenue}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;