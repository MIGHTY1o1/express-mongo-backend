// src/routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
const { verifyUserToken } = require("../middleware/userMiddleware");
const authMiddleware = require("../middleware/authMiddleware"); // Make sure this line is present
const userMiddleware = require("../middleware/userMiddleware"); // Make sure this line is present

const router = express.Router();

// user login
router.post("/login", userController.login);

// Route: GET /user/protected
router.get("/protected", verifyUserToken, userController.protectedRoute);

//to logout
router.post("/logout", authMiddleware.authenticateUser, userController.logout);

// to change password
router.post(
  "/change-password/:username",
  authMiddleware.authenticateUser,
  userController.changePassword
);

//to view all cars
router.get(
  "/viewAllCars/:userId",
  authMiddleware.authenticateUser,
  userController.viewAllCars
);

//to view deal on cars
router.get(
  "/viewdealonCars/:carId",
  authMiddleware.authenticateUser,
  userController.viewDealsonCars
);

//buy car after deal
router.post(
  "/buy-car-after-deal/:carId",
  authMiddleware.authenticateUser,
  userController.buyCarAfterDeal
);

module.exports = router;
