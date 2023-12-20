// src/models/dealModel.js
const { ObjectId } = require("mongodb");

class Deal {
  constructor(deal_id, car_id, deal_info) {
    this._id = new ObjectId();
    this.deal_id = deal_id;
    this.car_id = car_id;
    this.deal_info = deal_info;
  }
}

module.exports = Deal;
