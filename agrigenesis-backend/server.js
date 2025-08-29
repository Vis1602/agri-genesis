const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const chatRoutes = require("./routes/chatRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
const http = require("http");
const { Server } = require("socket.io");
const { saveMessage } = require("./controllers/chatController");
const User = require("./models/userModel");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "https://agri-genesis.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

let activeUsers = {};

io.on("connection", (socket) => {
  // Join room
  socket.on("joinRoom", async ({ room, userId, userName }) => {
    socket.join(room);
    socket.room = room;
    socket.userId = userId;
    socket.userName = userName;
    if (!activeUsers[room]) activeUsers[room] = [];
    if (!activeUsers[room].some(u => u.userId === userId)) {
      activeUsers[room].push({ userId, userName });
    }
    io.to(room).emit("activeUsers", activeUsers[room]);
  });

  // Leave room
  socket.on("leaveRoom", ({ room, userId }) => {
    socket.leave(room);
    if (activeUsers[room]) {
      activeUsers[room] = activeUsers[room].filter(u => u.userId !== userId);
      io.to(room).emit("activeUsers", activeUsers[room]);
    }
  });

  // Handle message
  socket.on("chatMessage", async (data) => {
    // data: { room, sender, senderName, message, isAI }
    console.log("Received chat message:", data);
    const saved = await saveMessage(data);
    if (saved) {
      console.log("Message saved, broadcasting to room:", data.room);
      io.to(data.room).emit("chatMessage", saved);
    } else {
      console.error("Failed to save message:", data);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    const { room, userId } = socket;
    if (room && userId && activeUsers[room]) {
      activeUsers[room] = activeUsers[room].filter(u => u.userId !== userId);
      io.to(room).emit("activeUsers", activeUsers[room]);
    }
  });
});

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "https://agri-genesis.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/gemini", geminiRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
