const itemModel = require("../models/itemModel");

// get items
const getItemController = async (req, res) => {
  console.log("haiiiii");
  try {
    const items = await itemModel.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getSingleItemController = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await itemModel.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//add items
const addItemController = async (req, res) => {
  try {
    const newItem = new itemModel(req.body);
    await newItem.save();
    res
      .status(201)
      .json({ message: "Item Created Successfully", item: newItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//update item
const editItemController = async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedItem = await itemModel.findByIdAndUpdate(itemId, req.body, {
      new: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res
      .status(200)
      .json({ message: "Item Updated Successfully", item: updatedItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteItemController = async (req, res) => {
  console.log("hai", req.body);
  try {
    const itemId = req.params.id;
    const deletedItem = await itemModel.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res
      .status(200)
      .json({ message: "Item Deleted Successfully", item: deletedItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getItemController,
  getSingleItemController,
  addItemController,
  editItemController,
  deleteItemController,
};
