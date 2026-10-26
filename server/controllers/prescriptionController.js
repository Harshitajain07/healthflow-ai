const fs = require("fs");
const path = require("path");

const Prescription = require("../models/Prescription");

const { extractTextFromImage } = require("../services/ocrService");
const { analyzePrescription } = require("../services/prescriptionAI");

const analyzePrescriptionController = async (req, res) => {
  let uploadedFilePath = null;
  let convertedImagePaths = [];

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a prescription.",
      });
    }

    uploadedFilePath = req.file.path;

    console.log("Uploaded file:", req.file.originalname);
    console.log("File type:", req.file.mimetype);

    let imagePath;

    // ==========================================
    // PDF FILE
    // ==========================================

    if (req.file.mimetype === "application/pdf") {
      console.log("PDF detected. Converting PDF to image...");

      // pdf-to-img is an ES module, so we dynamically import it
      const { pdf } = await import("pdf-to-img");

      const document = await pdf(uploadedFilePath, {
        scale: 2,
      });

      let pageNumber = 1;

      for await (const image of document) {
        const imagePathForPage = path.join(
          path.dirname(uploadedFilePath),
          `${path.basename(
            uploadedFilePath,
            path.extname(uploadedFilePath)
          )}-page-${pageNumber}.png`
        );

        fs.writeFileSync(imagePathForPage, image);

        convertedImagePaths.push(imagePathForPage);

        pageNumber++;
      }

      await document.destroy();

      if (convertedImagePaths.length === 0) {
        throw new Error("Could not convert PDF into an image.");
      }

      console.log(
        `PDF converted successfully. Pages: ${convertedImagePaths.length}`
      );

      // For now, OCR the first page
      imagePath = convertedImagePaths[0];

    } else {
      // ==========================================
      // IMAGE FILE
      // ==========================================

      imagePath = uploadedFilePath;
    }

    // ==========================================
    // OCR
    // ==========================================

    console.log("Starting OCR...");

    const extractedText = await extractTextFromImage(imagePath);

    console.log("========== OCR TEXT ==========");
    console.log(extractedText);
    console.log("==============================");

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error(
        "No readable text was found in the prescription."
      );
    }

    // ==========================================
    // GEMINI AI
    // ==========================================

    console.log("Sending prescription text to AI...");

    const aiAnalysis = await analyzePrescription(extractedText);

    // ==========================================
    // TEMPORARY PATIENT ID
    // ==========================================

    const patientId = "64af70e2caafbd297b19844c";

    // ==========================================
    // SAVE TO MONGODB
    // ==========================================

    await Prescription.create({
      patient: patientId,
      fileName: req.file.originalname,
      extractedText,
      aiAnalysis,
    });

    // ==========================================
    // CLEAN UP
    // ==========================================

    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
    }

    for (const convertedPath of convertedImagePaths) {
      if (fs.existsSync(convertedPath)) {
        fs.unlinkSync(convertedPath);
      }
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    res.json({
      success: true,
      analysis: aiAnalysis,
      extractedText,
    });

  } catch (error) {
    console.error("Prescription analysis error:");
    console.error(error);

    // Clean uploaded file
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
      } catch (cleanupError) {
        console.error("Could not delete uploaded file:", cleanupError);
      }
    }

    // Clean converted images
    for (const convertedPath of convertedImagePaths) {
      if (fs.existsSync(convertedPath)) {
        try {
          fs.unlinkSync(convertedPath);
        } catch (cleanupError) {
          console.error(
            "Could not delete converted image:",
            cleanupError
          );
        }
      }
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  analyzePrescriptionController,
};