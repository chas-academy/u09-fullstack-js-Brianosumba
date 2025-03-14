const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  console.log("Authorization header Recieved:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Authorization header missing or invalid format");
    return res
      .status(401)
      .json({ message: "No token provided or invalid format" });
  }

  const token = authHeader && authHeader.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    req.user = {
      id: decoded.id,
      isAdmin: decoded.isAdmin ?? false,
    };
    console.log(" Token verified, user data set:", req.user);
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check if the user is an admin
const verifyAdmin = async (req, res, next) => {
  try {
    console.log(" Checking admin access for:", req.user);

    //Enaure req.user exists before checking admin role
    if (!req.user || !req.user.id) {
      console.error(" No user data found in req.user:", req.user);
      return res
        .status(403)
        .json({ message: "Unauthorized: No user data found " });
    }

    const user = await User.findById(req.user.id);
    console.log(" Fetched user from database:", user);

    // Check if the authenticated user is an admin
    if (!user) {
      console.warn(" User not found for ID:", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      console.warn(" Access denied. User is not an admin:", user.email);
      return res.status(403).json({ message: "Access denied, admin only" });
    }

    console.log(" Admin access granted:", user.email);

    next(); // Proceed if the user is an admin
  } catch (error) {
    console.error("Error in verifyAdmin middleware:", error.message);
    res.status(500).json({ message: "Server error during admin verification" });
  }
};

module.exports = { verifyToken, verifyAdmin };
