// src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const authService = require("../services/authService");

function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader;

  try {
    const decoded = jwt.verify(token, authService.getSecretKey());
    console.log("Decoded token:", decoded);
    req.user_email = decoded.user_email;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { authenticateUser };
