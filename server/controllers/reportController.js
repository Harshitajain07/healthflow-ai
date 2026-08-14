const fs = require("fs");

const { extractPDFText } = require("../services/pdfService");
const { analyzeMedicalReport } = require("../services/geminiService");

const MedicalReport = require("../models/MedicalReport");

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

    const User = require("../models/User");

  const patient = await User.findOne({ role: "patient" });

  if (!patient) {
  return res.status(404).json({
    success: false,
    message: "No patient found.",
  });
}

    const patientId = patient._id;

    console.log("req.body =", req.body);
    console.log("patientId =", patientId);
    console.log("req.file =", req.file);

    await MedicalReport.create({
        patient: patientId,
        fileName: req.file.originalname,
        extractedText: reportText,
        aiSummary: summary,
    });

    // Delete uploaded file after processing
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

module.exports = {
  summarizeReport,
};