const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    message: { type: String, required: true },

    // AI Analysis fields
    aiAnalysis: {
      industry_category: { type: String },
      lead_quality_score: { type: Number, min: 1, max: 10 },
      priority_level: { type: String, enum: ["High", "Medium", "Low"] },
      recommended_marketing_strategy: { type: String },
      analyzed_at: { type: Date },
    },

    status: {
      type: String,
      enum: ["pending", "analyzed", "contacted", "converted", "disqualified"],
      default: "pending",
    },

    source: { type: String, default: "web_form" },
    tags: [{ type: String }],
    notes: { type: String },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  },
  { timestamps: true }
);

leadSchema.index({ email: 1 });
leadSchema.index({ industry: 1 });
leadSchema.index({ "aiAnalysis.priority_level": 1 });
leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Lead", leadSchema);
