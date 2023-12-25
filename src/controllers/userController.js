// src/controllers/userController.js
const authService = require("../services/authService");
const { verifyUserToken } = require("../middleware/Middleware"); // Update the middleware import
const { client } = require("../db");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken"); // Import jwt library
const UserModel = require("../models/userModel");

const uri =
  "mongodb+srv://shubhagarwal1:5KDYVFUgBzjYyTBO@nervesparkcluster.q6cmton.mongodb.net/?retryWrites=true&w=majority";

//================================================================
//(base) shubh@shubhs-MacBook-Air nerve_sparcks_backend %
//curl -X POST -H "Content-Type: application/json" -d '{"user_email": "Tina_Beahan@yahoo.com", "password": "kNqjrASlNxg1ct7"}' http://localhost:8000/user/login

async function login(req, res) {
  try {
    const { user_email, password } = req.body;

    console.log("Received credentials:", user_email, password);
    // console.log("req", req);

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("test");
    const userCollection = await db.collection("user");

    const user = await userCollection.findOne({
      user_email: user_email,
    });

    console.log(user);

    if (user) {
      // Compare the hashed password
      const passwordHash = user.password_hash;
      console.log(passwordHash);
      if (password == passwordHash) {
        console.log("step4");
        // User found, generate token and send it in the response
        const token = authService.generateToken({ user_email });
        res.json({ token });
      }
    } else {
      console.log("step45");
      // User not found or invalid credentials
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    // Handle database query error
    console.error("Error during user authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
}
//================================================================

//================================================================
function protectedRoute(req, res) {
  try {
    // console.log("hi");
    // Assuming req.user is set by your authentication middleware
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    // Your additional logic here, e.g., checking for token validity
    const token = req.headers.authorization;
    authService.verifyToken(token, res); // This will throw an error if the token is invalidated
    // console.log("hi");
    // If the token is valid, proceed with your response
    res.json({ message: "User route, token verified", user: req.user });
  } catch (error) {
    // Handle the case where the token is invalidated or any other error
    res
      .status(401)
      .json({ message: "Unauthorized: Invalid token", error: error.message });
  }
}
//================================================================

//================================================================
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
//================================================================

//================================================================

async function changePassword(req, res) {
  const { new_password } = req.body;
  const username = req.params.username;
  console.log("recieved email:" + username);
  console.log("recieved pass:" + new_password);

  try {
    // Step 2: Find the user record in the database using the username extracted from the token
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("test");
    const userCollection = await db.collection("user");

    const user = await userCollection.findOne({ user_email: username });

    //console.log(allUsers);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 3: Update the user's password in the database
    const filter = { user_email: user.user_email };
    const update = { $set: { password_hash: new_password } };

    const result = await userCollection.updateOne(filter, update);

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
//================================================================

//================================================================
//(base) shubh@shubhs-MacBook-Air nerve_sparcks_backend %
//curl -X G//ET -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoiVGluYV9CZWFoYW5AeWFob28uY29tIiwiaWF0IjoxNzAzNDM3NDQ3LCJleHAiOjE3MDM0NDEwNDd9.J8VfmkZYFUQyF2b5hXKi0T6rdVGNLHISpCuZSYcIkzQ" -H "Content-Type: application/json" http://localhost:8000/user//viewAllCars/3433fe05-d2b6-4a09-b70b-a7134379d4ca
async function viewAllCars(req, res) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("test");
    const userCollection = await db.collection("user");

    const userId = req.params.userId;
    const user = await userCollection.findOne({ user_id: userId });
    const vehicleInfo = user.vehicle_info;
    if (vehicleInfo) {
      res.json({ message: "Viewing all cars owned by user", vehicleInfo });
    } else {
      res.json({ message: "No cars found." });
      console.log("No cars found.");
    }
  } catch (error) {
    console.error("Error finding cars:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
//================================================================

//================================================================
//(base) shubh@shubhs-MacBook-Air nerve_sparcks_backend %
//curl -X GET -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoiVGluYV9CZWFoYW5AeWFob28uY29tIiwiaWF0IjoxNzAzNDM3NDQ3LCJleHAiOjE3MDM0NDEwNDd9.J8VfmkZYFUQyF2b5hXKi0T6rdVGNLHISpCuZSYcIkzQ" -H "Content-Type: application/json" http://localhost:8000/user/viewdealonCars/6588600ac85427b0085294d8
async function viewDealsonCars(req, res) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("test");
    const dealCollection = await db.collection("deal");

    const carId = req.params.carId;
    console.log(carId);
    const deal = await dealCollection.findOne({ car_id: carId });

    if (deal) {
      res.json({ message: "Viewing deals on all cars", deal });
    } else {
      res.json({ message: "No cars found." });
      console.log("No cars found.");
    }
  } catch (error) {
    console.error("Error finding cars:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
//================================================================

//================================================================
//(base) shubh@shubhs-MacBook-Air nerve_sparcks_backend %
//curl -X POST -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoiTW9uYTU0QGhvdG1haWwuY29tIiwiaWF0IjoxNzAzNDgwMjUwLCJleHAiOjE3MDM0ODM4NTB9.Aq_MpCct1n6J0WgljJIPC9i0m8WFo6CHdYgInp5lGCg" -H "Content-Type: application/json" http://localhost:8000/user/buy-car-after-deal/34430229-7bf9-4835-a068-d80aa839185a
async function buyCarAfterDeal(req, res) {
  const userEmail = req.user_email;
  const { carId } = req.params;

  console.log(userEmail);
  console.log("Car ID:", carId);
  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db("test");
    const userCollection = await db.collection("user");
    const dealCollection = await db.collection("deal");

    const user = await userCollection.findOne({ user_email: userEmail });
    const deal = await dealCollection.findOne({ car_id: carId }); // Corrected variable name to carId

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }
    if (!user) {
      return res.status(404).json({ message: " user not found" });
    }

    // Check if the user already owns the vehicle
    if (user.vehicle_info.includes(carId)) {
      return res
        .status(400)
        .json({ message: "User already owns this vehicle" });
    }

    // Add the car to the list of owned vehicles by user
    user.vehicle_info.push(carId);

    // Remove the deal from deals
    const result = await dealCollection.deleteOne({ car_id: carId });

    if (result.deletedCount > 0) {
      // Check if a deal was actually deleted
      await userCollection.updateOne(
        { user_email: userEmail },
        { $set: { vehicle_info: user.vehicle_info } }
      );
      res.json({ message: "Vehicle purchased successfully after deal" });
    } else {
      console.log("Error finding deals and buying car");
      res.status(500).json({ message: "Error finding deals and buying car" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
//================================================================

module.exports = {
  login,
  protectedRoute,
  logout,
  changePassword,
  viewAllCars,
  viewDealsonCars,
  buyCarAfterDeal,
};
