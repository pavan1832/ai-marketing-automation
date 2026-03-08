const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Analyze a lead using OpenAI and return structured JSON
 */
async function analyzeLead(lead) {
  const prompt = `You are an expert B2B sales analyst. Analyze this business lead and return ONLY a valid JSON object with no markdown, no explanation, no code fences.

Lead Details:
- Name: ${lead.name}
- Company: ${lead.company}
- Industry: ${lead.industry}
- Message: "${lead.message}"

Return exactly this JSON structure:
{
  "industry_category": "specific industry subcategory",
  "lead_quality_score": <integer 1-10>,
  "priority_level": "High" | "Medium" | "Low",
  "recommended_marketing_strategy": "2-3 sentence strategy tailored to this specific lead"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 400,
    });

    const content = response.choices[0].message.content.trim();
    const analysis = JSON.parse(content);

    console.log(`✅ AI Lead Analysis complete for ${lead.name}: Score ${analysis.lead_quality_score}/10`);
    return analysis;
  } catch (error) {
    console.error("❌ AI Lead Analysis failed:", error.message);
    // Graceful fallback
    return {
      industry_category: lead.industry,
      lead_quality_score: 6,
      priority_level: "Medium",
      recommended_marketing_strategy: `Focus on ${lead.industry}-specific pain points with personalized outreach highlighting automation benefits and ROI.`,
    };
  }
}

/**
 * Generate a personalized marketing campaign message using OpenAI
 */
async function generateCampaignMessage(lead, analysis) {
  const prompt = `You are an expert B2B email copywriter. Generate a compelling outreach email for this lead. Return ONLY a valid JSON object with no markdown or code fences.

Lead:
- Name: ${lead.name}
- Company: ${lead.company}  
- Industry: ${lead.industry}
- Their Need: "${lead.message}"
- AI Strategy: "${analysis.recommended_marketing_strategy}"
- Lead Score: ${analysis.lead_quality_score}/10

Return exactly this JSON:
{
  "subject": "compelling email subject line (max 60 chars)",
  "preheader": "email preheader text (max 90 chars)",
  "message": "3-4 sentence personalized email body. Address by first name. Mention their company. Reference their specific need. End with a clear but soft CTA."
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content.trim();
    const campaign = JSON.parse(content);

    console.log(`✅ Campaign generated for ${lead.name}: "${campaign.subject}"`);
    return campaign;
  } catch (error) {
    console.error("❌ Campaign generation failed:", error.message);
    const firstName = lead.name.split(" ")[0];
    return {
      subject: `AI-Powered Automation for ${lead.company}`,
      preheader: `See how we help ${lead.industry} companies automate growth`,
      message: `Hi ${firstName}, we noticed ${lead.company} is looking to streamline operations in the ${lead.industry} space. Our AI automation platform helps businesses like yours eliminate manual workflows and scale faster. Would you be open to a 15-minute call to explore what's possible? Reply here to schedule.`,
    };
  }
}

/**
 * Simulate analytics for a campaign (in production, this would use real email tracking)
 */
function simulateCampaignAnalytics(leadScore) {
  // Higher quality leads get better simulated metrics
  const baseOpen = 0.3 + (leadScore / 10) * 0.4;
  const baseReply = 0.05 + (leadScore / 10) * 0.25;
  const baseClick = 0.1 + (leadScore / 10) * 0.2;

  return {
    openRate: Math.round((baseOpen + Math.random() * 0.1) * 100),
    replyRate: Math.round((baseReply + Math.random() * 0.05) * 100),
    clickRate: Math.round((baseClick + Math.random() * 0.05) * 100),
    converted: Math.random() < (leadScore / 10) * 0.4,
  };
}

module.exports = { analyzeLead, generateCampaignMessage, simulateCampaignAnalytics };
