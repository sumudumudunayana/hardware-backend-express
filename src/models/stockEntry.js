const mongoose = require("mongoose");

const stockEntrySchema = new mongoose.Schema(
{
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  arrivalDate: {
    type: Date,
    required: true
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("StockEntry", stockEntrySchema);