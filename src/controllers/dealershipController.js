// src/controllers/dealerController.js
const authService = require("../services/authService");
const { verifyDealerToken } = require("../middleware/dealershipMiddleware");
const { client } = require("../db");
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://shubhagarwal1:5KDYVFUgBzjYyTBO@nervesparkcluster.q6cmton.mongodb.net/?retryWrites=true&w=majority";

//retrieve db
const client = new MongoClient(uri);
await client.connect();
//retrive db
const db = client.db("test");

//==========================================================
//(base) shubh@shubhs-MacBook-Air nerve_sparcks_backend %
//curl -X POST -H "Content-Type: application/json" -d '{"dealer_email": "Magnus_Williamson60@yahoo.com", "password": "AVpuTxja88Y8RUe"}' http://localhost:8000/dealer/login
async function login(req, res) {
  try {
    const { dealer_email, password } = req.body;

    console.log("Received credentials:", dealer_email, password);
    // console.log("req", req);

    const dealerCollection = await db.collection("dealership");

    const dealer = await dealerCollection.findOne({
      dealership_email: dealer_email,
    });

    console.log(dealer.dealership_email);

    if (dealer) {
      const passwordHash = dealer.password_hash;

      if (password == passwordHash) {
        const token = authService.generateToken({ dealer_email });
        res.json({ token });
      }
    } else {
      // Dealer not found or invalid credentials
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    // Handle database query error
    console.error("Error during dealer authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
}
//==========================================================

//==========================================================
function protectedRoute(req, res) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const token = req.headers.authorization;
    authService.verifyToken(token, res);

    res.json({ message: "User route, token verified", user: req.user });
  } catch (error) {
    res
      .status(401)
      .json({ message: "Unauthorized: Invalid token", error: error.message });
  }
}
//==========================================================

//==========================================================
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
//==========================================================

//==========================================================
//curl -X POST -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDMzMTg1MzQsImV4cCI6MTcwMzMyMjEzNH0.OjRAzUijEs_uBp2vwkp97NpMk-mUjwLKHeL4kBv3uBE" -H "Content-Type: application/json" -d '{"new_password": "1234"}' http://localhost:8000/user/change-password/Jammie68@gmail.com
async function changePassword(req, res) {
  console.log("admin controller");
  const { new_password } = req.body;
  const username = req.params.username;
  console.log("recieved email:" + username);
  console.log("recieved pass:" + new_password);
  console.log("hi");

  try {
    const dealerCollection = await db.collection("dealership");

    const user = await dealerCollection.findOne({ dealership_email: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const filter = { dealership_email: user.dealership_email };
    const update = { $set: { password_hash: new_password } };

    const result = await dealerCollection.updateOne(filter, update);

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
//==========================================================

//==========================================================
//(base) shubh@shubhs-MacBook-Air nerve_sparcks_backend %
//curl -X GET -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MzMzNDIsImV4cCI6MTcwMzQzNjk0Mn0.ekuDI1Ju6vGuk8loMqpk6qtQA-CJRRsXFCyCEqlgfGg" http://localhost:8000/dealer/getcars/31f6d9b3-623e-4a09-9644-98ef26017d16
async function viewAllCars(req, res) {
  try {
    const dealershipCollection = db.collection("dealership");

    const dealershipId = req.params.dealerId;

    const dealership = await dealershipCollection.findOne({
      dealership_id: dealershipId,
    });

    if (dealership) {
      const cars = dealership.cars || [];

      if (cars.length > 0) {
        res.json({ message: "Viewing all cars", cars });
      } else {
        res.json({ message: "No cars found for the dealership." });
      }
    } else {
      res.json({ message: "Dealership not found." });
    }
  } catch (error) {
    console.error("Error finding cars:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
//==========================================================

//====================================================================
//(base) shubh@shubhs-MacBook-Air nerve_sparcks_backend %
//curl -X GET -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MzMzNDIsImV4cCI6MTcwMzQzNjk0Mn0.ekuDI1Ju6vGuk8loMqpk6qtQA-CJRRsXFCyCEqlgfGg" http://localhost:8000/dealer/dealerships/bycar/27b4a153-14b2-4eb1-aad7-39f4e1766d0c
async function viewCarById(req, res) {
  try {
    const dealershipCollection = db.collection("dealership");

    const carId = req.params.carId;

    const dealership = await dealershipCollection.findOne({
      "cars.car_id": carId,
    });

    if (dealership) {
      const foundCar = dealership.cars.find((car) => car.car_id === carId);

      if (foundCar) {
        res.json({ message: "Car found", car: foundCar });
      } else {
        res.json({ message: "Car not found in the dealership." });
      }
    } else {
      res.json({ message: "Dealership not found." });
    }
  } catch (error) {
    console.error("Error finding car:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
//============================================================================

//==========================================================
//(base) shubh@shubhs-MacBook-Air nerve_sparcks_backend %
//curl -X GET -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0ODMyOTMsImV4cCI6MTcwMzQ4Njg5M30.mItBIsnq5PQkF8KFrpobfc8-Trte1fQUTqeDyiIHcMM" -H "Content-Type: application/json" http://localhost:8000/dealer/soldcars/Lilyan.Hand33@hotmail.com
async function viewSoldCars(req, res) {
  const dealershipEmail = req.params.dealership_email;
  console.log(dealershipEmail);
  try {
    const dealershipCollection = db.collection("dealership");

    const dealership = await dealershipCollection.findOne({
      dealership_email: dealershipEmail,
    });

    if (dealership) {
      const cars = dealership.sold_vehicles || [];
      if (cars.length > 0) {
        res.json({ message: "Viewing all sold cars", cars });
      } else {
        res.json({ message: "No sold cars found for the dealership." });
      }
    } else {
      res.json({ message: "Dealership not found." });
    }
  } catch (error) {
    console.error("Error finding cars:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
//==========================================================

//==========================================================
//(base) shubh@shubhs-MacBook-Air nerve_sparcks_backend %
//curl -X POST -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFsZXJfZW1haWwiOiJNYWdudXNfV2lsbGlhbXNvbjYwQHlhaG9vLmNvbSIsImlhdCI6MTcwMzQ5MTIyMiwiZXhwIjoxNzAzNDk0ODIyfQ.dCam92XWx3CgmYVCubMhRo6WfYDGgFaDilZGM0gX8-Q" http://localhost:8000/dealer/addcars/376b6b41-4be3-41a7-a218-67c6c8ff3f5b
async function AddCars(req, res) {
  const dealershipEmail = req.dealer_email;
  const carID = req.params.carID;

  console.log(dealershipEmail);

  try {
    const dealershipCollection = db.collection("dealership");
    const carCollection = db.collection("cars");

    const dealership = await dealershipCollection.findOne({
      dealership_email: dealershipEmail,
    });

    if (!dealership) {
      return res.status(400).json({ message: "dealership not found" });
    }

    const car = await carCollection.findOne({
      car_id: carID,
    });

    if (!car) {
      return res.status(400).json({ message: "car not found" });
    }

    const filter = { dealership_email: dealershipEmail };
    const update = { $push: { cars: carID } };

    const result = await dealershipCollection.updateOne(filter, update);

    if (result) {
      res.status(200).json({ message: "Car added successfully" });
    } else {
      res.status(400).json({ message: "Car not added" });
    }
  } catch (error) {
    console.error("Error adding cars:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
//==========================================================

//==========================================================
//(base) shubh@shubhs-MacBook-Air nerve_sparcks_backend %
//curl -X GET -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0ODMyOTMsImV4cCI6MTcwMzQ4Njg5M30.mItBIsnq5PQkF8KFrpobfc8-Trte1fQUTqeDyiIHcMM" -H "Content-Type: application/json" http://localhost:8000/dealer/soldcars/Lilyan.Hand33@hotmail.com
async function viewDeals(req, res) {
  const dealershipEmail = req.dealer_email;
  console.log(dealershipEmail);
  try {
    const dealershipCollection = db.collection("dealership");

    const dealership = await dealershipCollection.findOne({
      dealership_email: dealershipEmail,
    });

    if (dealership) {
      const deals = dealership.deals || [];
      if (deals.length > 0) {
        res.json({ message: "Viewing all deals", deals });
      } else {
        res.json({ message: "No deals found for the dealership." });
      }
    } else {
      res.json({ message: "Dealership not found." });
    }
  } catch (error) {
    console.error("Error finding deals:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
//==========================================================

//==========================================================
//(base) shubh@shubhs-MacBook-Air nerve_sparcks_backend %
//curl -X POST -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFsZXJfZW1haWwiOiJNYWdudXNfV2lsbGlhbXNvbjYwQHlhaG9vLmNvbSIsImlhdCI6MTcwMzQ5MjU0NSwiZXhwIjoxNzAzNDk2MTQ1fQ.nZPYp-9FgWPXt--01rxZPMcCJSsVqDSxUnrDRyae2o4" http://localhost:8000/dealer/addDeal/79d19b6a-dd49-4821-bb79-88741e42f23a
async function AddDeals(req, res) {
  const dealershipEmail = req.dealer_email;
  const dealID = req.params.dealID;

  console.log(dealershipEmail);
  console.log(dealID);

  try {
    const dealershipCollection = db.collection("dealership");
    const dealCollection = db.collection("deal");

    const dealership = await dealershipCollection.findOne({
      dealership_email: dealershipEmail,
    });

    if (!dealership) {
      return res.status(400).json({ message: "dealership not found" });
    }

    const deal = await dealCollection.findOne({
      deal_id: dealID,
    });

    if (!deal) {
      return res.status(400).json({ message: "deal not found" });
    }

    const filter = { dealership_email: dealershipEmail };
    const update = { $push: { deals: dealID } };

    const result = await dealershipCollection.updateOne(filter, update);

    if (result) {
      res.status(200).json({ message: "deal added successfully" });
    } else {
      res.status(400).json({ message: "deal not added" });
    }
  } catch (error) {
    console.error("Error adding deals:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
//==========================================================

module.exports = {
  login,
  protectedRoute,
  logout,
  changePassword,
  viewAllCars,
  viewCarById,
  viewSoldCars,
  AddCars,
  viewDeals,
  AddDeals,
};
