import { useEffect, useState } from "react";
import { campaignsAPI } from "../../lib/api";
import { Card, LoadingSpinner, EmptyState } from "../../components/ui";
import CampaignCard from "../../components/CampaignCard";

const STATUSES = ["All", "sent", "queued", "draft", "failed"];
const INDUSTRIES = ["All", "Real Estate", "Marketing", "Finance", "E-commerce", "Healthcare", "SaaS"];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "All", industry: "All" });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = { limit: 100 };
        if (filters.status !== "All") params.status = filters.status;
        if (filters.industry !== "All") params.industry = filters.industry;
        const res = await campaignsAPI.getAll(params);
        setCampaigns(res.data.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filters]);

  const filterBtn = (key, val) => (
    <button
      key={val}
      onClick={() => setFilters((p) => ({ ...p, [key]: val }))}
      style={{
        padding: "6px 14px", borderRadius: 8, fontSize: 12, border: "1px solid",
        cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
        background: filters[key] === val ? "rgba(124,58,237,0.3)" : "transparent",
        borderColor: filters[key] === val ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.1)",
        color: filters[key] === val ? "#c4b5fd" : "rgba(255,255,255,0.5)",
      }}
    >
      {val}
    </button>
  );

  const sent = campaigns.filter((c) => c.status === "sent");
  const queued = campaigns.filter((c) => c.status === "queued");

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 4 }}>Campaigns</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          {campaigns.length} total · {sent.length} sent · {queued.length} queued
        </p>
      </div>

      <Card style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", textTransform: "uppercase" }}>Status:</span>
          {STATUSES.map((v) => filterBtn("status", v))}
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", textTransform: "uppercase", marginLeft: 8 }}>Industry:</span>
          {INDUSTRIES.map((v) => filterBtn("industry", v))}
        </div>
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : campaigns.length === 0 ? (
        <Card>
          <EmptyState icon="✦" title="No campaigns yet" description="Campaigns are generated automatically when leads are captured." />
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {campaigns.map((c) => <CampaignCard key={c._id} campaign={c} />)}
        </div>
      )}
    </div>
  );
}
