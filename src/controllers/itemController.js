const Item = require("../models/item");
const Stock = require("../models/stock");


// GET ALL ITEMS
const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE ITEM
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE ITEM
const createItem = async (req, res) => {
  try {
    // Create item
    const newItem = await Item.create(req.body);
    //Automatically create stock entry for this item
    await Stock.create({
      itemId: newItem._id,
      quantity: 0,
    });
    //Send response
    res.status(201).json({
      message: "Item created successfully with stock record",
      item: newItem,
    });
  } catch (error) {
    console.error("CREATE ITEM ERROR:", error);
    res.status(400).json({
      message: error.message,
    });
  }
};

// UPDATE ITEM
const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE ITEM
const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
