const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "atlas-credentials.env") });

let connectionPromise;

const connectToMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    const mongoURI =
      process.env.MONGODB_URI ||
      (process.env.NODE_ENV === "production"
        ? null
        : "mongodb://127.0.0.1:27017/IMS");

    if (!mongoURI) {
      throw new Error("MONGODB_URI is missing from the backend environment.");
    }

    mongoose.set("strictQuery", false);
    connectionPromise = mongoose.connect(mongoURI).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;
  return mongoose.connection;
};
module.exports = connectToMongo;
