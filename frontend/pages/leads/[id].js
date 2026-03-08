import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { leadsAPI, campaignsAPI } from "../../lib/api";
import { Card, Avatar, LoadingSpinner } from "../../components/ui";
import CampaignCard from "../../components/CampaignCard";
import { scoreColor, priorityClass, statusClass, formatDate } from "../../lib/utils";

export default function LeadDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [lead, setLead] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const [lRes, cRes] = await Promise.allSettled([
          leadsAPI.getById(id),
          campaignsAPI.getAll({ leadId: id }),
        ]);
        if (lRes.status === "fulfilled") setLead(lRes.value.data.data);
        if (cRes.status === "fulfilled") setCampaigns(cRes.value.data.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!lead) return <p style={{ color: "rgba(255,255,255,0.5)" }}>Lead not found.</p>;

  const score = lead.aiAnalysis?.lead_quality_score;

  return (
    <div className="animate-slide-up" style={{ maxWidth: 840 }}>
      <button
        onClick={() => router.back()}
        style={{ marginBottom: 20, fontSize: 13, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer" }}
      >
        ← Back
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <Avatar name={lead.name} size={48} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "white" }}>{lead.name}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{lead.company} · {lead.industry}</div>
            </div>
          </div>
          {[
            ["Email", lead.email],
            ["Status", <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, border: "1px solid" }} className={statusClass(lead.status)}>{lead.status}</span>],
            ["Created", formatDate(lead.createdAt)],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>{k}</span>
              <span style={{ color: "rgba(255,255,255,0.8)" }}>{v}</span>
            </div>
          ))}
          <div style={{ paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 4 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>Their Message</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{lead.message}</div>
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, fontFamily: "monospace" }}>
            AI Analysis
          </div>
          {lead.aiAnalysis ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: scoreColor(score) + "20",
                    border: `2px solid ${scoreColor(score)}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, fontWeight: 800, color: scoreColor(score),
                  }}
                >
                  {score}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Lead Quality Score</div>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, border: "1px solid" }} className={priorityClass(lead.aiAnalysis.priority_level)}>
                    {lead.aiAnalysis.priority_level} Priority
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>Category</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>{lead.aiAnalysis.industry_category}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>Recommended Strategy</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{lead.aiAnalysis.recommended_marketing_strategy}</div>
            </div>
          ) : (
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Analysis pending...</div>
          )}
        </Card>
      </div>

      {campaigns.length > 0 && (
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 16 }}>Campaigns for this Lead</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {campaigns.map((c) => <CampaignCard key={c._id} campaign={c} />)}
          </div>
        </Card>
      )}
    </div>
  );
}
