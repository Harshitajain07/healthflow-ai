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

    // Consultation fee
    fee: {
      type: Number,
      required: true,
      default: 500,
      min: 0,
    },

    // Payment information
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    paymentAmount: {
      type: Number,
      default: 500,
      min: 0,
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
    },
  },
  {
    timestamps: true,
  }
);

console.log("Appointment model loaded");
console.log(appointmentSchema.path("status").enumValues);
console.log(appointmentSchema.path("paymentStatus").enumValues);

module.exports = mongoose.model("Appointment", appointmentSchema);