// Importing the JWT (JSON Web Token) library for token verification
const jwt = require("jsonwebtoken");

// Middleware function to verify the token and check if the user is an admin
const verifyToken = (req, res, next) => {
  // Get the token from the request header named "x-auth-token"
  const token = req.header("x-auth-token");

  // If there's no token, return a 401 status (Unauthorized) with an error message
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    // Verify the token using the secret key "jwtSecret"
    const decoded = jwt.verify(token, "jwtSecret");

    // If verification is successful, attach the decoded user information to the request object
    // This allows us to access user details (like user ID and admin status) in the next middleware or route handler
    req.user = decoded;

    // Call the next middleware or route handler in the stack
    next();
  } catch (err) {
    // If the token is invalid, return a 400 status (Bad Request) with an error message
    res.status(400).json({ message: "Invalid token" });
  }
};

// Middleware function to verify if the user is an admin
const verifyAdmin = (req, res, next) => {
  // Check if the user object from the previous middleware has an "isAdmin" property set to true
  if (!req.user.isAdmin)
    // If the user is not an admin, return a 403 status (Forbidden) with an access denied message
    return res.status(403).json({ message: "Access denied, admin only" });

  // If the user is an admin, call the next middleware or route handler in the stack
  next();
};

// Export the middleware functions so they can be used in other parts of the application
module.exports = { verifyToken, verifyAdmin };
