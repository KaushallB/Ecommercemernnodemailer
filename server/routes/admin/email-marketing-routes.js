const express = require("express");
const {
  getEmailMarketingMetrics,
  sendEmailCampaign,
} = require("../../controllers/admin/email-marketing-controller");

const router = express.Router();

router.get("/metrics", getEmailMarketingMetrics);
router.post("/send-campaign", sendEmailCampaign);

module.exports = router;
