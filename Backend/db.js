const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "atlas-credentials.env") });

const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/IMS";

const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongo Successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};
module.exports = connectToMongo;
