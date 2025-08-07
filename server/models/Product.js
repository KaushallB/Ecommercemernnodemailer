const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    // Eco-friendly specific fields
    isOrganic: {
      type: Boolean,
      default: false
    },
    sustainabilityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 1
    },
    carbonFootprint: {
      type: String,
      enum: ['low', 'medium', 'high', 'neutral'],
      default: 'medium'
    },
    certifications: [{
      type: String,
      enum: ['organic', 'fair-trade', 'biodegradable', 'recyclable', 'sustainable', 'cruelty-free', 'locally-sourced']
    }],
    origin: {
      type: String,
      default: 'Nepal'
    },
    expiryDate: {
      type: Date
    },
    weight: {
      type: String
    },
    packagingType: {
      type: String,
      enum: ['biodegradable', 'recyclable', 'reusable', 'minimal', 'plastic-free'],
      default: 'biodegradable'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
