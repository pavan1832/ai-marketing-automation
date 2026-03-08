const express = require("express");
const router = express.Router();
const { getOverview, getIndustryBreakdown, getCampaignPerformance, getTimeline } = require("../controllers/analyticsController");

router.get("/overview", getOverview);
router.get("/industry", getIndustryBreakdown);
router.get("/campaigns", getCampaignPerformance);
router.get("/timeline", getTimeline);

module.exports = router;
