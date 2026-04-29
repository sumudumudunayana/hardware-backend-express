const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema(
  {
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      required: true,
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    unitPrice: {
      type: Number,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.SaleItem || mongoose.model("SaleItem", saleItemSchema);
