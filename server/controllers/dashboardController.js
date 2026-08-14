const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Prescription = require("../models/Prescription");

const getDashboardStats = async (req, res) => {
  try {
    // Get patient ID from URL
    const { patientId } = req.params;

    // Check if patient ID is provided
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required.",
      });
    }

    // Count patient's appointments
    const appointments = await Appointment.countDocuments({
      patient: patientId,
    });

    // Count total doctors
    const doctors = await Doctor.countDocuments();

    // Count patient's reports
    const reports = await Prescription.countDocuments({
      patient: patientId,
    });

    // Send response
    res.status(200).json({
      success: true,
      appointments,
      doctors,
      reports,
    });

  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};