const express = require("express");
const {
  getSettings,
  updateSettings,
  calculateDeliveryCharge,
} = require("../../controllers/admin/settings-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.get("/get", getSettings); // Remove auth for now to show settings
router.put("/update", authMiddleware, updateSettings);
router.post("/calculate-delivery", calculateDeliveryCharge); // This one doesn't need auth as it's used during checkout

module.exports = router;
