const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    deliveryCharges: {
      type: Number,
      default: 50,
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 1000,
    },
    areaSpecificCharges: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema);