
const express = require("express");

const {
  sendMessage,
  getChatHistory,
  getConversations,
} = require("../controllers/chatController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Only authenticated patients can access their AI chat.
router.use(protect, authorizeRoles("patient"));

router.post("/send", sendMessage);
router.get("/history/:patientId", getChatHistory);
router.get("/conversations/:patientId", getConversations);

module.exports = router;

