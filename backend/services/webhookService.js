const axios = require("axios").default;

/**
 * Webhook Service
 * Triggers automation workflows when campaigns are created or updated
 */

async function triggerCampaignWebhook(campaign, lead) {
  const payload = {
    event: "campaign.created",
    timestamp: new Date().toISOString(),
    data: {
      campaignId: campaign._id,
      leadId: lead._id,
      leadName: lead.name,
      leadEmail: lead.email,
      company: lead.company,
      industry: lead.industry,
      subject: campaign.subject,
      status: campaign.status,
      leadScore: lead.aiAnalysis?.lead_quality_score,
      priority: lead.aiAnalysis?.priority_level,
    },
  };

  console.log("🔗 Webhook triggered:", JSON.stringify(payload, null, 2));

  // If a real webhook URL is configured, send it
  if (process.env.WEBHOOK_URL) {
    try {
      await axios.post(process.env.WEBHOOK_URL, payload, {
        headers: { "Content-Type": "application/json", "X-NexusAI-Secret": process.env.WEBHOOK_SECRET || "" },
        timeout: 5000,
      });
      console.log("✅ Webhook delivered to", process.env.WEBHOOK_URL);
    } catch (err) {
      console.error("⚠️ Webhook delivery failed:", err.message);
    }
  }

  return payload;
}

async function triggerLeadStatusWebhook(lead, previousStatus) {
  const payload = {
    event: "lead.status_changed",
    timestamp: new Date().toISOString(),
    data: {
      leadId: lead._id,
      leadName: lead.name,
      company: lead.company,
      previousStatus,
      newStatus: lead.status,
      leadScore: lead.aiAnalysis?.lead_quality_score,
    },
  };

  console.log("🔗 Lead status webhook:", JSON.stringify(payload, null, 2));
  return payload;
}

module.exports = { triggerCampaignWebhook, triggerLeadStatusWebhook };
