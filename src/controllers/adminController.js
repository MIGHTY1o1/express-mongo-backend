// src/controllers/adminController.js
const authService = require("../services/authService");
const { verifyAdminToken } = require("../middleware/Middleware");
const { client } = require("../db"); // Import the MongoDB client
const { MongoClient } = require("mongodb");
const passwordMatch = "";
const uri =
  "mongodb+srv://shubhagarwal1:5KDYVFUgBzjYyTBO@nervesparkcluster.q6cmton.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
await client.connect();
//retrive db
const db = client.db("test");

//================================================
async function login(req, res) {
  try {
    const { admin_id, password } = req.body;
    console.log("Received credentials:", admin_id, password);

    const adminCollection = await db.collection("admin");

    const admin = await adminCollection.findOne({
      admin_id: admin_id,
    });

    console.log(admin);

    if (admin) {
      const passwordHash = admin.password_hash;

      if (password == passwordHash) {
        // Admin found, generate token and send it in the response
        const token = authService.generateToken({ admin_id });
        res.json({ token });
      }
    } else {
      // Admin not found or invalid credentials
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    // Handle database query error
    console.error("Error during admin authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
}
//================================================

//================================================
function protectedRoute(req, res) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const token = req.headers.authorization;
    authService.verifyToken(token, res); // This will throw an error if the token is invalidated

    res.json({ message: "Admin route, token verified", admin: req.admin });
  } catch (error) {
    res
      .status(401)
      .json({ message: "Unauthorized: Invalid token", error: error.message });
  }
}
//================================================

//================================================
async function logout(req, res) {
  try {
    const token = req.headers.authorization;
    authService.invalidateToken(token);
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
//================================================

//================================================
async function changePassword(req, res) {
  console.log("admin controller");
  const { new_password } = req.body;
  const username = req.params.username;
  console.log("recieved email:" + username);
  console.log("recieved pass:" + new_password);
  console.log("hi");

  try {
    // Find the user record in the database using the username extracted from the token

    const adminCollection = await db.collection("admin");

    const user = await adminCollection.findOne({ admin_id: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's password in the database
    const filter = { admin_id: user.admin_id };
    const update = { $set: { password_hash: new_password } };

    const result = await adminCollection.updateOne(filter, update);

    if (result.modifiedCount === 1) {
      res.json({ message: "Password changed successfully" });
    } else {
      res.json({ message: "User not found or password not updated." });
      console.log("User not found or password not updated.");
    }
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
//================================================

module.exports = { login, protectedRoute, logout, changePassword };
