const express = require("express");

const {
  sendMessage,
} = require("../controllers/chatController");

const router = express.Router();

// Send Message to AI
router.post("/send", sendMessage);

module.exports = router;