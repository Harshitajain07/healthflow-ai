
console.log("authRoutes.js loaded");

const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserStats,
  changePassword,
} = require("../controllers/authController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Statistics — admin only
router.get(
  "/stats",
  protect,
  authorizeRoles("admin"),
  getUserStats
);

// Change password — authenticated users
router.put(
  "/change-password",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  changePassword
);

// Test route
router.get("/test", (req, res) => {
  res.json({
    message: "Auth Routes Working",
  });
});

module.exports = router;
