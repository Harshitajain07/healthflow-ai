const Tesseract = require("tesseract.js");

const extractTextFromImage = async (imagePath) => {
  try {
    const result = await Tesseract.recognize(
      imagePath,
      "eng"
    );

    return result.data.text;
  } catch (error) {
    throw new Error("Failed to extract text from prescription.");
  }
};

module.exports = {
  extractTextFromImage,
};