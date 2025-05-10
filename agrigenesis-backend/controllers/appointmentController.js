const Appointment = require("../models/appointmentModel");
const { ErrorResponse } = require("../middleware/errorMiddleware");

// @desc    Get all appointments for a user (farmer or expert)
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [{ farmer: req.user._id }, { expert: req.user._id }],
    })
      .populate("farmer", "name email")
      .populate("expert", "name email specialization")
      .sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get a single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("farmer", "name email")
      .populate("expert", "name email specialization");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if the user is authorized to view this appointment
    if (
      appointment.farmer.toString() !== req.user._id.toString() &&
      appointment.expert.toString() !== req.user._id.toString()
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized to view this appointment" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  try {
    const { expertId, appointmentDate, mode, issue , number} = req.body;

    // Validate appointment date is in the future
    if (new Date(appointmentDate) <= new Date()) {
      return res
        .status(400)
        .json({ message: "Appointment date must be in the future" });
    }

    const appointment = await Appointment.create({
      farmer: req.user._id,
      expert: expertId,
      appointmentDate,
      mode,
      issue,
      number,
    });

    const populatedAppointment = await appointment.populate([
      { path: "farmer", select: "name email" },
      { path: "expert", select: "name email specialization" },
    ]);

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private/Expert
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify that the expert is assigned to this appointment
    if (appointment.expert.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this appointment" });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();

    const populatedAppointment = await updatedAppointment.populate([
      { path: "farmer", select: "name email" },
      { path: "expert", select: "name email specialization" },
    ]);

    res.json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Only allow cancellation if user is the farmer or expert
    if (
      appointment.farmer.toString() !== req.user._id.toString() &&
      appointment.expert.toString() !== req.user._id.toString()
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized to cancel this appointment" });
    }

    // Only allow cancellation of pending or confirmed appointments
    if (!["pending", "confirmed"].includes(appointment.status)) {
      return res
        .status(400)
        .json({ message: "Cannot cancel appointment in current status" });
    }

    appointment.status = "cancelled";
    const updatedAppointment = await appointment.save();

    const populatedAppointment = await updatedAppointment.populate([
      { path: "farmer", select: "name email" },
      { path: "expert", select: "name email specialization" },
    ]);

    res.json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get upcoming appointments
// @route   GET /api/appointments/upcoming
// @access  Private
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [{ farmer: req.user._id }, { expert: req.user._id }],
      appointmentDate: { $gt: new Date() },
      status: { $in: ["pending", "confirmed"] },
    })
      .populate("farmer", "name email")
      .populate("expert", "name email specialization")
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
