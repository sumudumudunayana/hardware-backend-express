const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true
  },

  name: String,

  price: Number,

  quantity: {
    type: Number,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [cartItemSchema]

}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);