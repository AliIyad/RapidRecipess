const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const connectionString = `${process.env.MONGO_URL}/${process.env.MONGO_URI}`;
    await mongoose.connect(connectionString);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
