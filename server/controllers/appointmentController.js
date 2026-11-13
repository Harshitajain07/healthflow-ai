
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// ============================
// Book Appointment
// ============================
const bookAppointment = async (req, res) => {
  try {
    const {
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
    } = req.body;

    const patient = req.user.id;

    if (
      !doctor ||
      !appointmentDate ||
      !appointmentTime ||
      !reason?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all appointment details.",
      });
    }

    const doctorExists = await User.findOne({
      _id: doctor,
      role: "doctor",
    });

    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: "Selected doctor was not found.",
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
      message: "Appointment booked successfully.",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Book Appointment Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to book appointment.",
    });
  }
};

// ============================
// Get Appointments
// ============================
const getAppointments = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "patient") {
      filter.patient = req.user.id;
    } else if (req.user.role === "doctor") {
      filter.doctor = req.user.id;
    }

    // Admins can see all appointments.
    const appointments = await Appointment.find(filter)
      .populate("patient", "fullName email")
      .populate("doctor", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Get Appointments Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch appointments.",
    });
  }
};

// ============================
// Cancel Appointment
// ============================
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    if (
      userRole === "patient" &&
      appointment.patient.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot cancel another patient's appointment.",
      });
    }

    if (
      userRole === "doctor" &&
      appointment.doctor.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot cancel this appointment.",
      });
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled.",
      });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to cancel appointment.",
    });
  }
};

// ============================
// Update Appointment Status
// Doctors only
// ============================
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Approved",
      "Rejected",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status.",
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this appointment.",
      });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Update Appointment Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update appointment status.",
    });
  }
};

// ============================
// Appointment Statistics
// Doctors can see their own statistics
// ============================
const getAppointmentStats = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const filter = { doctor: doctorId };

    const [
      total,
      pending,
      approved,
      rejected,
      cancelled,
    ] = await Promise.all([
      Appointment.countDocuments(filter),
      Appointment.countDocuments({
        ...filter,
        status: "Pending",
      }),
      Appointment.countDocuments({
        ...filter,
        status: "Approved",
      }),
      Appointment.countDocuments({
        ...filter,
        status: "Rejected",
      }),
      Appointment.countDocuments({
        ...filter,
        status: "Cancelled",
      }),
    ]);

    res.status(200).json({
      success: true,
      total,
      pending,
      approved,
      rejected,
      cancelled,
    });
  } catch (error) {
    console.error("Get Appointment Stats Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve appointment statistics.",
    });
  }
};

// ============================
// Pay Appointment
// Demo payment marking only
// ============================
const payAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You cannot pay for another patient's appointment.",
      });
    }

    if (appointment.status !== "Approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved appointments can be paid for.",
      });
    }

    if (appointment.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Appointment has already been paid for.",
      });
    }

    appointment.paymentStatus = "Paid";
    appointment.paymentAmount = appointment.fee || 500;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Demo payment marked as successful.",
      appointment,
      amount: appointment.paymentAmount,
    });
  } catch (error) {
    console.error("Pay Appointment Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to process payment.",
    });
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  getAppointmentStats,
  payAppointment,
};

