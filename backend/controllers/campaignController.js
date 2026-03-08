const Campaign = require("../models/Campaign");
const Lead = require("../models/Lead");
const { generateCampaignMessage, simulateCampaignAnalytics } = require("../services/aiService");
const { sendCampaignEmail } = require("../services/emailService");

/**
 * GET /api/campaigns
 */
exports.getCampaigns = async (req, res, next) => {
  try {
    const { status, industry, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (industry) filter.industry = industry;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [campaigns, total] = await Promise.all([
      Campaign.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Campaign.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: campaigns,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/campaigns/:id
 */
exports.getCampaignById = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id).lean();
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    res.json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/campaigns/regenerate/:leadId
 * Regenerate a campaign for an existing lead
 */
exports.regenerateCampaign = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.leadId);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    if (!lead.aiAnalysis?.lead_quality_score) {
      return res.status(400).json({ error: "Lead has not been analyzed yet" });
    }

    const campaignContent = await generateCampaignMessage(lead, lead.aiAnalysis);
    const analytics = simulateCampaignAnalytics(lead.aiAnalysis.lead_quality_score);

    const campaign = new Campaign({
      leadId: lead._id,
      leadName: lead.name,
      leadEmail: lead.email,
      company: lead.company,
      industry: lead.industry,
      subject: campaignContent.subject,
      message: campaignContent.message,
      preheader: campaignContent.preheader,
      status: "queued",
    });
    await campaign.save();

    // Simulate sending
    await sendCampaignEmail({
      to: lead.email,
      subject: campaignContent.subject,
      preheader: campaignContent.preheader,
      message: campaignContent.message,
      campaignId: campaign._id,
      leadName: lead.name,
    });

    campaign.status = "sent";
    campaign.sentAt = new Date();
    campaign.analytics = analytics;
    await campaign.save();

    res.json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/campaigns/:id
 */
exports.updateCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    res.json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};
