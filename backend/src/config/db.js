// TODO (Task 1): implement a Mongoose connection using process.env.MONGODB_URI.
// Suggested: mongoose.connect(process.env.MONGODB_URI), log success, and fail safely.
// Do not print credentials or the full connection string in logs.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
