console.log("✅ authRoutes.js loaded");

const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserStats,
} = require("../controllers/authController");

// ============================
// Register
// ============================
router.post("/register", registerUser);

// ============================
// Login
// ============================
router.post("/login", loginUser);

// ============================
// User Statistics
// ============================
router.get("/stats", getUserStats);

// ============================
// Test Route
// ============================
router.get("/test", (req, res) => {
  res.json({
    message: "Auth Routes Working ✅",
  });
});

module.exports = router;