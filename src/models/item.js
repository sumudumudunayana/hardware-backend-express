const mongoose = require("mongoose");
const Counter = require("./counter");

const itemSchema = new mongoose.Schema(
  {
    itemId: {
      type: Number,
      unique: true,
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
    },

    itemCostPrice: {
      type: Number,
      required: true,
    },

    itemSellingPrice: {
      type: Number,
      required: true,
    },

    itemLabeledPrice: {
      type: Number,
    },

    itemCompany: {
      type: String,
    },

    itemDistributor: {
      type: String,
    },
  },
  { timestamps: true },
);

// SAFE AUTO-INCREMENT
itemSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "itemId" },
      { $inc: { sequenceValue: 1 } },
      { returnDocument: "after", upsert: true },
    );

    this.itemId = counter.sequenceValue;
  }
});

module.exports = mongoose.model("Item", itemSchema);
