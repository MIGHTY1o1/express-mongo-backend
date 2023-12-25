// src/db.js
const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://shubhagarwal1:5KDYVFUgBzjYyTBO@nervesparkcluster.q6cmton.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

module.exports = { client };
