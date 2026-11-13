
const Chat = require("../models/Chat");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { randomUUID } = require("crypto");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Prevent private chat history from being cached.
const disableCache = (res) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    Pragma: "no-cache",
    Expires: "0",
  });
};

// Validate the authenticated patient's ID.
const isValidPatientId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Retry temporary Gemini API failures.
const generateWithRetry = async (model, prompt, maxAttempts = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (error) {
      lastError = error;

      const status = error.status || error.statusCode;
      const errorMessage = String(error.message || "").toLowerCase();

      const isTemporaryError =
        [429, 500, 502, 503, 504].includes(status) ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("overloaded") ||
        errorMessage.includes("temporarily unavailable");

      if (!isTemporaryError || attempt === maxAttempts) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, attempt * 1500)
      );
    }
  }

  throw lastError;
};

// Send a message to HealthFlow AI.
const sendMessage = async (req, res) => {
  try {
    disableCache(res);

    const patientId = req.user?.id;
    const { message, conversationId } = req.body;

    if (!isValidPatientId(patientId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authenticated user.",
      });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message.",
      });
    }

    if (message.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Message is too long. Please keep it under 5000 characters.",
      });
    }

    const activeConversationId = conversationId || randomUUID();

    // Verify that an existing conversation belongs to this patient.
    if (conversationId) {
      const existingConversation = await Chat.findOne({
        patient: patientId,
        conversationId: activeConversationId,
      });

      if (!existingConversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found.",
        });
      }
    }

    // Load previous messages for AI context.
    const previousMessages = await Chat.find({
      patient: patientId,
      conversationId: activeConversationId,
    })
      .sort({ createdAt: -1 })
      .limit(12);

    previousMessages.reverse();

    // Save the user's message.
    await Chat.create({
      patient: patientId,
      conversationId: activeConversationId,
      role: "user",
      message: message.trim(),
    });

    const conversationHistory = previousMessages.map((chat) => {
      return `${chat.role === "assistant" ? "Assistant" : "User"}: ${chat.message}`;
    });

    const prompt = `
You are HealthFlow AI, a helpful healthcare information assistant.

Follow these instructions:
- Give clear, friendly and easy-to-understand health information.
- Do not claim to diagnose diseases or replace a qualified doctor.
- Encourage users to consult a healthcare professional for medical concerns.
- For emergencies or potentially life-threatening symptoms, advise the user to seek emergency medical care immediately.
- Do not recommend prescription medicines or specific dosages.
- Explain medical terms in simple language.
- Be respectful, careful, and avoid unsupported claims.

Previous conversation:
${conversationHistory.join("\n")}

User: ${message.trim()}

Assistant:
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await generateWithRetry(model, prompt);
    const reply = result.response.text();

    // Save the AI response.
    await Chat.create({
      patient: patientId,
      conversationId: activeConversationId,
      role: "assistant",
      message: reply,
    });

    return res.status(200).json({
      success: true,
      reply,
      conversationId: activeConversationId,
    });
  } catch (error) {
    console.error("AI Chat Error:", error);

    const status = error.status || error.statusCode;
    const errorMessage = String(error.message || "").toLowerCase();

    const isTemporaryError =
      [429, 500, 502, 503, 504].includes(status) ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("overloaded");

    return res.status(isTemporaryError ? 503 : 500).json({
      success: false,
      message: isTemporaryError
        ? "The AI assistant is temporarily busy. Please try again shortly."
        : "Unable to process your message right now.",
    });
  }
};

// Get one conversation's messages.
const getChatHistory = async (req, res) => {
  try {
    disableCache(res);

    const patientId = req.user?.id;
    const { conversationId } = req.query;

    if (!isValidPatientId(patientId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authenticated user.",
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required.",
      });
    }

    const chats = await Chat.find({
      patient: patientId,
      conversationId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("Get Chat History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load chat history.",
    });
  }
};

// Get all conversations with titles based on their first user message.
const getConversations = async (req, res) => {
  try {
    disableCache(res);

    const patientId = req.user?.id;

    if (!isValidPatientId(patientId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authenticated user.",
      });
    }

    const conversations = await Chat.aggregate([
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

          // Use the first user message as the chat title.
          title: {
            $first: {
              $cond: [
                { $eq: ["$role", "user"] },
                "$message",
                null,
              ],
            },
          },

          lastMessage: {
            $last: "$message",
          },

          lastMessageAt: {
            $last: "$createdAt",
          },

          messageCount: {
            $sum: 1,
          },
        },
      },
      {
        $addFields: {
          title: {
            $substrCP: [
              { $ifNull: ["$title", "New Conversation"] },
              0,
              55,
            ],
          },
        },
      },
      {
        $sort: {
          lastMessageAt: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get Conversations Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load conversations.",
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getConversations,
};

