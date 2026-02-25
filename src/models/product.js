const mongoose = require("mongoose");
const Counter = require("./counter");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      unique: true
    },
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

// SAFE AUTO-INCREMENT
productSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "productId" },
      { $inc: { sequenceValue: 1 } },
      { returnDocument: "after", upsert: true }
    );

    this.productId = counter.sequenceValue;
  }
});

module.exports = mongoose.model("Product", productSchema);