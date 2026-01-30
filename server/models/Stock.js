const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0.0001,
    },
    shares: {
      type: Number,
      required: true,
      min: 0.0001,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// User can only add each stock once
PortfolioSchema.index({ user: 1, symbol: 1 }, { unique: true });

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

module.exports = Portfolio;
