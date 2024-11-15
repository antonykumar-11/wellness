const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDbw = require("./config/database");
const itemModel = require("./models/CustomerSchema ");
const items = require("./utils/data");
const path = require("path");
// Config setup
dotenv.config({ path: path.join(__dirname, "./config/config.env") });

// Establish MongoDB connection
connectDbw();

// Seeder function to import data into the database
const importData = async () => {
  try {
    await itemModel.deleteMany(); // Delete existing data (if any)
    const itemsData = await itemModel.insertMany(items); // Insert new data
    console.log("All Items Added"); // Success message
    process.exit(); // Exit the process after completion
  } catch (error) {
    console.error(`${error}`); // Log any errors
    process.exit(1); // Exit with an error status code
  }
};

importData();
