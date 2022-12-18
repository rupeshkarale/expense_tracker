const mongoose = require("mongoose");
require("dotenv").config();

const dbID = process.env.DB_ID;
const dbPassword = process.env.DB_PASSWORD;

const connection = mongoose.connect("mongodb://127.0.0.1:27017/expensesTracker");

module.exports = connection;

