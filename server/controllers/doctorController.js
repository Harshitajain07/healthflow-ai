const User = require("../models/User");

// ============================
// Get All Doctors
// ============================
const getDoctors = async (req, res) => {
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
};

module.exports = {
  getDoctors,
};