const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

console.log("✅ patientRoutes loaded");

// ============================
// Get All Patients
// ============================
router.get("/", async (req, res) => {
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
      message: error.message,
    });
  }
});


// ============================
// Get Patient Profile
// ============================
router.get("/:id", async (req, res) => {
  try {
    const patient = await User.findById(req.params.id)
      .select("-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ============================
// Add Patient
// ============================
router.post("/", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const existingPatient = await User.findOne({ email });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = new User({
      fullName,
      email,
      password: hashedPassword,
      role: "patient",
    });

    await patient.save();

    res.status(201).json({
      success: true,
      message: "Patient Added Successfully ✅",
    });

  } catch (error) {
    console.error("Add Patient Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ============================
// Update Patient
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { fullName, email } = req.body;

    const patient = await User.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    patient.fullName = fullName;
    patient.email = email;

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Patient Updated Successfully ✅",
    });

  } catch (error) {
    console.error("Update Patient Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ============================
// Delete Patient
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const patient = await User.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Patient Deleted Successfully ✅",
    });

  } catch (error) {
    console.error("Delete Patient Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


module.exports = router;