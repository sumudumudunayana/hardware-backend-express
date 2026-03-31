const express = require("express");
const router = express.Router();

const {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale
} = require("../controllers/saleController");

const { protect } = require("../middleware/authMiddleware");

// Protect ALL routes
router.use(protect);

//  CREATE sale
router.post("/", createSale);

//  GET all sales
router.get("/", getAllSales);

//  GET single sale
router.get("/:id", getSaleById);

//  UPDATE sale
router.put("/:id", updateSale);

//  DELETE sale
router.delete("/:id", deleteSale);

module.exports = router;