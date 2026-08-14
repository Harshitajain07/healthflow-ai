const Appointment = require("../models/Appointment");

// ============================
// Book Appointment
// ============================
const bookAppointment = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
    } = req.body;

    const newAppointment = new Appointment({
      patient,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment Booked Successfully ✅",
      appointment: newAppointment,
    });

  } catch (error) {
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

// Cancel Appointment
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = "Cancelled";

    await appointment.save();

    res.status(200).json({
      message: "Appointment Cancelled Successfully ✅",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Update Appointment Status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = status;

    await appointment.save();

    res.status(200).json({
      message: `Appointment ${status} Successfully ✅`,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ============================
// Appointment Statistics
// ============================
const getAppointmentStats = async (req, res) => {
  try {
    const total = await Appointment.countDocuments();

    const pending = await Appointment.countDocuments({
      status: "Pending",
    });

    const approved = await Appointment.countDocuments({
      status: "Approved",
    });

    const rejected = await Appointment.countDocuments({
      status: "Rejected",
    });

    const cancelled = await Appointment.countDocuments({
      status: "Cancelled",
    });

    res.json({
      total,
      pending,
      approved,
      rejected,
      cancelled,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  getAppointmentStats,

};