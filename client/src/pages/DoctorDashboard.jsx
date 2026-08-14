import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function DoctorDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/appointments/stats"
      );

      setStats(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-green-600 text-white p-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          👨‍⚕️ Doctor Dashboard
        </h1>

        <div>
          Welcome, <b>{user?.fullName}</b>
        </div>
      </div>

      <div className="p-8">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-gray-500">Total</h2>
            <p className="text-4xl font-bold text-blue-600">
              {stats.total}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-gray-500">Pending</h2>
            <p className="text-4xl font-bold text-yellow-500">
              {stats.pending}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-gray-500">Approved</h2>
            <p className="text-4xl font-bold text-green-600">
              {stats.approved}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-gray-500">Rejected</h2>
            <p className="text-4xl font-bold text-red-600">
              {stats.rejected}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-gray-500">Cancelled</h2>
            <p className="text-4xl font-bold text-gray-600">
              {stats.cancelled}
            </p>
          </div>

        </div>

        <div className="mt-10">
          <Link
            to="/doctor-appointments"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            📅 Manage Appointments
          </Link>
        </div>

      </div>
    </div>
  );
}

export default DoctorDashboard;