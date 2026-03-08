const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    leadName: { type: String, required: true },
    leadEmail: { type: String, required: true },
    company: { type: String, required: true },
    industry: { type: String, required: true },

    // AI Generated content
    subject: { type: String, required: true },
    message: { type: String, required: true },
    preheader: { type: String },

    // Campaign metadata
    status: {
      type: String,
      enum: ["draft", "queued", "sent", "failed", "cancelled"],
      default: "queued",
    },

    // Analytics (simulated)
    analytics: {
      openRate: { type: Number, default: 0 },
      replyRate: { type: Number, default: 0 },
      clickRate: { type: Number, default: 0 },
      converted: { type: Boolean, default: false },
    },

    sentAt: { type: Date },
    scheduledAt: { type: Date },
    followUpSent: { type: Boolean, default: false },
    followUpAt: { type: Date },

    webhookTriggered: { type: Boolean, default: false },
    webhookTriggeredAt: { type: Date },
  },
  { timestamps: true }
);

campaignSchema.index({ leadId: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ industry: 1 });
campaignSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Campaign", campaignSchema);
