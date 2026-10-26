console.log("✅ authRoutes.js loaded");

const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserStats,
  changePassword,
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
router.put("/change-password", changePassword);
// ============================
// Test Route
// ============================
router.get("/test", (req, res) => {
  res.json({
    message: "Auth Routes Working ✅",
  });
});

module.exports = router;