const express = require("express");
const router = express.Router();
const { triggerCampaign, updateLeadStatus } = require("../controllers/webhookController");

router.post("/campaign", triggerCampaign);
router.post("/lead-status", updateLeadStatus);

module.exports = router;
