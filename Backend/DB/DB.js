const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '././.env' });
const db = process.env.DATA_URL.replace('<PASSWORD>', process.env.DATA_PASS);
const connectdb = async function () {
  const conn = await mongoose.connect(db);
  console.log(`database connect ${conn.connection.host}`);
};

module.exports = connectdb;
