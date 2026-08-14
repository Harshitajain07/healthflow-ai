const Chat = require("../models/Chat");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ================= SEND MESSAGE =================
const sendMessage = async (req, res) => {
  try {
    const { patientId, message } = req.body;

    if (!patientId || !message) {
      return res.status(400).json({
        success: false,
        message: "Patient ID and message are required.",
      });
    }

    // Save User Message
    await Chat.create({
      patient: patientId,
      role: "user",
      message,
    });

    // Gemini Model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are HealthFlow AI.

You are a professional healthcare assistant.

Patient says:

${message}

Give a helpful response.

Always remind the patient that this is not a medical diagnosis.
`;

    console.log("Sending request to Gemini...");

    const result = await model.generateContent(prompt);

    console.log("Gemini replied successfully.");

    const reply = result.response.text();

    // Save AI Reply
    await Chat.create({
      patient: patientId,
      role: "assistant",
      message: reply,
    });

    res.json({
      success: true,
      reply,
    });

  } catch (error) {
    console.log("========== GEMINI ERROR ==========");
    console.log(error);
    console.log("=================================");

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= CHAT HISTORY =================
const getChatHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    const chats = await Chat.find({
      patient: patientId,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      chats,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= EXPORTS =================
module.exports = {
  sendMessage,
  getChatHistory,
};