const Campaign = require("../models/Campaign");
const Lead = require("../models/Lead");
const { generateCampaignMessage, simulateCampaignAnalytics } = require("../services/aiService");
const { sendCampaignEmail } = require("../services/emailService");

/**
 * POST /api/webhook/campaign
 * Receive webhook and trigger campaign automation
 */
exports.triggerCampaign = async (req, res, next) => {
  try {
    const { leadId, event = "campaign.trigger" } = req.body;

    if (!leadId) {
      return res.status(400).json({ error: "leadId is required" });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    console.log(`🔗 Webhook received: ${event} for lead ${leadId}`);

    // Acknowledge immediately
    res.json({
      success: true,
      message: "Webhook received. Campaign automation triggered.",
      leadId,
      event,
      timestamp: new Date().toISOString(),
    });

    // Process asynchronously
    if (lead.aiAnalysis?.lead_quality_score) {
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
        webhookTriggered: true,
        webhookTriggeredAt: new Date(),
      });
      await campaign.save();

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

      console.log(`✅ Webhook campaign sent to ${lead.email}`);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/webhook/lead-status
 * Update lead status via webhook
 */
exports.updateLeadStatus = async (req, res, next) => {
  try {
    const { leadId, status } = req.body;
    if (!leadId || !status) return res.status(400).json({ error: "leadId and status required" });

    const lead = await Lead.findByIdAndUpdate(leadId, { status }, { new: true });
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    console.log(`🔗 Lead ${leadId} status updated to: ${status}`);
    res.json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};
