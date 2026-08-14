const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeMedicalReport = async (reportText) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an expert medical AI.

Analyze the following medical report carefully.

${reportText}

Return your answer in this exact format:

📄 Medical Report Summary

Patient Summary:
...

Abnormal Values:
...

Possible Conditions:
...

Recommended Specialist:
...

Lifestyle Advice:
...

Medical Disclaimer:
This AI analysis is for educational purposes only and is not a substitute for professional medical advice.
`,
    });

    return response.text;

  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

module.exports = {
  analyzeMedicalReport,
};

module.exports = {
  analyzeMedicalReport,
};