const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const http = require("http");
const socketIo = require("socket.io");

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// CORS setup for Express routes
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from your frontend
  credentials: true, // Allow cookies and credentials to be sent
};
app.use(cors(corsOptions)); // Use CORS middleware with these options

// Create an HTTP server and initialize Socket.IO with CORS options
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Allow your frontend to connect to Socket.IO
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A client is connected:", socket.id);

  // Allow clients to join the admins room
  socket.on("joinAdminRoom", () => {
    socket.join("admins");
    console.log("A client joined the admins room");
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  });
});

// Middleware to attach io to req so it can be accessed in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Import and use routes
const userRoutes = require("./src/routes/user");
const authRoutes = require("./src/routes/auth");
const exerciseRoutes = require("./src/routes/exercise");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
