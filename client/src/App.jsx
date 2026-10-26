import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import PatientDashboard from "./pages/PatientDashboard";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";
import SymptomChecker from "./pages/SymptomChecker";
import AIPrescription from "./pages/AIPrescription";
import MedicalReportAI from "./pages/MedicalReportAI";
import AIChat from "./pages/AIChat";

import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";

import AdminDashboard from "./pages/AdminDashboard";
import ManageAppointments from "./pages/ManageAppointments";
import ManageDoctors from "./pages/ManageDoctors";
import ManagePatients from "./pages/ManagePatients";

function App() {
  return (
    <Routes>

      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient */}
      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/my-appointments" element={<MyAppointments />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/symptom-checker" element={<SymptomChecker />} />
      <Route path="/prescription-reader" element={<AIPrescription />} />
      <Route path="/report-summarizer" element={<MedicalReportAI />} />
      <Route path="/ai-chat" element={<AIChat />} />

      {/* Doctor */}
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/doctor-appointments" element={<DoctorAppointments />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/manage-appointments" element={<ManageAppointments />} />
      <Route path="/manage-doctors" element={<ManageDoctors />} />
      <Route path="/manage-patients" element={<ManagePatients />} />

    </Routes>
  );
}

export default App;