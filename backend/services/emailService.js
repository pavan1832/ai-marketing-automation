/**
 * Email Service
 * In production: integrate with SendGrid, Mailgun, or AWS SES
 * Currently: simulates email sending with detailed logging
 */

async function sendCampaignEmail({ to, subject, preheader, message, campaignId, leadName }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

  const emailLog = {
    timestamp: new Date().toISOString(),
    campaignId,
    to,
    leadName,
    subject,
    status: "delivered",
    messageId: `msg_${Math.random().toString(36).slice(2, 12)}`,
  };

  console.log("📧 ==========================================");
  console.log(`📧 Campaign email sent to ${to}`);
  console.log(`📧 Campaign ID: ${campaignId}`);
  console.log(`📧 Subject: ${subject}`);
  console.log(`📧 Recipient: ${leadName}`);
  console.log(`📧 Message ID: ${emailLog.messageId}`);
  console.log(`📧 Status: DELIVERED`);
  console.log("📧 ==========================================");

  return emailLog;
}

async function sendFollowUpEmail({ to, leadName, originalSubject, campaignId }) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  console.log(`📧 Follow-up email sent to ${to} | Campaign: ${campaignId}`);

  return {
    timestamp: new Date().toISOString(),
    campaignId,
    to,
    leadName,
    subject: `Re: ${originalSubject}`,
    status: "delivered",
    type: "follow_up",
    messageId: `fu_${Math.random().toString(36).slice(2, 12)}`,
  };
}

module.exports = { sendCampaignEmail, sendFollowUpEmail };
