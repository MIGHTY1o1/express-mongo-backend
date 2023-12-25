// src/middleware/userMiddleware.js
const authService = require("../services/authService");

function verifyUserToken(req, res, next) {
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
  // console.log("Headers:", req.headers);
  const authHeader = req.headers.authorization;
  // console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader;
  console.log("Token:", token); // Log the token value

  try {
    const decoded = jwt.verify(token, authService.getSecretKey());
    //  console.log("Decoded token:", decoded);
    req.user_email = decoded.user_email;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { verifyUserToken, authenticateUser };
