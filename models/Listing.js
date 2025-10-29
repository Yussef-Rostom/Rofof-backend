const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    condition: {
      type: String,
      required: true,
      // Using an enum is good practice for fields like 'condition'
      enum: ["New", "Like New", "Good", "Fair", "Acceptable"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrls: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ["Available", "Pending", "Sold"],
      default: "Available",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Listing", listingSchema);
