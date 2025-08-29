const ChatMessage = require("../models/chatModel");

// Fetch chat history for a room
exports.getChatHistory = async (req, res) => {
  try {
    const { room } = req.params;
    
    // Decode the URL-encoded room parameter
    const decodedRoom = decodeURIComponent(room);
    
    // Validate room parameter
    if (!decodedRoom || decodedRoom.trim() === '') {
      return res.status(400).json({ error: "Room parameter is required" });
    }
    
    console.log(`Fetching chat history for room: ${decodedRoom}`);
    const messages = await ChatMessage.find({ room: decodedRoom }).sort({ createdAt: 1 });
    console.log(`Found ${messages.length} messages for room: ${decodedRoom}`);
    res.json(messages);
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

// Save a new message
exports.saveMessage = async (data) => {
  try {
    // Validate required fields
    if (!data.room || !data.senderName || !data.message) {
      console.error("Missing required fields for chat message:", data);
      return null;
    }
    
    console.log(`Saving message to room: ${data.room}`);
    const message = new ChatMessage(data);
    const savedMessage = await message.save();
    console.log(`Message saved with ID: ${savedMessage._id}`);
    return savedMessage;
  } catch (err) {
    console.error("Error saving chat message:", err);
    return null;
  }
};
