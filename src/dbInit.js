// src/dbInit.js
const { ObjectId } = require("mongodb");
const { client, dbName } = require("./db");
const Admin = require("./models/adminModel");
const User = require("./models/userModel");
const Dealership = require("./models/dealershipModel");
const Deal = require("./models/dealModel");
const Car = require("./models/carModel");
const SoldVehicle = require("./models/soldVehicleModel");

async function initializeDatabase() {
  try {
    await client.connect();

    const database = client.db(dbName);

    // Drop existing collections to delete the current data
    await Promise.all([
      database.collection("admin").drop(),
      database.collection("user").drop(),
      database.collection("dealership").drop(),
      database.collection("deal").drop(),
      database.collection("cars").drop(),
      database.collection("sold_vehicles").drop(),
    ]);

    // Create collections for each model
    const adminCollection = database.collection("admin");
    const userCollection = database.collection("user");
    const dealershipCollection = database.collection("dealership");
    const dealCollection = database.collection("deal");
    const carCollection = database.collection("cars");
    const soldVehicleCollection = database.collection("sold_vehicles");

    // Insert original admin
    const originalAdmin = new Admin("admin@example.com", "admin_password");
    await adminCollection.insertOne(originalAdmin);

    // Insert original user
    const originalUser = new User(
      "user@example.com",
      "user_id",
      "user_location",
      { name: "John Doe", age: 25, gender: "Male" },
      "user_password"
    );
    await userCollection.insertOne(originalUser);

    // Insert original dealership
    const originalDealership = new Dealership(
      "dealership@example.com",
      "dealership_id",
      "Awesome Dealership",
      "City Center",
      "dealership_password",
      { about: "We sell top-notch cars", establishedYear: 2010 },
      [],
      [],
      []
    );
    await dealershipCollection.insertOne(originalDealership);

    // Insert original list of cars (at least 3)
    const cars = [
      new Car("car_id_1", "sedan", "Luxury Sedan", "2022", {
        color: "Black",
        mileage: 30,
      }),
      new Car("car_id_2", "suv", "Sport Utility Vehicle", "2022", {
        color: "Blue",
        mileage: 25,
      }),
      new Car("car_id_3", "hatchback", "Compact Hatchback", "2022", {
        color: "Red",
        mileage: 28,
      }),
    ];
    await carCollection.insertMany(cars);

    // Insert original deal
    const originalDeal = new Deal("deal_id", cars[0]._id, {
      price: 45000,
      discount: 5000,
    });
    await dealCollection.insertOne(originalDeal);

    // Insert original sold vehicle and link it to the original deal
    const originalSoldVehicle = new SoldVehicle("vehicle_id", cars[0]._id, {
      buyerName: "Alice",
      saleDate: new Date(),
    });
    await soldVehicleCollection.insertOne(originalSoldVehicle);

    console.log("Database initialized with original data.");
  } finally {
    await client.close();
  }
}

initializeDatabase();
