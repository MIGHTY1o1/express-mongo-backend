// src/controllers/adminController.js
const authService = require("../services/authService");
const { verifyAdminToken } = require("../middleware/Middleware");
const { client } = require("../db"); // Import the MongoDB client
const { MongoClient } = require("mongodb");
const passwordMatch = "";
const uri =
  "mongodb+srv://shubhagarwal1:5KDYVFUgBzjYyTBO@nervesparkcluster.q6cmton.mongodb.net/?retryWrites=true&w=majority";

async function login(req, res) {
  try {
    const { admin_id, password } = req.body;
    console.log("Received credentials:", admin_id, password);

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("test");
    const adminCollection = await db.collection("admin");

    const admin = await adminCollection.findOne({
      admin_id: admin_id,
    });

    console.log(admin);

    if (admin) {
      // Compare the hashed password
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

function protectedRoute(req, res) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    // Your additional logic here, e.g., checking for token validity
    const token = req.headers.authorization;
    authService.verifyToken(token, res); // This will throw an error if the token is invalidated

    // If the token is valid, proceed with your response
    res.json({ message: "Admin route, token verified", admin: req.admin });
  } catch (error) {
    // Handle the case where the token is invalidated or any other error
    res
      .status(401)
      .json({ message: "Unauthorized: Invalid token", error: error.message });
  }
}

async function logout(req, res) {
  try {
    // console.log("step1");
    const token = req.headers.authorization;
    authService.invalidateToken(token);
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function changePassword(req, res) {
  console.log("admin controller");
  const { new_password } = req.body;
  const username = req.params.username;
  console.log("recieved email:" + username);
  console.log("recieved pass:" + new_password);
  console.log("hi");

  try {
    // Step 2: Find the user record in the database using the username extracted from the token
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("test");
    const adminCollection = await db.collection("admin");
    //  const allUsers = await adminCollection.find({}).toArray();
    // console.log(allUsers);

    const user = await adminCollection.findOne({ admin_id: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 3: Update the user's password in the database
    const filter = { admin_id: user.admin_id };
    const update = { $set: { password_hash: new_password } };

    const result = await adminCollection.updateOne(filter, update);

    // Step 4: Return a response indicating that the password has been changed successfully
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

module.exports = { login, protectedRoute, logout, changePassword };
