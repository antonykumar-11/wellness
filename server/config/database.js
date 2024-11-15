const mongoose = require("mongoose");
require("dotenv").config();

const connectDatabase = async () => {
  try {
    console.log(process.env.DB_LOCAL_URI); // Check if the URI is correct
    mongoose.set("strictQuery", false); // Suppress the deprecation warning
    const connection = await mongoose.connect(process.env.DB_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDatabase;
