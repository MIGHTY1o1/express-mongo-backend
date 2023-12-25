// src/models/userModel.js
const { ObjectId } = require("mongodb");
const client = require("../db");
const faker = require("faker");
class User {
  constructor(
    user_email,
    user_id,
    user_location,
    user_info,
    password_hash,
    vehicle_info
  ) {
    this._id = new ObjectId();
    this.user_email = user_email;
    this.user_id = user_id;
    this.user_location = user_location;
    this.user_info = user_info;
    this.password_hash = password_hash;
    this.vehicle_info = this.generateVehicleInfo();
  }
  generateVehicleInfo() {
    const numVehicles = faker.random.number({ min: 1, max: 5 });
    const vehicleIds = [];

    for (let i = 0; i < numVehicles; i++) {
      const vehicleId = faker.random.uuid();
      vehicleIds.push(vehicleId);
    }

    return vehicleIds;
  }
}

module.exports = User;
