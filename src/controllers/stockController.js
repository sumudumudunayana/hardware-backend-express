const Stock = require("../models/stock");
const StockEntry = require("../models/stockEntry");

// GET ALL STOCKS
const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find()
      .populate("itemId")
      .sort({ createdAt: -1 });

    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE STOCK
const createStock = async (req, res) => {
  try {
    const { itemId, quantity, arrivalDate } = req.body;
    // Save history
    await StockEntry.create({
      itemId,
      quantity,
      arrivalDate,
    });
    // Update current stock
    let stock = await Stock.findOne({ itemId });
    if (stock) {
      stock.quantity += quantity;
      await stock.save();
    } else {
      stock = await Stock.create({
        itemId,
        quantity,
      });
    }
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STOCK QUANTITY
const updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }
    const stock = await Stock.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true },
    );
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.status(200).json(stock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE STOCK
const deleteStock = async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET STOCK BY ITEM ID
const getStockByItem = async (req, res) => {
  try {
    const stock = await Stock.findOne({ itemId: req.params.itemId });

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET STOCK HISTORY FOR AN ITEM
const getStockHistory = async (req, res) => {
  try {
    const history = await StockEntry.find({ itemId: req.params.itemId })
      .populate("itemId")
      .sort({ arrivalDate: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStocks,
  createStock,
  updateStock,
  deleteStock,
  getStockByItem,
  getStockHistory,
};
