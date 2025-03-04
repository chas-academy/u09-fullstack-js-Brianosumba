const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io"); //  Use `Server` from `socket.io`

const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://fitnesstracker-app.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy does not allow this origin."));
      }
    },
    credentials: true,
  })
);

//  Create HTTP server & WebSocket instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

//  Attach `io` globally so controllers can access it
app.set("io", io);

//  WebSocket Events
io.on("connection", (socket) => {
  console.log("🔥 A client connected:", socket.id);

  socket.on("joinAdminRoom", () => {
    socket.join("admins");
    console.log("🔹 Client joined the admins room");
  });

  //  WebSocket event for real-time recommendation updates
  socket.on("recommendationUpdated", (data) => {
    console.log("📡 Sending real-time recommendation update:", data);
    io.emit("recommendationUpdated", data);
  });

  //  WebSocket event for workout deletions
  socket.on("workoutDeleted", (data) => {
    console.log("📡 Workout deleted, notifying users:", data);
    io.emit("workoutDeleted", data);
  });

  socket.on("disconnect", () => {
    console.log(" A client disconnected:", socket.id);
  });
});

//  Middleware to attach `io` to requests (if needed in routes)
app.use((req, res, next) => {
  req.io = io;
  next();
});

//  Routes
app.use("/api/users", require("./src/routes/user"));
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/recommendations", require("./src/routes/recommendationRoutes"));
app.use("/api/exercises", require("./src/routes/exerciseRoutes"));
app.use("/api/progress", require("./src/routes/progressRoutes"));

//  Check MongoDB connection
if (!process.env.MONGODB_URI) {
  console.error(
    " MONGODB_URI is not set. Please check your environment variables."
  );
  process.exit(1);
}

//  Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB Connected Successfully"))
  .catch((err) => {
    console.error(" MongoDB Connection Error:", err.message);
    process.exit(1);
  });

//  Monitor MongoDB connection
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connection established.");
});

mongoose.connection.on("error", (err) => {
  console.error(" MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB connection lost.");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("⚠️ Shutting down...");
  try {
    await mongoose.disconnect();
    console.log(" Disconnected from MongoDB.");
    server.close(() => {
      console.log(" Server closed.");
      process.exit(0);
    });
  } catch (err) {
    console.error(" Error during shutdown:", err.message);
    process.exit(1);
  }
});

//  Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
