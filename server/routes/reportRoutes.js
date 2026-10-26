const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  summarizeReport,
  getPatientReports,
} = require("../controllers/reportController");

const upload = multer({
  dest: "uploads/reports/",
});

router.post(
  "/summarize",
  upload.single("report"),
  summarizeReport
);

// Get reports for a patient
router.get("/patient/:patientId", getPatientReports);

module.exports = router;