console.log("✅ appointmentRoutes Loaded");

const express = require("express");
const router = express.Router();

console.log("✅ appointmentRoutes Loaded");

router.get("/test", (req, res) => {
  res.json({ message: "Appointment Route Working ✅" });
});

const {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  getAppointmentStats,
} = require("../controllers/appointmentController");

router.post("/book", bookAppointment);
router.get("/", getAppointments);
router.put("/cancel/:id", cancelAppointment);
router.put("/status/:id", updateAppointmentStatus);
router.get("/stats", getAppointmentStats);

module.exports = router;