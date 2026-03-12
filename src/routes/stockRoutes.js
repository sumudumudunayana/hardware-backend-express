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

router.get("/", getStocks);
router.post("/", createStock);
router.put("/:id", updateStock);
router.delete("/:id", deleteStock);
router.get("/item/:itemId", getStockByItem);
router.get("/history/:itemId", getStockHistory);

module.exports = router;