// src/models/userModel.js
const { ObjectId } = require("mongodb");

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
    this.vehicle_info = vehicle_info || [];
  }
}

module.exports = User;
