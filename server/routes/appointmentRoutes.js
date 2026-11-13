
console.log("appointmentRoutes loaded");

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

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Test route
router.get("/test", (req, res) =>
  res.json({ message: "Appointment Route Working" })
);

// Book appointment — patients only
router.post(
  "/book",
  protect,
  authorizeRoles("patient"),
  bookAppointment
);

// Get appointments — authenticated users
router.get(
  "/",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getAppointments
);

// Appointment statistics — doctors only
router.get(
  "/stats",
  protect,
  authorizeRoles("doctor"),
  getAppointmentStats
);

// Cancel appointment — patients and doctors
router.put(
  "/cancel/:id",
  protect,
  authorizeRoles("patient", "doctor"),
  cancelAppointment
);

// Update appointment status — assigned doctor
router.put(
  "/status/:id",
  protect,
  authorizeRoles("doctor"),
  updateAppointmentStatus
);

// Mark appointment as paid — patients only
router.put(
  "/pay/:id",
  protect,
  authorizeRoles("patient"),
  payAppointment
);

module.exports = router;
