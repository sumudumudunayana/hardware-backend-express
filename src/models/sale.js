const mongoose = require("mongoose");
const Counter = require("./counter");

const saleSchema = new mongoose.Schema(
  {
    saleId: {
      type: Number,
      unique: true,
    },

    invoiceNumber: {
      type: String,
      unique: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },
    promotions: [
      {
        promotionId: { type: mongoose.Schema.Types.ObjectId, ref: "Promotion" },
        name: String,
        discountType: { type: String, enum: ["percentage", "fixed"] },
        discountValue: Number,
        amount: Number, // calculated discount amount in Rs
      },
    ],
  },
  { timestamps: true },
);

// Auto increment saleId
saleSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "saleId" },
      { $inc: { sequenceValue: 1 } },
      { new: true, upsert: true },
    );

    this.saleId = counter.sequenceValue;
    this.invoiceNumber = "INV-" + counter.sequenceValue;
  }
});

module.exports = mongoose.model("Sale", saleSchema);
