const mongoose = require("mongoose");
const Counter = require("./counter");

const promotionSchema = new mongoose.Schema(
  {
    promotionId: {
      type: Number,
      unique: true
    },

    promotionName: {
      type: String,
      required: true
    },

    promotionDescription: {
      type: String,
      required: true
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    applyTo: {
      type: String,
      enum: ["all", "specific"],
      required: true
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      default: null
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

// AUTO INCREMENT promotionId
promotionSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "promotionId" },
      { $inc: { sequenceValue: 1 } },
      { new: true, upsert: true }
    );

    this.promotionId = counter.sequenceValue;
  }
});

module.exports = mongoose.model("Promotion", promotionSchema);