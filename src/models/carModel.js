// src/models/carModel.js
const { ObjectId } = require("mongodb");

class Car {
  constructor(car_id, type, name, model, car_info) {
    this._id = new ObjectId();
    this.car_id = car_id;
    this.type = type;
    this.name = name;
    this.model = model;
    this.car_info = car_info;
  }
}

module.exports = Car;
