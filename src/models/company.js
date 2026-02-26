const mongoose = require("mongoose");
const Counter = require("./counter");

const companySchema = new mongoose.Schema(
  {
    companyId: {
      type: Number,
      unique: true
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    companyDescription: {
      type: String,
      trim: true
    },

    companyAddress: {
      type: String,
      trim: true
    },

    companyContactNumber: {
      type: Number
    },

    companyEmail: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  { timestamps: true }
);

// SAFE AUTO-INCREMENT
companySchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "companyId" },
      { $inc: { sequenceValue: 1 } },
      { returnDocument: "after", upsert: true }
    );

    this.companyId = counter.sequenceValue;
  }
});

module.exports = mongoose.model("Company", companySchema);