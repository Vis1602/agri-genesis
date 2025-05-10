const express = require("express");
const router = express.Router();
const { protect, isExpert } = require("../middleware/authMiddleware");
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  getUpcomingAppointments,
} = require("../controllers/appointmentController");

// Get all appointments for a user
router.get("/appointments", protect, getAppointments);

// Get upcoming appointments
router.get("/upcoming", protect, getUpcomingAppointments);

// Get a single appointment
router.get("/:id", protect, getAppointmentById);

// Create new appointment
router.post("/", protect, createAppointment);

// Update appointment status (expert only)
router.put("/:id/status", protect, isExpert, updateAppointmentStatus);

// Cancel appointment
router.put("/:id/cancel", protect, cancelAppointment);

module.exports = router;
