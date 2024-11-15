const express = require("express");
const {
  getItemController,
  getSingleItemController,
  addItemController,
  editItemController,
  deleteItemController,
} = require("../controllers/itemController");

const router = express.Router();

// GET all items
router.get("/get-item", getItemController);

// GET single item by ID
router.get("/get-item/:id", getSingleItemController);

// POST add a new item
router.post("/add-item", addItemController);

// PUT update an existing item
router.put("/edit-item/:id", editItemController);

// DELETE delete an item
router.delete("/delete-item/:id", deleteItemController);

module.exports = router;
