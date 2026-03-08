const Lead = require("../models/Lead");
const Campaign = require("../models/Campaign");

/**
 * GET /api/analytics/overview
 */
exports.getOverview = async (req, res, next) => {
  try {
    const [totalLeads, totalCampaigns, sentCampaigns, convertedLeads] = await Promise.all([
      Lead.countDocuments(),
      Campaign.countDocuments(),
      Campaign.countDocuments({ status: "sent" }),
      Lead.countDocuments({ status: "converted" }),
    ]);

    const campaignStats = await Campaign.aggregate([
      { $match: { status: "sent" } },
      {
        $group: {
          _id: null,
          avgOpenRate: { $avg: "$analytics.openRate" },
          avgReplyRate: { $avg: "$analytics.replyRate" },
          avgClickRate: { $avg: "$analytics.clickRate" },
        },
      },
    ]);

    const stats = campaignStats[0] || { avgOpenRate: 0, avgReplyRate: 0, avgClickRate: 0 };

    res.json({
      success: true,
      data: {
        totalLeads,
        totalCampaigns,
        sentCampaigns,
        convertedLeads,
        conversionRate: totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0,
        avgOpenRate: Math.round(stats.avgOpenRate || 0),
        avgReplyRate: Math.round(stats.avgReplyRate || 0),
        avgClickRate: Math.round(stats.avgClickRate || 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/industry
 */
exports.getIndustryBreakdown = async (req, res, next) => {
  try {
    const breakdown = await Lead.aggregate([
      {
        $group: {
          _id: "$industry",
          totalLeads: { $sum: 1 },
          avgScore: { $avg: "$aiAnalysis.lead_quality_score" },
          highPriority: { $sum: { $cond: [{ $eq: ["$aiAnalysis.priority_level", "High"] }, 1, 0] } },
          converted: { $sum: { $cond: [{ $eq: ["$status", "converted"] }, 1, 0] } },
        },
      },
      { $sort: { totalLeads: -1 } },
    ]);

    res.json({ success: true, data: breakdown });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/campaigns
 */
exports.getCampaignPerformance = async (req, res, next) => {
  try {
    const performance = await Campaign.aggregate([
      { $match: { status: "sent" } },
      {
        $group: {
          _id: "$industry",
          count: { $sum: 1 },
          avgOpenRate: { $avg: "$analytics.openRate" },
          avgReplyRate: { $avg: "$analytics.replyRate" },
          conversions: { $sum: { $cond: ["$analytics.converted", 1, 0] } },
        },
      },
      { $sort: { avgOpenRate: -1 } },
    ]);

    res.json({ success: true, data: performance });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/timeline
 */
exports.getTimeline = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [leadsTimeline, campaignsTimeline] = await Promise.all([
      Lead.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Campaign.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: "sent" } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$sentAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({ success: true, data: { leadsTimeline, campaignsTimeline } });
  } catch (error) {
    next(error);
  }
};
