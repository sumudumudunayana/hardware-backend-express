const mongoose = require("mongoose");
const Counter = require("./counter");

const distributorSchema = new mongoose.Schema(
  {
    distributorId: {
      type: Number,
      unique: true
    },

    distributorName: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    distributorDescription: {
      type: String,
      trim: true
    },

    distributorContactNumber: {
      type: Number
    },

    distributorEmail: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Distributor", distributorSchema);