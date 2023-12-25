// src/routes/dealerRoutes.js
const express = require("express");
const dealerController = require("../controllers/dealershipController");
const { verifyDealerToken } = require("../middleware/dealershipMiddleware");
const dealershipMiddleware = require("../middleware/dealershipMiddleware");

const router = express.Router();

// Route: POST /dealer/login
router.post("/login", dealerController.login);

// Route: GET /dealer/protected
router.get("/protected", verifyDealerToken, dealerController.protectedRoute);

router.post(
  "/logout",
  dealershipMiddleware.authenticateUser,
  dealerController.logout
);

// Route: POST /user/change-password/:username
router.post(
  "/change-password/:username",
  dealershipMiddleware.authenticateUser,
  dealerController.changePassword
);

//to view all cars n dealership
router.get(
  "/getcars/:dealerId",
  dealershipMiddleware.authenticateUser,
  dealerController.viewAllCars
);

//to view deaship with a certain car
router.get(
  "/dealerships/bycar/:carId",
  dealershipMiddleware.authenticateUser,
  dealerController.viewCarById
);

//to view all sold cars
router.get(
  "/soldcars/:dealership_email",
  dealershipMiddleware.authenticateUser,
  dealerController.viewSoldCars
);

//add cars to dealership
router.post(
  "/addcars/:carID",
  dealershipMiddleware.authenticateUser,
  dealerController.AddCars
);

//to view all deals
router.get(
  "/alldeals",
  dealershipMiddleware.authenticateUser,
  dealerController.viewDeals
);

//add new deal
router.post(
  "/addDeal/:dealID",
  dealershipMiddleware.authenticateUser,
  dealerController.AddDeals
);

module.exports = router;
