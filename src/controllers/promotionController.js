const Promotion = require("../models/promotion");

// CREATE PROMOTION
const createPromotion = async (req, res) => {
  try {
    let {
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

    // clean values
    promotionName = promotionName?.trim();
    promotionDescription = promotionDescription?.trim();

    // required fields
    if (
      !promotionName ||
      !promotionDescription ||
      discountValue === undefined ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        message: "All required fields must be filled.",
      });
    }

    // promotion name validation
    if (!/^[A-Za-z\s]+$/.test(promotionName)) {
      return res.status(400).json({
        message: "Promotion name can contain only letters and spaces",
      });
    }

    if (promotionName.length < 3) {
      return res.status(400).json({
        message: "Promotion name must be at least 3 characters",
      });
    }

    // duplicate check
    const existingPromotion = await Promotion.findOne({
      promotionName,
    });

    if (existingPromotion) {
      return res.status(400).json({
        message: "Promotion name already exists",
      });
    }

    // discount validation
    const discount = Number(discountValue);

    if (isNaN(discount) || discount < 0) {
      return res.status(400).json({
        message: "Discount cannot be negative",
      });
    }

    if (discountType === "percentage" && discount > 100) {
      return res.status(400).json({
        message: "Percentage cannot exceed 100%",
      });
    }

    // date validation
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        message: "End date must be after start date.",
      });
    }

    // item validation
    if (applyTo === "specific" && !itemId) {
      return res.status(400).json({
        message: "Select an item for specific promotion.",
      });
    }

    const promotion = await Promotion.create({
      promotionName,
      promotionDescription,
      discountType,
      discountValue: discount,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      applyTo,
      itemId: applyTo === "specific" ? itemId : null,
      status,
    });

    res.status(201).json(promotion);
  } catch (error) {
    console.error("PROMOTION ERROR:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// GET ALL PROMOTIONS
const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().populate("itemId");

    res.json(promotions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET BY ID
const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate(
      "itemId",
    );

    if (!promotion) {
      return res.status(404).json({
        message: "Promotion not found",
      });
    }

    res.json(promotion);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE PROMOTION
const updatePromotion = async (req, res) => {
  try {
    let {
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

    promotionName = promotionName?.trim();

    promotionDescription = promotionDescription?.trim();

    // duplicate check excluding current record
    const existingPromotion = await Promotion.findOne({
      _id: {
        $ne: req.params.id,
      },
      promotionName,
    });

    if (existingPromotion) {
      return res.status(400).json({
        message: "Another promotion with same name already exists",
      });
    }

    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      {
        promotionName,
        promotionDescription,
        discountType,
        discountValue: Number(discountValue),
        startDate,
        endDate,
        applyTo,
        itemId: applyTo === "specific" ? itemId : null,
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!promotion) {
      return res.status(404).json({
        message: "Promotion not found",
      });
    }

    res.json(promotion);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE PROMOTION
const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);

    if (!promotion) {
      return res.status(404).json({
        message: "Promotion not found",
      });
    }

    res.json({
      message: "Promotion deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPromotion,
  getPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
};
