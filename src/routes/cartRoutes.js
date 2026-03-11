const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateQty,
  clearCart,
  removeItem
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update", protect, updateQty);
router.delete("/clear", protect, clearCart);
router.delete("/remove/:itemId", protect, removeItem);

module.exports = router;