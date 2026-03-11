const mongoose = require("mongoose");
const Counter = require("./counter");

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: Number,
      unique: true
    },

    customerName: {
      type: String,
      required: true,
      trim: true
    },

    customerContactNumber: {
      type: String,
      trim: true
    },

    customerEmail: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  { timestamps: true }
);

// SAFE AUTO-INCREMENT
customerSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "customerId" },
      { $inc: { sequenceValue: 1 } },
      { returnDocument: "after", upsert: true }
    );

    this.customerId = counter.sequenceValue;
  }
});

module.exports = mongoose.model("Customer", customerSchema);