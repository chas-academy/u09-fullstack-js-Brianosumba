const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided or invalid format" });
  }

  const token = authHeader && authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check if the user is an admin
const verifyAdmin = async (req, res, next) => {
  try {
    console.log("Req.user in verifyAdmin:", req.user);

    const user = await User.findById(req.user.id);
    // Check if the authenticated user is an admin
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied, admin only" });
    }
    next(); // Proceed if the user is an admin
  } catch (error) {
    console.error("Error in verifyAdmin middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { verifyToken, verifyAdmin };
