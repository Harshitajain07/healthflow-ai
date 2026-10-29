
const Chat = require("../models/Chat");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { randomUUID } = require("crypto");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Disable browser and intermediary caching for chat API responses.
const disableCache = (res) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });
};

// Validate MongoDB patient IDs.
const isValidPatientId = (patientId) => {
  return mongoose.Types.ObjectId.isValid(patientId);
};

// Retry temporary Gemini failures up to 3 attempts.
const generateWithRetry = async (model, prompt, maxAttempts = 3) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (error) {
      const status = error.status || error.statusCode;
      const errorText = `${error.message || ""} ${error.statusText || ""}`;

      const isTemporary =
        [429, 500, 502, 503, 504].includes(status) ||
        /high demand|temporarily unavailable|overloaded|timeout|timed out/i.test(
          errorText
        );

      if (!isTemporary || attempt === maxAttempts) {
        throw error;
      }

      const delay = attempt * 1000;

      console.log(
        `Gemini temporarily unavailable. Retrying in ${delay / 1000}s...`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// ================= SEND MESSAGE =================
const sendMessage = async (req, res) => {
  disableCache(res);

  try {
    const { patientId, message } = req.body;

    if (!patientId || !isValidPatientId(patientId)) {
      return res.status(400).json({
        success: false,
        message: "A valid patient ID is required.",
      });
    }

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty.",
      });
    }

    const cleanMessage = message.trim();

    const conversationId =
      typeof req.body.conversationId === "string" &&
      req.body.conversationId.trim()
        ? req.body.conversationId.trim()
        : randomUUID();

    // Verify that an existing conversation belongs to this patient.
    const existingConversation = await Chat.findOne({
      patient: patientId,
      conversationId,
    });

    if (req.body.conversationId && !existingConversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    // Load recent messages for Gemini conversation context.
    const previousMessages = await Chat.find({
      patient: patientId,
      conversationId,
    })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    previousMessages.reverse();

    const conversationContext = previousMessages
      .map((chat) => {
        const speaker = chat.role === "user" ? "Patient" : "HealthFlow AI";
        return `${speaker}: ${chat.message}`;
      })
      .join("\n\n");

    // Save the patient's message.
    await Chat.create({
      patient: patientId,
      conversationId,
      role: "user",
      message: cleanMessage,
    });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are HealthFlow AI, a professional healthcare information assistant.

Conversation so far:
${conversationContext || "(This is the beginning of the conversation.)"}

Patient's latest message:
${cleanMessage}

Provide a clear, helpful response using simple language.
Use headings and bullet points when useful.

Important safety guidelines:
- Do not claim to diagnose the patient.
- Do not prescribe medication or recommend changing prescribed treatment.
- Explain when the patient should consult a qualified healthcare professional.
- If the patient describes potentially life-threatening symptoms, advise them to seek emergency medical care immediately.
- Remind the patient that your response is general information, not a medical diagnosis.
`;

    console.log("Sending request to Gemini...");

    const result = await generateWithRetry(model, prompt);
    const reply = result.response.text();

    // Save the AI response.
    await Chat.create({
      patient: patientId,
      conversationId,
      role: "assistant",
      message: reply,
    });

    return res.status(200).json({
      success: true,
      reply,
      conversationId,
    });
  } catch (error) {
    console.error("Chat controller error:", error);

    const status = error.status || error.statusCode;
    const errorText = `${error.message || ""} ${error.statusText || ""}`;

    const isTemporary =
      [429, 500, 502, 503, 504].includes(status) ||
      /high demand|temporarily unavailable|overloaded|timeout|timed out/i.test(
        errorText
      );

    if (isTemporary) {
      return res.status(503).json({
        success: false,
        message:
          "The AI assistant is temporarily busy. Please try again in a minute.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "We couldn't process your request right now. Please try again.",
    });
  }
};

// ================= CHAT HISTORY =================
const getChatHistory = async (req, res) => {
  disableCache(res);

  try {
    const { patientId } = req.params;
    const { conversationId } = req.query;

    if (!patientId || !isValidPatientId(patientId)) {
      return res.status(400).json({
        success: false,
        message: "A valid patient ID is required.",
      });
    }

    if (!conversationId || typeof conversationId !== "string") {
      return res.status(400).json({
        success: false,
        message: "A conversation ID is required.",
      });
    }

    const chats = await Chat.find({
      patient: patientId,
      conversationId,
    })
      .sort({ createdAt: 1 })
      .lean();

    if (chats.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No messages found for this conversation.",
        chats: [],
      });
    }

    console.log(
      `Loaded ${chats.length} messages for conversation ${conversationId}`
    );

    return res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("Error loading chat history:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load chat history right now.",
    });
  }
};

// ================= SAVED CONVERSATIONS =================
const getConversations = async (req, res) => {
  disableCache(res);

  try {
    const { patientId } = req.params;

    if (!patientId || !isValidPatientId(patientId)) {
      return res.status(400).json({
        success: false,
        message: "A valid patient ID is required.",
      });
    }

    const chats = await Chat.aggregate([
      {
        $match: {
          patient: new mongoose.Types.ObjectId(patientId),
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: "$conversationId",
          firstMessage: { $first: "$message" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $last: "$createdAt" },
          messageCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);

    const conversations = chats.map((chat) => {
      const title = chat.firstMessage || "Health conversation";

      return {
        conversationId: chat._id,
        title:
          title.length > 45
            ? `${title.slice(0, 45)}...`
            : title,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        messageCount: chat.messageCount,
      };
    });

    console.log(
      `Loaded ${conversations.length} conversations for patient ${patientId}`
    );

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Error loading conversations:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load saved conversations right now.",
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getConversations,
};
