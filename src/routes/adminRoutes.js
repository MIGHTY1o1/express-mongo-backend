const express = require("express");
const adminController = require("../controllers/adminController");
const { verifyAdminToken } = require("../middleware/Middleware");
const adminMiddleware = require("../middleware/Middleware");

const router = express.Router();

// Route: POST /admin/login
router.post("/login", adminController.login);

// Route: GET /admin/getadmin
router.get("/getadmin", async (req, res) => {
  try {
    // You should have a MongoDB connection object (db) available to access the collection
    const fetchedUsers = await db.collection("admin").find({}).toArray();
    res.json(fetchedUsers);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Route: GET /admin/protected
router.get("/protected", verifyAdminToken, adminController.protectedRoute);

router.post(
  "/logout",
  adminMiddleware.authenticateUser,
  adminController.logout
);

// Route: POST /user/change-password/:username
router.post(
  "/change-password/:username",
  adminMiddleware.authenticateUser,
  adminController.changePassword
);

module.exports = router;
