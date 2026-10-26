import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function PatientDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState(0);
  const [appointments, setAppointments] = useState(0);
  const [reports, setReports] = useState(0);

  // Load logged-in user
  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      console.error("Error reading user:", error);
    }
  }, []);

  // Get dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get doctors
        const doctorResponse = await axios.get(
          "http://localhost:5000/api/doctors"
        );

        if (doctorResponse.data.success) {
          setDoctors(doctorResponse.data.doctors.length);
        }

        // Get appointments
        const appointmentResponse = await axios.get(
          "http://localhost:5000/api/appointments"
        );

        if (appointmentResponse.data.success) {
          const myAppointments =
            appointmentResponse.data.appointments.filter(
              (appointment) =>
                appointment.patient?._id === user.id
            );

          setAppointments(myAppointments.length);
        }

        // Get medical reports
        const reportResponse = await axios.get(
          `http://localhost:5000/api/reports/patient/${user.id}`
        );

        if (reportResponse.data.success) {
          setReports(reportResponse.data.reports.length);
        }
      } catch (error) {
        console.error("Dashboard Error:", error);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // Current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // User not found
  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600">
            User information not found
          </h1>

          <p className="text-gray-500 mt-2">
            Please login again.
          </p>

          <Link
            to="/login"
            className="inline-block mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">

        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-700">
            🏥 HealthFlow AI
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Patient Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">

          <Link
            to="/patient"
            className="flex items-center gap-3 p-3 rounded-xl bg-blue-100 text-blue-700 font-semibold"
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/book-appointment"
            className="flex items-center gap-3 p-3 mt-2 rounded-xl hover:bg-blue-50"
          >
            📅 Book Appointment
          </Link>

          <Link
            to="/my-appointments"
            className="flex items-center gap-3 p-3 mt-2 rounded-xl hover:bg-blue-50"
          >
            📋 My Appointments
          </Link>

          <Link
            to="/symptom-checker"
            className="flex items-center gap-3 p-3 mt-2 rounded-xl hover:bg-blue-50"
          >
            🩺 AI Symptom Checker
          </Link>

          <Link
            to="/prescription-reader"
            className="flex items-center gap-3 p-3 mt-2 rounded-xl hover:bg-blue-50"
          >
            💊 AI Prescription Reader
          </Link>

          <Link
            to="/report-summarizer"
            className="flex items-center gap-3 p-3 mt-2 rounded-xl hover:bg-blue-50"
          >
            📄 AI Report Summarizer
          </Link>

          <Link
            to="/ai-chat"
            className="flex items-center gap-3 p-3 mt-2 rounded-xl hover:bg-blue-50"
          >
            🤖 AI Health Chat
          </Link>

          {/* My Profile */}
          <Link
            to="/my-profile"
            className="flex items-center gap-3 p-3 mt-2 rounded-xl hover:bg-blue-50"
          >
            👤 My Profile
          </Link>

        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100"
          >
            🚪 Logout
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Good Day, {user.fullName} 👋
            </h2>

            <p className="text-gray-500 mt-1">
              {currentDate}
            </p>
          </div>

          <div className="flex items-center gap-4">

            <div className="text-right hidden sm:block">
              <p className="font-semibold text-gray-800">
                {user.email}
              </p>

              <p className="text-sm text-blue-600 capitalize">
                {user.role}
              </p>
            </div>

            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>

          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">

          {/* Appointments */}
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500">
                  My Appointments
                </p>

                <h3 className="text-4xl font-bold text-blue-600 mt-2">
                  {appointments}
                </h3>
              </div>

              <div className="text-4xl">
                📅
              </div>

            </div>

          </div>

          {/* Doctors */}
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500">
                  Available Doctors
                </p>

                <h3 className="text-4xl font-bold text-green-600 mt-2">
                  {doctors}
                </h3>
              </div>

              <div className="text-4xl">
                👨‍⚕️
              </div>

            </div>

          </div>

          {/* Medical Reports */}
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500">
                  Medical Reports
                </p>

                <h3 className="text-4xl font-bold text-purple-600 mt-2">
                  {reports}
                </h3>
              </div>

              <div className="text-4xl">
                📄
              </div>

            </div>

          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-10">

          <h2 className="text-2xl font-bold text-gray-800">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">

            <Link
              to="/book-appointment"
              className="bg-blue-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition"
            >
              <div className="text-4xl">
                📅
              </div>

              <h3 className="text-xl font-bold mt-4">
                Book Appointment
              </h3>

              <p className="mt-2 text-blue-100">
                Schedule an appointment with a doctor.
              </p>
            </Link>

            <Link
              to="/my-appointments"
              className="bg-green-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition"
            >
              <div className="text-4xl">
                📋
              </div>

              <h3 className="text-xl font-bold mt-4">
                My Appointments
              </h3>

              <p className="mt-2 text-green-100">
                View and manage your appointments.
              </p>
            </Link>

            <Link
              to="/symptom-checker"
              className="bg-purple-600 text-white p-6 rounded-2xl shadow hover:scale-105 transition"
            >
              <div className="text-4xl">
                🩺
              </div>

              <h3 className="text-xl font-bold mt-4">
                AI Symptom Checker
              </h3>

              <p className="mt-2 text-purple-100">
                Get AI-powered health guidance.
              </p>
            </Link>

          </div>

        </div>

        {/* AI Services */}
        <div className="mt-10">

          <h2 className="text-2xl font-bold text-gray-800">
            AI Health Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">

            <Link
              to="/prescription-reader"
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
            >
              <div className="text-4xl">
                💊
              </div>

              <h3 className="text-xl font-bold mt-4">
                Prescription Reader
              </h3>

              <p className="text-gray-500 mt-2">
                Upload prescriptions and get AI analysis.
              </p>
            </Link>

            <Link
              to="/report-summarizer"
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
            >
              <div className="text-4xl">
                📄
              </div>

              <h3 className="text-xl font-bold mt-4">
                Report Summarizer
              </h3>

              <p className="text-gray-500 mt-2">
                Understand medical reports using AI.
              </p>
            </Link>

            <Link
              to="/ai-chat"
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
            >
              <div className="text-4xl">
                🤖
              </div>

              <h3 className="text-xl font-bold mt-4">
                AI Health Chat
              </h3>

              <p className="text-gray-500 mt-2">
                Ask questions about your health.
              </p>
            </Link>

          </div>

        </div>

        {/* Health Tip */}
        <div className="mt-10 bg-blue-600 text-white p-6 rounded-2xl shadow-lg">

          <h2 className="text-xl font-bold">
            💡 Today's Health Tip
          </h2>

          <p className="mt-2 text-blue-100">
            Stay hydrated, eat a balanced diet, exercise regularly,
            and make time for proper sleep.
          </p>

        </div>

      </main>

    </div>
  );
}

export default PatientDashboard;