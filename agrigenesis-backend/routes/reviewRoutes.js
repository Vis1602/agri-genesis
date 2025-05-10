const express = require("express");
const router = express.Router();
const Review = require("../models/reviewModel");
const { protect } = require("../middleware/authMiddleware");
const { ErrorResponse } = require("../middleware/errorMiddleware");

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
router.post("/", protect, async (req, res, next) => {
  try {
    // Add user and expert to body
    req.body.user = req.user.id;
    req.body.expert = req.body.expertId;

    // Check for existing review
    const existingReview = await Review.findOne({
      user: req.user.id,
      expert: req.body.expertId,
    });

    if (existingReview) {
      return next(
        new ErrorResponse("You have already reviewed this expert", 400)
      );
    }

    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
});

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
router.get("/", async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("expert", "name expertise");

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get reviews for specific expert
// @route   GET /api/reviews/expert/:expertId
// @access  Public
router.get("/expert/:expertId", async (req, res, next) => {
  try {
    const reviews = await Review.find({ expert: req.params.expertId })
      .populate("user", "name")
      .populate("expert", "name expertise");

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
router.put("/:id", protect, async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return next(new ErrorResponse("Review not found", 404));
    }

    // Make sure review belongs to user
    if (review.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse("Not authorized to update this review", 401)
      );
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(new ErrorResponse("Review not found", 404));
    }

    // Make sure review belongs to user
    if (review.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse("Not authorized to delete this review", 401)
      );
    }

    await review.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
