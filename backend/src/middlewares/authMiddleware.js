const jwt = require("jsonwebtoken");

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // If there's no token, return a 401 Unauthorized error
    if (!token) {
      console.error("Authorization header missing or malformed.");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err.message);
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = decoded; // Attach decoded token payload to the request
      console.log("Token verified. User:", req.user);
      next();
    });
  } catch (error) {
    console.error("Error in verifyToken middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to check if the user is an admin
const verifyAdmin = (req, res, next) => {
  try {
    // Check if the authenticated user is an admin
    if (!req.user || !req.user.isAdmin) {
      console.warn("Admin access denied. User:", req.user);
      return res.status(403).json({ message: "Access denied, admin only" });
    }
    next(); // Proceed if the user is an admin
  } catch (error) {
    console.error("Error in verifyAdmin middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { verifyToken, verifyAdmin };

// // Importing the JWT (JSON Web Token) library for token verification
// const jwt = require("jsonwebtoken");

// // Middleware function to verify the token and check if the user is an admin
// /**
//  * @param {Request} req
//  * @param {Response} res
//  * @param {Next} next
//  */
// const verifyToken = (req, res, next) => {
//   // Get the token from the request header named "x-auth-token"
//   const authHeader = req.headers["authorization"];

//   const token = authHeader && authHeader.split(" ")[1];

//   console.log(token, "token");
//   // If there's no token, return a 401 status (Unauthorized) with an error message
//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }

//   try {
//     // Verify the token using the secret key stored in environment variable
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // If verification is successful, attach the decoded user information to the request object
//     req.user = decoded;

//     // Call the next middleware or route handler in the stack
//     next();
//   } catch (err) {
//     console.log(err);
//     // If the token is invalid, return a 400 status (Bad Request) with an error message
//     res.status(400).json({ message: "Invalid token" });
//   }
// };

// // Middleware function to verify if the user is an admin
// const verifyAdmin = (req, res, next) => {
//   // Check if the user object from the previous middleware has an "isAdmin" property set to true
//   if (!req.user || !req.user.isAdmin) {
//     return res.status(403).json({ message: "Access denied, admin only" });
//   }

//   // If the user is an admin, call the next middleware or route handler in the stack
//   next();
// };

// // Export the middleware functions so they can be used in other parts of the application
// module.exports = { verifyToken, verifyAdmin };
