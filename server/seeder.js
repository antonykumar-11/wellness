const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDbw = require("./config/database");
const itemModel = require("./models/itemModel");
const items = require("./utils/data");
const path = require("path");
//config
dotenv.config({ path: path.join(__dirname, "./config/config.env") });
connectDbw();

//function seeder
const importData = async () => {
  try {
    await itemModel.deleteMany();
    const itemsData = await itemModel.insertMany(items);
    console.log("All Items Added");
    process.exit();
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
};

importData();
