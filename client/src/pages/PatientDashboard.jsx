import { Link } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaClipboardList,
  FaRobot,
  FaPrescriptionBottleAlt,
  FaFileMedical,
  FaComments,
  FaSignOutAlt,
  FaHospital,
  FaUserCircle,
  FaBell,
} from "react-icons/fa";

function PatientDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const today = new Date();

  const currentDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ================= SIDEBAR ================= */}

      <div className="w-72 bg-gradient-to-b from-blue-800 to-blue-600 text-white flex flex-col justify-between shadow-xl">

        <div>

          <div className="p-6 border-b border-blue-500">

            <div className="flex items-center gap-3">

              <FaHospital size={35} />

              <div>

                <h1 className="text-2xl font-bold">
                  HealthFlow AI
                </h1>

                <p className="text-blue-100 text-sm">
                  Smart Healthcare Platform
                </p>

              </div>

            </div>

          </div>

          <div className="p-4 space-y-2 mt-5">

            <Link
              to="/patient"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition"
            >
              <FaHome />
              Dashboard
            </Link>

            <Link
              to="/book-appointment"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition"
            >
              <FaCalendarAlt />
              Book Appointment
            </Link>

            <Link
              to="/my-appointments"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition"
            >
              <FaClipboardList />
              My Appointments
            </Link>

            <Link
              to="/symptom-checker"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition"
            >
              <FaRobot />
              AI Symptom Checker
            </Link>

            <Link
              to="/prescription-reader"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition"
            >
              <FaPrescriptionBottleAlt />
              AI Prescription Reader
            </Link>

            <Link
              to="/report-summarizer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition"
            >
              <FaFileMedical />
              AI Report Summarizer
            </Link>

            <Link
              to="/ai-chat"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition"
            >
              <FaComments />
              AI Health Chat
            </Link>

            <Link
              to="#"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition"
            >
              <FaUserCircle />
              My Profile
            </Link>

          </div>

        </div>

        <div className="p-5">

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold flex justify-center items-center gap-3"
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>

      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="flex-1 p-8">

        {/* Header */}

        <div className="bg-white rounded-2xl shadow-lg p-8 flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold text-gray-800">
              {getGreeting()}, {user?.fullName} 👋
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome back to HealthFlow AI
            </p>

            <p className="text-gray-400 mt-2">
              {currentDate}
            </p>

            <p className="mt-3 font-medium">
              📧 {user?.email}
            </p>

            <p>
              👤 {user?.role}
            </p>

          </div>

          <div className="flex items-center gap-5">

            <button className="text-2xl hover:scale-110 transition">
              <FaBell />
            </button>

            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex justify-center items-center text-3xl font-bold">

              {user?.fullName?.charAt(0).toUpperCase()}

            </div>

          </div>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold">
              📅 Appointments
            </h2>

            <p className="text-4xl text-blue-600 font-bold mt-3">
              0
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold">
              👨‍⚕️ Doctors
            </h2>

            <p className="text-4xl text-green-600 font-bold mt-3">
              0
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold">
              📄 Reports
            </h2>

            <p className="text-4xl text-red-600 font-bold mt-3">
              0
            </p>

          </div>

        </div>


        {/* Quick Actions */}

<div className="mt-10">

  <h2 className="text-3xl font-bold mb-6">
    ⚡ Quick Actions
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

    <Link
      to="/book-appointment"
      className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
    >
      <div className="text-5xl mb-3">📅</div>

      <h3 className="font-bold text-lg">
        Book Appointment
      </h3>

      <p className="text-blue-100 mt-2 text-sm">
        Schedule a doctor visit
      </p>

    </Link>

    <Link
      to="/ai-chat"
      className="bg-green-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
    >
      <div className="text-5xl mb-3">🤖</div>

      <h3 className="font-bold text-lg">
        AI Health Chat
      </h3>

      <p className="text-green-100 mt-2 text-sm">
        Ask health questions
      </p>

    </Link>

    <Link
      to="/report-summarizer"
      className="bg-purple-600 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
    >
      <div className="text-5xl mb-3">📄</div>

      <h3 className="font-bold text-lg">
        Report AI
      </h3>

      <p className="text-purple-100 mt-2 text-sm">
        Analyze medical reports
      </p>

    </Link>

    <Link
      to="/prescription-reader"
      className="bg-orange-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
    >
      <div className="text-5xl mb-3">💊</div>

      <h3 className="font-bold text-lg">
        Prescription AI
      </h3>

      <p className="text-orange-100 mt-2 text-sm">
        Read prescriptions
      </p>

    </Link>

  </div>

</div>

        {/* AI Services */}

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-5">
            🤖 AI Services
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            <Link
              to="/symptom-checker"
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition"
            >
              <h3 className="font-bold text-xl">
                🤖 Symptom Checker
              </h3>

              <p className="text-gray-500 mt-2">
                Check symptoms instantly.
              </p>

            </Link>

            <Link
              to="/prescription-reader"
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition"
            >
              <h3 className="font-bold text-xl">
                💊 Prescription Reader
              </h3>

              <p className="text-gray-500 mt-2">
                Analyze handwritten prescriptions.
              </p>

            </Link>

            <Link
              to="/report-summarizer"
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition"
            >
              <h3 className="font-bold text-xl">
                📄 Report Summarizer
              </h3>

              <p className="text-gray-500 mt-2">
                Understand reports in seconds.
              </p>

            </Link>

            <Link
              to="/ai-chat"
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition"
            >
              <h3 className="font-bold text-xl">
                💬 AI Health Chat
              </h3>

              <p className="text-gray-500 mt-2">
                Chat with your AI assistant.
              </p>

            </Link>

          </div>

        </div>

        {/* Health Tip */}

        <div className="mt-10 bg-green-500 text-white rounded-2xl p-8 shadow">

          <h2 className="text-2xl font-bold">
            💡 Today's Health Tip
          </h2>

          <p className="mt-3 text-lg">
            Drink 2-3 litres of water, exercise for 30 minutes,
            sleep 7-8 hours, and eat plenty of fruits and vegetables.
          </p>

        </div>

      </div>

    </div>
  );
}

export default PatientDashboard;