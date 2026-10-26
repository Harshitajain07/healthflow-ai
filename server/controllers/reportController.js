const fs = require("fs");

const { extractPDFText } = require("../services/pdfService");
const { analyzeMedicalReport } = require("../services/geminiService");

const MedicalReport = require("../models/MedicalReport");
const User = require("../models/User");

// ============================
// Summarize Medical Report
// ============================
const summarizeReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a report.",
      });
    }

    // Get uploaded file path
    const filePath = req.file.path;

    // Extract text from PDF
    const reportText = await extractPDFText(filePath);

    // Analyze with Gemini
    const summary = await analyzeMedicalReport(reportText);

    // Get patient ID from frontend
    const patientId = req.body.patient;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient information not found.",
      });
    }

    // Check patient exists
    const patient = await User.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    console.log("patientId =", patientId);
    console.log("req.file =", req.file);

    // Save report
    await MedicalReport.create({
      patient: patientId,
      fileName: req.file.originalname,
      extractedText: reportText,
      aiSummary: summary,
    });

    // Delete uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      summary,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Get Patient Reports
// ============================
const getPatientReports = async (req, res) => {
  try {
    const { patientId } = req.params;

    const reports = await MedicalReport.find({
      patient: patientId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reports,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  summarizeReport,
  getPatientReports,
};