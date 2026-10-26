const jwt = require("jsonwebtoken");

// ============================
// Verify JWT Token
// ============================
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please login first.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Attach user information to request
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// ============================
// Check User Role
// ============================
const authorizeRoles = (...roles) => {
  return (req, res, next) => {

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

// ============================
// Export
// ============================
module.exports = {
  protect,
  authorizeRoles,
};