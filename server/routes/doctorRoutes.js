console.log("✅ doctorRoutes loaded");

const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ============================
// Get All Doctors
// ============================
router.get("/", async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================
// Add Doctor
// ============================
router.post("/", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if doctor already exists
    const existingDoctor = await User.findOne({ email });

    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create doctor
    const doctor = new User({
      fullName,
      email,
      password: hashedPassword,
      role: "doctor",
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor Added Successfully ✅",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================
// Update Doctor
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email } = req.body;

    const doctor = await User.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.fullName = fullName;
    doctor.email = email;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor Updated Successfully ✅",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================
// Delete Doctor
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Doctor Deleted Successfully ✅",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


module.exports = router;