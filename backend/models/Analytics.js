const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    totalLeads: { type: Number, default: 0 },
    campaignsSent: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    avgOpenRate: { type: Number, default: 0 },
    avgReplyRate: { type: Number, default: 0 },
    industryBreakdown: [
      {
        industry: String,
        count: Number,
        conversionRate: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analytics", analyticsSchema);
