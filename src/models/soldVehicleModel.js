// src/models/soldVehicleModel.js
const { ObjectId } = require("mongodb");

class SoldVehicle {
  constructor(vehicle_id, car_id, vehicle_info) {
    this._id = new ObjectId();
    this.vehicle_id = vehicle_id;
    this.car_id = car_id;
    this.vehicle_info = vehicle_info;
  }
}

module.exports = SoldVehicle;
