const dotenv = require('dotenv');
dotenv.config()

const mongoose = require('mongoose');
const { DB_NAME } = require("./constants");
const connectDB = require('./db');


connectDB();