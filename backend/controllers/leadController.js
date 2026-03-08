const Lead = require("../models/Lead");
const Campaign = require("../models/Campaign");
const { analyzeLead, generateCampaignMessage, simulateCampaignAnalytics } = require("../services/aiService");
const { sendCampaignEmail } = require("../services/emailService");
const { triggerCampaignWebhook } = require("../services/webhookService");

/**
 * POST /api/leads
 * Create a new lead, analyze with AI, and generate campaign
 */
exports.createLead = async (req, res, next) => {
  try {
    const { name, email, company, industry, message } = req.body;

    if (!name || !email || !company || !industry || !message) {
      return res.status(400).json({ error: "All fields are required: name, email, company, industry, message" });
    }

    // 1. Save lead to MongoDB
    const lead = new Lead({ name, email, company, industry, message });
    await lead.save();
    console.log(`✅ Lead created: ${name} from ${company}`);

    // 2. AI Analysis (async - respond to client first, then process)
    res.status(201).json({
      success: true,
      message: "Lead captured successfully. AI analysis and campaign generation in progress.",
      lead: { id: lead._id, name, email, company, industry, status: lead.status },
    });

    // 3. Process asynchronously
    processLeadAsync(lead);
  } catch (error) {
    next(error);
  }
};

async function processLeadAsync(lead) {
  try {
    // Analyze with AI
    console.log(`🤖 Analyzing lead: ${lead.name}`);
    const analysis = await analyzeLead(lead);

    lead.aiAnalysis = { ...analysis, analyzed_at: new Date() };
    lead.status = "analyzed";
    await lead.save();

    // Generate campaign
    console.log(`✍️ Generating campaign for: ${lead.name}`);
    const campaignContent = await generateCampaignMessage(lead, analysis);

    // Simulate analytics
    const analytics = simulateCampaignAnalytics(analysis.lead_quality_score);

    // Create campaign
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

    lead.campaignId = campaign._id;
    lead.status = "contacted";
    await lead.save();

    // Send email (simulated)
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
    campaign.webhookTriggered = true;
    campaign.webhookTriggeredAt = new Date();
    await campaign.save();

    if (analytics.converted) {
      lead.status = "converted";
      await lead.save();
    }

    // Trigger webhook
    await triggerCampaignWebhook(campaign, lead);

    console.log(`🎉 Full automation complete for ${lead.name}`);
  } catch (error) {
    console.error(`❌ Async processing failed for lead ${lead._id}:`, error.message);
  }
}

/**
 * GET /api/leads
 * Get all leads with optional filtering
 */
exports.getLeads = async (req, res, next) => {
  try {
    const { industry, priority, status, limit = 50, page = 1 } = req.query;
    const filter = {};

    if (industry) filter.industry = industry;
    if (priority) filter["aiAnalysis.priority_level"] = priority;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Lead.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: leads,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leads/:id
 */
exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("campaignId").lean();
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/leads/:id
 */
exports.updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/leads/:id
 */
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ success: true, message: "Lead deleted" });
  } catch (error) {
    next(error);
  }
};
