// src/middleware/dealershipMiddleware.js
const authService = require("../services/authService");
const jwt = require("jsonwebtoken"); // Import jwt library

function verifyDealerToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Token not provided" });
  }

  try {
    const decoded = authService.verifyToken(token, res, req, next);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader;

  try {
    const decoded = jwt.verify(token, authService.getSecretKey());
    req.dealer_email = decoded.dealer_email;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
module.exports = { verifyDealerToken, authenticateUser };
