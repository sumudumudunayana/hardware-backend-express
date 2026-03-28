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

//  Protect ALL routes
router.use(protect);

//  Get cart
router.get("/", getCart);

//  Add item
router.post("/add", addToCart);

//  Update quantity
router.put("/update", updateQty);

//  Clear cart
router.delete("/clear", clearCart);

//  Remove single item
router.delete("/remove/:itemId", removeItem);

module.exports = router;