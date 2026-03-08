import { statusClass, formatDate } from "../lib/utils";

export default function CampaignCard({ campaign }) {
  const c = campaign;
  return (
    <div
      style={{
        borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.025)", padding: 20,
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{c.leadName}</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 2 }}>
            {c.company} · {c.industry}
          </div>
        </div>
        <span
          style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, border: "1px solid", flexShrink: 0 }}
          className={statusClass(c.status)}
        >
          {c.status}
        </span>
      </div>

      <div style={{ marginBottom: 4, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
        📧 {c.subject}
      </div>
      <div
        style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 14 }}
        className="line-clamp-2"
      >
        {c.message}
      </div>

      {c.status === "sent" && (
        <div
          style={{
            display: "flex", gap: 20, paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>Open Rate</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#60a5fa" }}>
              {c.analytics?.openRate ?? 0}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>Reply Rate</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#4ade80" }}>
              {c.analytics?.replyRate ?? 0}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>Click Rate</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fb923c" }}>
              {c.analytics?.clickRate ?? 0}%
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>Sent</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
              {formatDate(c.sentAt)}
            </div>
          </div>
        </div>
      )}

      {c.status === "queued" && (
        <div style={{ paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize: 11, color: "#fbbf24" }}>⚡ Queued for delivery</span>
        </div>
      )}
    </div>
  );
}
