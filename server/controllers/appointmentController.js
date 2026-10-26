
const Appointment = require("../models/Appointment");


 
 // ============================
 // Book Appointment - Protected
 // ============================
const bookAppointment = async (req, res) => {
  try {
    const {
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
    } = req.body;

    // Always use the logged-in user's ID.
    // Never trust a patient ID supplied by the frontend.
    const patient = req.user.id;

    if (!doctor || !appointmentDate || !appointmentTime || !reason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide the doctor, date, time, and reason.",
      });
    }

    const newAppointment = new Appointment({
      patient,
      doctor,
      appointmentDate,
      appointmentTime,
      reason: reason.trim(),
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment Booked Successfully ✅",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Book Appointment Error:", error);

    res.status(500).json({
      success: false,
      message: "Error booking appointment",
      error: error.message,
    });
  }
};



// ============================
// Get All Appointments
// ============================
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "fullName email")
      .populate("doctor", "fullName email");

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

// ============================
// Cancel Appointment
// ============================
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // ============================
    // Ownership Protection
    // ============================

    const userId = req.user.id;
    const userRole = req.user.role;

    // Patient can cancel only their own appointment
    if (
      userRole === "patient" &&
      appointment.patient.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own appointments.",
      });
    }

    // Doctor can cancel only appointments assigned to them
    if (
      userRole === "doctor" &&
      appointment.doctor.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own assigned appointments.",
      });
    }

    // Only patients and doctors can cancel
    if (!["patient", "doctor"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to cancel appointments.",
      });
    }

    // Prevent cancelling an already cancelled appointment
    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This appointment is already cancelled.",
      });
    }

    // Cancel appointment
    appointment.status = "Cancelled";

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment Cancelled Successfully ✅",
      appointment,
    });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Update Appointment Status
// ============================
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Allowed appointment statuses
    const allowedStatuses = [
      "Pending",
      "Approved",
      "Rejected",
      "Cancelled",
    ];

    // Validate status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status.",
      });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Doctor ownership protection
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only manage your own appointments.",
      });
    }

    // Update status
    appointment.status = status;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment ${status} Successfully ✅`,
      appointment,
    });
  } catch (error) {
    console.error("Update Appointment Status Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Pay Appointment
// ============================
const payAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    // Patient ownership protection
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only pay for your own appointments.",
      });
    }

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Only approved appointments can be paid
    if (appointment.status !== "Approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved appointments can be paid for.",
      });
    }

    // Prevent duplicate payment
    if (appointment.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "This appointment has already been paid.",
      });
    }

    // Mark payment as successful
    appointment.paymentStatus = "Paid";

    // Consultation fee
    appointment.paymentAmount = appointment.fee || 500;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Payment successful ✅",
      appointment,
    });
  } catch (error) {
    console.error("Payment Error:", error);

    res.status(500).json({
      success: false,
      message: "Payment failed",
      error: error.message,
    });
  }
};

// ============================
// Appointment Statistics
// ============================
const getAppointmentStats = async (req, res) => {
  try {
    const { doctorId } = req.query;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const total = await Appointment.countDocuments({
      doctor: doctorId,
    });

    const pending = await Appointment.countDocuments({
      doctor: doctorId,
      status: "Pending",
    });

    const approved = await Appointment.countDocuments({
      doctor: doctorId,
      status: "Approved",
    });

    const rejected = await Appointment.countDocuments({
      doctor: doctorId,
      status: "Rejected",
    });

    const cancelled = await Appointment.countDocuments({
      doctor: doctorId,
      status: "Cancelled",
    });

    res.status(200).json({
      success: true,
      total,
      pending,
      approved,
      rejected,
      cancelled,
    });
  } catch (error) {
    console.error("Appointment Stats Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Export Functions
// ============================
module.exports = {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  getAppointmentStats,
  payAppointment,
};