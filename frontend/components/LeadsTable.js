import { Avatar, ScoreBadge } from "./ui";
import { priorityClass, statusClass, formatDate } from "../lib/utils";

export default function LeadsTable({ leads, onSelect }) {
  if (!leads?.length) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
        No leads yet. Submit your first lead to get started.
      </div>
    );
  }

  const th = { padding: "12px 16px", textAlign: "left", fontWeight: 400, fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid rgba(255,255,255,0.08)" };
  const td = { padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", verticalAlign: "middle" };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr>
            <th style={th}>Lead</th>
            <th style={th}>Industry</th>
            <th style={th}>Score</th>
            <th style={th}>Priority</th>
            <th style={th}>Status</th>
            <th style={th}>Date</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead._id || lead.id}
              onClick={() => onSelect && onSelect(lead)}
              style={{ cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <td style={td}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={lead.name} size={34} />
                  <div>
                    <div style={{ color: "white", fontWeight: 600 }}>{lead.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{lead.company}</div>
                  </div>
                </div>
              </td>
              <td style={{ ...td, color: "rgba(255,255,255,0.6)" }}>{lead.industry}</td>
              <td style={td}>
                <ScoreBadge score={lead.aiAnalysis?.lead_quality_score || lead.score || "—"} />
              </td>
              <td style={td}>
                <span
                  style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, border: "1px solid" }}
                  className={priorityClass(lead.aiAnalysis?.priority_level || lead.priority)}
                >
                  {lead.aiAnalysis?.priority_level || lead.priority || "Pending"}
                </span>
              </td>
              <td style={td}>
                <span
                  style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, border: "1px solid" }}
                  className={statusClass(lead.status)}
                >
                  {lead.status}
                </span>
              </td>
              <td style={{ ...td, color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "monospace" }}>
                {formatDate(lead.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
