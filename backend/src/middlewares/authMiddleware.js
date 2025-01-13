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

// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // Middleware to verify the token
// const verifyToken = (req, res, next) => {
//   try {
//     // Get the token from the Authorization header
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     // If there's no token, return a 401 Unauthorized error
//     if (!token) {
//       console.error("Authorization header missing or malformed.");
//       return res
//         .status(401)
//         .json({ message: "No token, authorization denied" });
//     }

//     // Verify the token
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         console.error("Token verification error:", err.message);
//         return res.status(403).json({ message: "Invalid or expired token" });
//       }
//       req.user = decoded; // Attach decoded token payload to the request
//       console.log("Token verified. User:", req.user);
//       next();
//     });
//   } catch (error) {
//     console.error("Error in verifyToken middleware:", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Middleware to check if the user is an admin
// const verifyAdmin = (req, res, next) => {
//   try {
//     // Check if the authenticated user is an admin
//     if (!req.user || !req.user.isAdmin) {
//       console.warn("Admin access denied. User:", req.user);
//       return res.status(403).json({ message: "Access denied, admin only" });
//     }
//     next(); // Proceed if the user is an admin
//   } catch (error) {
//     console.error("Error in verifyAdmin middleware:", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = { verifyToken, verifyAdmin };
