const express = require("express");
const router = express.Router();
const { getChatHistory } = require("../controllers/chatController");

// Get chat history for a room
// Use a parameterized route that can handle any string including colons
router.get("/:room", getChatHistory);

module.exports = router;
