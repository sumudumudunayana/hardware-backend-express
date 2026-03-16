const Promotion = require("../models/promotion");

// CREATE PROMOTION
const createPromotion = async (req, res) => {
  try {
    const {
      promotionName,
      promotionDescription,
      discountType,
      discountValue,
      startDate,
      endDate,
      applyTo,
      itemId,
      status,
    } = req.body;

    if (
      !promotionName ||
      !promotionDescription ||
      !discountValue ||
      !startDate ||
      !endDate
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }
    if (new Date(endDate) <= new Date(startDate)) {
      return res
        .status(400)
        .json({ message: "End date must be after start date." });
    }
    if (applyTo === "specific" && !itemId) {
      return res
        .status(400)
        .json({ message: "Select an item for specific promotion." });
    }
    const promotion = await Promotion.create({
      promotionName,
      promotionDescription,
      discountType,
      discountValue: Number(discountValue),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      applyTo,
      itemId: applyTo === "specific" ? itemId : null,
      status,
    });
    res.status(201).json(promotion);
  } catch (error) {
    console.error("PROMOTION ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};

// GET ALL PROMOTIONS
const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().populate("itemId");
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY ID
const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate(
      "itemId",
    );
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROMOTION
const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.json(promotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE PROMOTION
const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.json({ message: "Promotion deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPromotion,
  getPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
};
