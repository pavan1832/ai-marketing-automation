import { useState } from "react";
import { leadsAPI } from "../lib/api";

const INDUSTRIES = [
  "Real Estate", "Marketing", "Finance", "E-commerce",
  "Healthcare", "SaaS", "Education", "Retail", "Manufacturing", "Other",
];

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "12px 16px",
  color: "white",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
};

export default function LeadCaptureForm({ onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", industry: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [steps, setSteps] = useState([]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSteps([]);

    const logSteps = [
      "Capturing lead data...",
      "Running AI lead analysis...",
      "Generating personalized campaign...",
      "Triggering automation workflow...",
    ];

    // Animate steps
    for (let i = 0; i < logSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setSteps((p) => [...p, { text: logSteps[i], done: false }]);
      await new Promise((r) => setTimeout(r, 200));
      setSteps((p) => p.map((s, j) => j === i ? { ...s, done: true } : s));
    }

    try {
      const res = await leadsAPI.create(form);
      setLoading(false);
      onSuccess && onSuccess(res.data);
      setForm({ name: "", email: "", company: "", industry: "", message: "" });
      setSteps([]);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setSteps([]);
    }
  };

  const valid = form.name && form.email && form.company && form.industry && form.message.length >= 10;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <input style={inputStyle} placeholder="Full Name *" value={form.name} onChange={set("name")} required />
          <input style={inputStyle} placeholder="Work Email *" type="email" value={form.email} onChange={set("email")} required />
        </div>
        <input style={{ ...inputStyle, marginBottom: 12 }} placeholder="Company Name *" value={form.company} onChange={set("company")} required />
        <select
          style={{ ...inputStyle, marginBottom: 12, cursor: "pointer" }}
          value={form.industry}
          onChange={set("industry")}
          required
        >
          <option value="" style={{ background: "#0d0d1a" }}>Select Industry *</option>
          {INDUSTRIES.map((i) => (
            <option key={i} value={i} style={{ background: "#0d0d1a" }}>{i}</option>
          ))}
        </select>
        <textarea
          style={{ ...inputStyle, marginBottom: 16, resize: "none" }}
          placeholder="What are you looking to automate? (min. 10 characters) *"
          rows={4}
          value={form.message}
          onChange={set("message")}
          required
        />

        {error && (
          <div style={{
            marginBottom: 12, padding: "10px 14px", borderRadius: 8,
            background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
            color: "#fca5a5", fontSize: 13,
          }}>
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !valid}
          style={{
            width: "100%", padding: "14px 24px", borderRadius: 12,
            background: loading || !valid ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg, #7c3aed, #a855f7)",
            color: "white", fontWeight: 700, fontSize: 14, border: "none",
            cursor: loading || !valid ? "not-allowed" : "pointer",
            fontFamily: "inherit", transition: "all 0.3s",
            boxShadow: loading || !valid ? "none" : "0 0 24px rgba(124,58,237,0.4)",
          }}
        >
          {loading ? "⚡ AI Processing Lead..." : "🚀 Submit Lead & Generate Campaign"}
        </button>
      </form>

      {steps.length > 0 && (
        <div
          style={{
            marginTop: 16, borderRadius: 12, padding: 16,
            background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.2)",
          }}
        >
          <div style={{ fontSize: 10, color: "rgba(74,222,128,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontFamily: "monospace" }}>
            AI Processing Log
          </div>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: "#4ade80", width: 14 }}>{s.done ? "✓" : "⟳"}</span>
              <span style={{ color: s.done ? "rgba(255,255,255,0.5)" : "#4ade80" }}>{s.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
