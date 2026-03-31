const express = require("express");
const router = express.Router();

const {
  getStocks,
  createStock,
  updateStock,
  deleteStock,
  getStockByItem,
  getStockHistory
} = require("../controllers/stockController");

const { protect } = require("../middleware/authMiddleware");

// Protect ALL routes
router.use(protect);

//  GET all stock
router.get("/", getStocks);

//  CREATE stock
router.post("/", createStock);

//  UPDATE stock
router.put("/:id", updateStock);

//  DELETE stock
router.delete("/:id", deleteStock);

//  GET stock by item
router.get("/item/:itemId", getStockByItem);

//  GET stock history
router.get("/history/:itemId", getStockHistory);

module.exports = router;