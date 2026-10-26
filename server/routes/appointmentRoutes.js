console.log("✅ appointmentRoutes Loaded");

const express = require("express");
const router = express.Router();

const {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  getAppointmentStats,
  payAppointment,
} = require("../controllers/appointmentController");

// Authentication middleware
const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Test route
router.get("/test", (req, res) =>
  res.json({ message: "Appointment Route Working ✅" })
);

// Book appointment
router.post(
  "/book",
  protect,
  authorizeRoles("patient"),
  bookAppointment
);

// Get appointments
router.get("/", getAppointments);

// Cancel appointment
router.put(
  "/cancel/:id",
  protect,
  authorizeRoles("patient", "doctor"),
  cancelAppointment
);

// Update status - Doctors only
router.put(
  "/status/:id",
  protect,
  authorizeRoles("doctor"),
  updateAppointmentStatus
);

// Appointment statistics
router.get("/stats", getAppointmentStats);

// Payment
router.put(
  "/pay/:id",
  protect,
  authorizeRoles("patient"),
  payAppointment
);
module.exports = router;