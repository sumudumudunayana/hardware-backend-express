const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    itemDescription: {
      type: String,
      trim: true,
    },
    itemCategory: {
      type: String,
      required: true,
      trim: true,
    },
    itemCostPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    itemSellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    itemLabeledPrice: {
      type: Number,
      min: 0,
    },
    itemCompany: {
      type: String,
      trim: true,
    },
    itemDistributor: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Product", productSchema);