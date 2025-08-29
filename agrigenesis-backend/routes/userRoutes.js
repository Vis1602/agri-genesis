const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/users
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, specialization } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      specialization: role === "expert" ? specialization : undefined,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Login user
// @route   POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Send response with user data and token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialization: user.specialization,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "An error occurred during login. Please try again.",
    });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }
});

// @desc    Get all experts
// @route   GET /api/users/experts
router.get("/experts", async (req, res) => {
  try {
    const experts = await User.find({ role: "expert" })
      .select("-password")
      .populate("ratings");
    res.json(experts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all farmers
// @route   GET /api/users/farmers
router.get("/farmers", async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" })
      .select("-password");
    res.json(farmers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
