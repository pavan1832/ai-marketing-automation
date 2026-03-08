const express = require("express");
const router = express.Router();
const { getCampaigns, getCampaignById, regenerateCampaign, updateCampaign } = require("../controllers/campaignController");

router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.post("/regenerate/:leadId", regenerateCampaign);
router.patch("/:id", updateCampaign);

module.exports = router;
