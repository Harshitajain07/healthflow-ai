
const express = require("express");

const {
  sendMessage,
  getChatHistory,
  getConversations,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/send", sendMessage);
router.get("/history/:patientId", getChatHistory);
router.get("/conversations/:patientId", getConversations);

module.exports = router;
