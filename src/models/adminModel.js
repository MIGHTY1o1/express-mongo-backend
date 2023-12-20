// src/models/adminModel.js
const { ObjectId } = require("mongodb");

class Admin {
  constructor(admin_id, password_hash) {
    this._id = new ObjectId();
    this.admin_id = admin_id;
    this.password_hash = password_hash;
  }
}

module.exports = Admin;
