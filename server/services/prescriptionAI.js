const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzePrescription = async (text) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an experienced medical AI assistant.

Analyze this prescription.

${text}

Return exactly in this format:

🩺 Prescription Summary

Patient Name:

Doctor Name:

Medicines:

Medicine:
Dosage:
Morning/Afternoon/Night:

Medicine:
Dosage:

Duration:

Warnings:

Possible Side Effects:

Food Instructions:

Medical Disclaimer:
This is not a substitute for professional medical advice.
`;

    const result = await model.generateContent(prompt);

    return result.response.text();

  } catch (error) {
    console.error("Gemini Error:", error);

    if (error.message.includes("503")) {
      throw new Error(
        "Gemini AI is currently busy. Please wait 1-2 minutes and try again."
      );
    }

    throw error;
  }
};

module.exports = {
  analyzePrescription,
};