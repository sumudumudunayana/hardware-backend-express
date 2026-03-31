const express = require("express");
const router = express.Router();

const {
  createPromotion,
  getPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion
} = require("../controllers/promotionController");

const { protect } = require("../middleware/authMiddleware");

// Protect ALL routes
router.use(protect);

//  CREATE promotion
router.post("/", createPromotion);

//  GET all promotions
router.get("/", getPromotions);

//  GET single promotion
router.get("/:id", getPromotionById);

//  UPDATE promotion
router.put("/:id", updatePromotion);

//  DELETE promotion
router.delete("/:id", deletePromotion);

module.exports = router;