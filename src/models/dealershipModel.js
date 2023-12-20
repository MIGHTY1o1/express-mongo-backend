// src/models/dealershipModel.js
const { ObjectId } = require("mongodb");

class Dealership {
  constructor(
    dealership_email,
    dealership_id,
    dealership_name,
    dealership_location,
    password_hash,
    dealership_info,
    cars,
    deals,
    sold_vehicles
  ) {
    this._id = new ObjectId();
    this.dealership_email = dealership_email;
    this.dealership_id = dealership_id;
    this.dealership_name = dealership_name;
    this.dealership_location = dealership_location;
    this.password_hash = password_hash;
    this.dealership_info = dealership_info;
    this.cars = cars || [];
    this.deals = deals || [];
    this.sold_vehicles = sold_vehicles || [];
  }
}

module.exports = Dealership;
