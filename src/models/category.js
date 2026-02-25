const mongoose = require("mongoose");
const Counter = require("./counter");

const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: Number,
      unique: true
    },
    categoryName: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    categoryDescription: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// SAFE AUTO-INCREMENT
categorySchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "categoryId" },
      { $inc: { sequenceValue: 1 } },
      { returnDocument: "after", upsert: true }
    );

    this.categoryId = counter.sequenceValue;
  }
});

module.exports = mongoose.model("Category", categorySchema);