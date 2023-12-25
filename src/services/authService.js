// src/services/authService.js
const faker = require("faker");
const jwt = require("jsonwebtoken");

const secretKey = "shubh"; // replace with a strong secret key

// Array to store invalidated tokens
const invalidatedTokens = [];

//generate token
function generateToken(payload) {
  console.log("token gen");
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

//verify token
function verifyToken(token, res) {
  try {
    // Check if the token is in the invalidatedTokens list
    if (invalidatedTokens.includes(token)) {
      console.log(res);
      return res.status(401).json({ message: "Token is invalidated" });
    }

    // Verify the token using the secret key
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw error; // Propagate the error for handling in the calling code
  }
}

function verifyToken(token, res, req, next) {
  try {
    // Check if the token is in the invalidatedTokens list
    if (invalidatedTokens.includes(token)) {
      console.log(res);
      return res.status(401).json({ message: "Token is invalidated" });
    }

    // Verify the token using the secret key
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw error; // Propagate the error for handling in the calling code
  }
}

//invalidated token
function invalidateToken(token) {
  invalidatedTokens.push(token);
}

module.exports = {
  generateToken,
  verifyToken,
  invalidateToken,
  getSecretKey: () => secretKey,
};
