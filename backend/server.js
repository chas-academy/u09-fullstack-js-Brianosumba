const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const socketIo = require("socket.io");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// HTTP server and Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("A client is connected:", socket.id);

  socket.on("joinAdminRoom", () => {
    socket.join("admins");
    console.log("A client joined the admins room");
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  });
});

// Attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/users", require("./src/routes/user"));
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/recommendations", require("./src/routes/recommendationRoutes"));
app.use("/api/exercises", require("./src/routes/exerciseRoutes"));
app.use("/api/progress", require("./src/routes/progressRoutes"));

// Check if MongoDB URI is set
if (!process.env.MONGODB_URI) {
  console.error(
    "MONGODB_URI is not set. Please check your environment variables."
  );
  process.exit(1); // Exit the process if URI is not set
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, // Recommended for better parsing
    useUnifiedTopology: true, // Recommended for modern connection management
  })
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit the process if connection fails
  });

// Monitor MongoDB connection events
mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established.");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB connection lost.");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  } catch (err) {
    console.error("Error during shutdown:", err.message);
    process.exit(1);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
