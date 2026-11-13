const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const errorHandler = require("./middleware/errorHandler");
const appEvents = require("./utils/events");

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Add it to your .env file.");
  process.exit(1);
}

const app = express();
const httpServer = http.createServer(app);

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Secure Connect and Communication Platform API is running",
    routes: {
      signup: "POST /api/auth/signup",
      login: "POST /api/auth/login",
      notes: "/api/notes"
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

// Socket.IO real-time chat
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomName) => {
    const room = String(roomName || "general").trim().slice(0, 50);
    socket.join(room);
    socket.emit("joinedRoom", { room, socketId: socket.id });
    console.log(`${socket.id} joined room ${room}`);
  });

  socket.on("chatMessage", (payload = {}) => {
    const room = String(payload.room || "general").trim().slice(0, 50);
    const message = String(payload.message || "").trim().slice(0, 1000);

    if (!message) return;

    const chatData = {
      room,
      message,
      sender: String(payload.sender || "Guest").slice(0, 30),
      sentAt: new Date().toISOString()
    };

    appEvents.emit("chatMessage", chatData);
    io.to(room).emit("newMessage", chatData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log("Socket.IO chat is ready");
    });
  })
  .catch((error) => {
    console.error("Unable to start application:", error.message);
    process.exit(1);
  });
