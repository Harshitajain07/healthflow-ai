
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

console.log("patientRoutes loaded");

// Get all patients — admin only
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const patients = await User.find(
        { role: "patient" },
        "-password"
      );

      res.status(200).json({
        success: true,
        patients,
      });
    } catch (error) {
      console.error("Get Patients Error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to retrieve patients.",
      });
    }
  }
);

// Get a patient profile — patient can view own profile; admin can view any
router.get(
  "/:id",
  protect,
  authorizeRoles("patient", "admin"),
  async (req, res) => {
    try {
      if (
        req.user.role !== "admin" &&
        req.user.id !== req.params.id
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view this profile.",
        });
      }

      const patient = await User.findOne({
        _id: req.params.id,
        role: "patient",
      }).select("-password");

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found.",
        });
      }

      res.status(200).json({
        success: true,
        patient,
      });
    } catch (error) {
      console.error("Get Patient Profile Error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to retrieve patient profile.",
      });
    }
  }
);

// Add patient — admin only
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
          message: "Please fill in all fields.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingPatient = await User.findOne({
        email: normalizedEmail,
      });

      if (existingPatient) {
        return res.status(400).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const patient = await User.create({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "patient",
      });

      res.status(201).json({
        success: true,
        message: "Patient added successfully.",
        patient: {
          id: patient._id,
          fullName: patient.fullName,
          email: patient.email,
          role: patient.role,
        },
      });
    } catch (error) {
      console.error("Add Patient Error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to add patient.",
      });
    }
  }
);

// Update patient — patient can update own profile; admin can update any
router.put(
  "/:id",
  protect,
  authorizeRoles("patient", "admin"),
  async (req, res) => {
    try {
      if (
        req.user.role !== "admin" &&
        req.user.id !== req.params.id
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this profile.",
        });
      }

      const { fullName, email } = req.body;

      if (!fullName?.trim() || !email?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name and email are required.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const patient = await User.findOne({
        _id: req.params.id,
        role: "patient",
      });

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found.",
        });
      }

      const existingEmail = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: patient._id },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "This email address is already in use.",
        });
      }

      patient.fullName = fullName.trim();
      patient.email = normalizedEmail;

      await patient.save();

      res.status(200).json({
        success: true,
        message: "Patient profile updated successfully.",
        patient: {
          id: patient._id,
          fullName: patient.fullName,
          email: patient.email,
          role: patient.role,
        },
      });
    } catch (error) {
      console.error("Update Patient Error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to update patient profile.",
      });
    }
  }
);

// Delete patient — admin only
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const patient = await User.findOneAndDelete({
        _id: req.params.id,
        role: "patient",
      });

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Patient deleted successfully.",
      });
    } catch (error) {
      console.error("Delete Patient Error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to delete patient.",
      });
    }
  }
);

module.exports = router;
