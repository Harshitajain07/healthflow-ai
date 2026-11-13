
console.log("doctorRoutes loaded");

const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// ======================================
// Get All Doctors
// Admin, Patient and Doctor Access
// ======================================
router.get(
  "/",
  protect,
  authorizeRoles("admin", "patient", "doctor"),
  async (req, res) => {
    try {
      const doctors = await User.find(
        { role: "doctor" },
        "-password"
      );

      res.status(200).json({
        success: true,
        doctors,
      });
    } catch (error) {
      console.error("Get Doctors Error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to retrieve doctors.",
      });
    }
  }
);

// ======================================
// Add Doctor — Admin Only
// ======================================
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { fullName, email, password } = req.body;

      if (!fullName?.trim() || !email?.trim() || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide all doctor details.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingDoctor = await User.findOne({
        email: normalizedEmail,
      });

      if (existingDoctor) {
        return res.status(400).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const doctor = await User.create({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "doctor",
      });

      res.status(201).json({
        success: true,
        message: "Doctor added successfully.",
        doctor: {
          id: doctor._id,
          fullName: doctor.fullName,
          email: doctor.email,
          role: doctor.role,
        },
      });
    } catch (error) {
      console.error("Add Doctor Error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to add doctor.",
      });
    }
  }
);

// ======================================
// Update Doctor — Admin Only
// ======================================
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { fullName, email } = req.body;

      if (!fullName?.trim() || !email?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name and email are required.",
        });
      }

      const doctor = await User.findOne({
        _id: req.params.id,
        role: "doctor",
      });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingEmail = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: doctor._id },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "This email address is already in use.",
        });
      }

      doctor.fullName = fullName.trim();
      doctor.email = normalizedEmail;

      await doctor.save();

      res.status(200).json({
        success: true,
        message: "Doctor updated successfully.",
        doctor: {
          id: doctor._id,
          fullName: doctor.fullName,
          email: doctor.email,
          role: doctor.role,
        },
      });
    } catch (error) {
      console.error("Update Doctor Error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to update doctor.",
      });
    }
  }
);

// ======================================
// Delete Doctor — Admin Only
// ======================================
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const doctor = await User.findOneAndDelete({
        _id: req.params.id,
        role: "doctor",
      });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Doctor deleted successfully.",
      });
    } catch (error) {
      console.error("Delete Doctor Error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to delete doctor.",
      });
    }
  }
);

module.exports = router;
