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

    //Drop existing collections to delete the current data
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
    const faker = require("faker");

    const originalAdmin = new Admin(
      faker.internet.email(),
      faker.internet.password()
    );
    await adminCollection.insertOne(originalAdmin);

    // Example of creating a user with vehicle_info
    const originalUser = new User(
      faker.internet.email(),
      faker.random.uuid(),
      faker.address.city(),
      {
        name: faker.name.findName(),
        age: faker.random.number({ min: 18, max: 99 }),
        gender: faker.random.arrayElement(["Male", "Female"]),
      },
      faker.internet.password()
    );
    await userCollection.insertOne(originalUser);

    //
    function getRandomNumber(min, max) {
      return faker.random.number({ min, max });
    }

    // Function to generate a random sentence
    function getRandomSentence() {
      return faker.lorem.sentence();
    }

    // Function to generate a random email
    function getRandomEmail() {
      return faker.internet.email();
    }

    // Function to generate a random UUID
    function getRandomUUID() {
      return faker.random.uuid();
    }

    // Function to generate a random company name
    function getRandomCompanyName() {
      return faker.company.companyName();
    }

    // Function to generate a random street name
    function getRandomStreetName() {
      return faker.address.streetName();
    }

    // Function to generate a random password
    function getRandomPassword() {
      return faker.internet.password();
    }

    // Function to generate a random year between 1980 and 2022
    function getRandomEstablishedYear() {
      return getRandomNumber(1980, 2022);
    }

    // Create a Dealership instance with faker.js data
    const carIds = Array.from({ length: 5 }, () => getRandomUUID());
    const deals = Array.from({ length: 5 }, () => getRandomUUID());
    const sold = Array.from({ length: 5 }, () => getRandomUUID());

    const originalDealership = new Dealership(
      getRandomEmail(),
      getRandomUUID(),
      getRandomCompanyName(),
      getRandomStreetName(),
      getRandomPassword(),
      {
        about: getRandomSentence(),
        establishedYear: getRandomEstablishedYear(),
      },
      carIds,
      deals,
      sold
    );

    await dealershipCollection.insertOne(originalDealership);
    //============================================================

    const cars = [
      new Car(
        faker.random.uuid(),
        faker.random.word(),
        faker.lorem.words(2),
        faker.random.number({ min: 2000, max: 2022 }),
        {
          color: faker.commerce.color(),
          mileage: faker.random.number({ min: 10, max: 50 }),
        }
      ),
    ];
    await carCollection.insertMany(cars);

    // Insert original deal
    const originalDeal = new Deal(faker.random.uuid(), cars[0]._id, {
      price: faker.random.number({ min: 30000, max: 80000 }),
      discount: faker.random.number({ min: 1000, max: 5000 }),
    });
    await dealCollection.insertOne(originalDeal);

    // Insert original sold vehicle and link it to the original deal
    const originalSoldVehicle = new SoldVehicle(
      faker.random.uuid(),
      cars[0]._id,
      {
        buyerName: faker.name.findName(),
        saleDate: faker.date.past(),
      }
    );
    await soldVehicleCollection.insertOne(originalSoldVehicle);

    console.log("Database initialized with original data.");
  } finally {
    await client.close();
  }
}

initializeDatabase();
