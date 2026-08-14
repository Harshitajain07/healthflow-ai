const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
      "Pending",
      "Approved",
      "Rejected",
      "Cancelled",
  ],
  default: "Pending",
  }
  },


  {
    timestamps: true,
  }
);

console.log("Appointment model loaded");
console.log(appointmentSchema.path("status").enumValues);

module.exports = mongoose.model("Appointment", appointmentSchema);