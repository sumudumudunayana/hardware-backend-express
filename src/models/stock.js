const mongoose = require("mongoose");
const Counter = require("./counter");

const stockSchema = new mongoose.Schema(
  {
    stockId: {
      type: Number,
      unique: true
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      unique: true,
      index: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },
  { timestamps: true }
);

// AUTO INCREMENT
stockSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "stockId" },
      { $inc: { sequenceValue: 1 } },
      { new: true, upsert: true }
    );

    this.stockId = counter.sequenceValue;
  }
});

module.exports = mongoose.model("Stock", stockSchema);