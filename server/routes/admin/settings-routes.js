const express = require("express");
const {
  getSettings,
  updateSettings,
  calculateDeliveryCharge,
} = require("../../controllers/admin/settings-controller");

const router = express.Router();

router.get("/get", getSettings);
router.put("/update", updateSettings);
router.post("/calculate-delivery", calculateDeliveryCharge);

module.exports = router;
