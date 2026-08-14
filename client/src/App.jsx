import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PatientDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    appointments: 0,
    doctors: 0,
    reports: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/dashboard/${user._id}`
      );

      setStats({
        appointments: response.data.appointments,
        doctors: response.data.doctors,
        reports: response.data.reports,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}

      <div className="w-72 bg-blue-700 text-white flex flex-col justify-between">

        <div>

          <div className="p-6 border-b border-blue-500">

            <h1 className="text-3xl font-bold">
              🏥 HealthFlow AI
            </h1>

            <p className="text-blue-200 mt-2">
              Patient Portal
            </p>

          </div>

          <nav className="p-6 space-y-4">

            <Link
              to="/patient"
              className="block hover:bg-blue-600 p-3 rounded-lg"
            >
              🏠 Dashboard
            </Link>

            <Link
              to="/book-appointment"
              className="block hover:bg-blue-600 p-3 rounded-lg"
            >
              📅 Book Appointment
            </Link>

            <Link
              to="/my-appointments"
              className="block hover:bg-blue-600 p-3 rounded-lg"
            >
              📋 My Appointments
            </Link>

            <Link
              to="/symptom-checker"
              className="block hover:bg-blue-600 p-3 rounded-lg"
            >
              🤖 AI Symptom Checker
            </Link>

            <Link
              to="/prescription-reader"
              className="block hover:bg-blue-600 p-3 rounded-lg"
            >
              💊 AI Prescription Reader
            </Link>

            <Link
              to="/report-summarizer"
              className="block hover:bg-blue-600 p-3 rounded-lg"
            >
              📄 AI Report Summarizer
            </Link>

            <Link
              to="/ai-chat"
              className="block hover:bg-blue-600 p-3 rounded-lg"
            >
              💬 AI Health Chat
            </Link>

          </nav>

        </div>

        <div className="p-6">

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-semibold"
          >
            🚪 Logout
          </button>

        </div>

      </div>

      {/* Main Content */}

      <div className="flex-1 p-8">

        {/* Welcome */}

        <div className="bg-white rounded-xl shadow-md p-6">

          <h1 className="text-4xl font-bold text-gray-800">
            {getGreeting()}, {user?.fullName} 👋
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back to HealthFlow AI.
          </p>

          <div className="mt-4">

            <p>
              <strong>Email:</strong> {user?.email}
            </p>

            <p>
              <strong>Role:</strong> {user?.role}
            </p>

          </div>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white shadow-md rounded-xl p-6">

            <h2 className="text-xl font-semibold">
              📅 Appointments
            </h2>

            <p className="text-5xl text-blue-600 font-bold mt-4">
              {stats.appointments}
            </p>

          </div>

          <div className="bg-white shadow-md rounded-xl p-6">

            <h2 className="text-xl font-semibold">
              👨‍⚕ Doctors
            </h2>

            <p className="text-5xl text-green-600 font-bold mt-4">
              {stats.doctors}
            </p>

          </div>

          <div className="bg-white shadow-md rounded-xl p-6">

            <h2 className="text-xl font-semibold">
              📄 Reports
            </h2>

            <p className="text-5xl text-red-600 font-bold mt-4">
              {stats.reports}
            </p>

          </div>

        </div>

        {/* AI Services */}

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-6">
            🤖 AI Services
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            <Link
              to="/symptom-checker"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold">
                🤖 Symptom Checker
              </h3>

              <p className="text-gray-500 mt-3">
                Check symptoms using AI.
              </p>

            </Link>

            <Link
              to="/prescription-reader"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold">
                💊 Prescription Reader
              </h3>

              <p className="text-gray-500 mt-3">
                Analyze handwritten prescriptions.
              </p>

            </Link>

            <Link
              to="/report-summarizer"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold">
                📄 Report Summarizer
              </h3>

              <p className="text-gray-500 mt-3">
                Understand medical reports instantly.
              </p>

            </Link>

            <Link
              to="/ai-chat"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold">
                💬 AI Health Chat
              </h3>

              <p className="text-gray-500 mt-3">
                Ask health-related questions.
              </p>

            </Link>

          </div>

        </div>

        {/* Health Tip */}

        <div className="mt-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white p-8">

          <h2 className="text-2xl font-bold">
            💡 Today's Health Tip
          </h2>

          <p className="mt-4 text-lg">
            Drink at least 2-3 litres of water, walk for 30 minutes,
            and sleep for 7-8 hours daily to maintain a healthy lifestyle.
          </p>

        </div>

      </div>

    </div>
  );
}

export default PatientDashboard;