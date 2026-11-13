import { Link, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Patient pages
import PatientDashboard from "./pages/PatientDashboard";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";
import SymptomChecker from "./pages/SymptomChecker";
import AIPrescription from "./pages/AIPrescription";
import MedicalReportAI from "./pages/MedicalReportAI";
import AIChat from "./pages/AIChat";

// Doctor pages
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import ManageAppointments from "./pages/ManageAppointments";
import ManageDoctors from "./pages/ManageDoctors";
import ManagePatients from "./pages/ManagePatients";

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <p className="text-7xl font-bold text-teal-600">404</p>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        Page not found
      </h1>

      <p className="mt-2 text-slate-600">
        Sorry, the page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
      >
        Back to Home
      </Link>
    </main>
  );
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-appointment"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <BookAppointment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-appointments"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <MyAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-profile"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <MyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/symptom-checker"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <SymptomChecker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescription-reader"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <AIPrescription />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report-summarizer"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <MedicalReportAI />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-chat"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <AIChat />
          </ProtectedRoute>
        }
      />

      {/* Doctor routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor-appointments"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorAppointments />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-appointments"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-doctors"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageDoctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-patients"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManagePatients />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;