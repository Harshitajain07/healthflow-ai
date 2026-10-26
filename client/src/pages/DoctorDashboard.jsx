import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      navigate("/login");
      return;
    }

    setUser(savedUser);
  }, [navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      console.log("Doctor ID:", user.id);

      const response = await axios.get(
        `http://localhost:5000/api/appointments/stats?doctorId=${user.id}`
      );

      console.log("Doctor Stats:", response.data);

      if (response.data.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.log("Dashboard Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-green-600 text-white p-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          👨‍⚕️ Doctor Dashboard
        </h1>

        <div>
          Welcome, <b>{user.fullName}</b>
        </div>
      </div>

      {/* Dashboard */}
      <div className="p-8">

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* Total */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-gray-500">
              Total Appointments
            </h2>

            <p className="text-4xl font-bold text-blue-600">
              {stats.total}
            </p>
          </div>

          {/* Pending */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-gray-500">
              Pending
            </h2>

            <p className="text-4xl font-bold text-yellow-500">
              {stats.pending}
            </p>
          </div>

          {/* Approved */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-gray-500">
              Approved
            </h2>

            <p className="text-4xl font-bold text-green-600">
              {stats.approved}
            </p>
          </div>

          {/* Rejected */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-gray-500">
              Rejected
            </h2>

            <p className="text-4xl font-bold text-red-600">
              {stats.rejected}
            </p>
          </div>

          {/* Cancelled */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-gray-500">
              Cancelled
            </h2>

            <p className="text-4xl font-bold text-gray-600">
              {stats.cancelled}
            </p>
          </div>

        </div>

        {/* Manage Appointments */}
        <div className="mt-10">
          <Link
            to="/doctor-appointments"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 mr-4"
          >
            📅 Manage Appointments
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default DoctorDashboard;