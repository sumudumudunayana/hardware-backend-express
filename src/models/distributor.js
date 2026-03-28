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
      type: String,
      trim: true
    },

    distributorEmail: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  { timestamps: true }
);

// SAFE AUTO-INCREMENT
distributorSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "distributorId" },
      { $inc: { sequenceValue: 1 } },
      { returnDocument: "after", upsert: true }
    );

    this.distributorId = counter.sequenceValue;
  }
});



module.exports = mongoose.model("Distributor", distributorSchema);