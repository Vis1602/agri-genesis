const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    mode: {
      type: String,
      enum: ["voice", "video"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
    },
    issue: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
