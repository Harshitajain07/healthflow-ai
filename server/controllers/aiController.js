const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({
        success: false,
        message: "Please enter symptoms.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an experienced doctor.

Patient symptoms:
${symptoms}

Provide your response exactly in this format:

🤖 AI Health Analysis

Possible Conditions:
...

Recommended Specialist:
...

Severity:
...

General Advice:
...

Medical Disclaimer:
This is not a diagnosis. Please consult a qualified healthcare professional.
`,
    });

    res.json({
      success: true,
      result: response.text,
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
  analyzeSymptoms,
};