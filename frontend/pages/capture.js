import { useState } from "react";
import { Card } from "../components/ui";
import LeadCaptureForm from "../components/LeadCaptureForm";

export default function CapturePage() {
  const [success, setSuccess] = useState(null);

  return (
    <div className="animate-slide-up" style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 4 }}>
          Capture New Lead
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          Submit a lead and watch AI generate a personalized outreach campaign in real-time.
        </p>
      </div>

      {success && (
        <div
          style={{
            marginBottom: 20, padding: 16, borderRadius: 12,
            background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)",
          }}
          className="animate-slide-up"
        >
          <div style={{ fontWeight: 700, color: "#4ade80", marginBottom: 4 }}>✅ Lead captured successfully!</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            {success.message || "AI is analyzing the lead and generating a personalized campaign in the background."}
          </div>
        </div>
      )}

      <Card style={{ padding: 24 }}>
        <LeadCaptureForm onSuccess={setSuccess} />
      </Card>

      <Card style={{ padding: 20, marginTop: 20 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Automation Pipeline
        </div>
        {[
          { icon: "1", label: "Lead Captured", desc: "Stored in MongoDB" },
          { icon: "2", label: "AI Analysis", desc: "GPT-4o scores and categorizes the lead" },
          { icon: "3", label: "Campaign Generated", desc: "Personalized outreach email created" },
          { icon: "4", label: "Email Sent", desc: "Campaign delivered via email service" },
          { icon: "5", label: "Webhook Triggered", desc: "POST /api/webhook/campaign fired" },
        ].map((step, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              marginBottom: i < 4 ? 0 : 0,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(168,85,247,0.4))",
                  border: "1px solid rgba(168,85,247,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "#c4b5fd", flexShrink: 0,
                }}
              >
                {step.icon}
              </div>
              {i < 4 && <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)" }} />}
            </div>
            <div style={{ paddingBottom: i < 4 ? 0 : 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{step.label}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
