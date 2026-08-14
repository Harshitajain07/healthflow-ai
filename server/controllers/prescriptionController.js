const fs = require("fs");

const Prescription = require("../models/Prescription");

const { extractTextFromImage } = require("../services/ocrService");
const { analyzePrescription } = require("../services/prescriptionAI");

const analyzePrescriptionController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a prescription.",
      });
    }

    // Uploaded image path
    const imagePath = req.file.path;

    // OCR
    const extractedText = await extractTextFromImage(imagePath);

    console.log("========== OCR TEXT ==========");
    console.log(extractedText);
    console.log("==============================");

    // Gemini AI
    const aiAnalysis = await analyzePrescription(extractedText);

    // Temporary patient ID
    const patientId = "64af70e2caafbd297b19844c";

    // Save to MongoDB
    await Prescription.create({
      patient: patientId,
      fileName: req.file.originalname,
      extractedText,
      aiAnalysis,
    });

    // Delete uploaded file
    fs.unlinkSync(imagePath);

    res.json({
      success: true,
      analysis: aiAnalysis,
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
  analyzePrescriptionController,
};