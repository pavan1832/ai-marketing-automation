import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { leadsAPI } from "../../lib/api";
import { Card, LoadingSpinner, EmptyState } from "../../components/ui";
import LeadsTable from "../../components/LeadsTable";

const INDUSTRIES = ["All", "Real Estate", "Marketing", "Finance", "E-commerce", "Healthcare", "SaaS", "Education"];
const PRIORITIES = ["All", "High", "Medium", "Low"];
const STATUSES = ["All", "pending", "analyzed", "contacted", "converted"];

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ industry: "All", priority: "All", status: "All" });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = {};
        if (filters.industry !== "All") params.industry = filters.industry;
        if (filters.priority !== "All") params.priority = filters.priority;
        if (filters.status !== "All") params.status = filters.status;
        const res = await leadsAPI.getAll({ ...params, limit: 100 });
        setLeads(res.data.data);
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

  return (
    <div className="animate-slide-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 4 }}>Leads</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>{leads.length} leads in your pipeline</p>
        </div>
        <button
          onClick={() => router.push("/capture")}
          style={{
            padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "white",
            border: "none", cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 0 20px rgba(124,58,237,0.4)",
          }}
        >
          + New Lead
        </button>
      </div>

      {/* Filters */}
      <Card style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", textTransform: "uppercase" }}>Industry:</span>
          {INDUSTRIES.map((v) => filterBtn("industry", v))}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 10, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", textTransform: "uppercase" }}>Priority:</span>
          {PRIORITIES.map((v) => filterBtn("priority", v))}
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", textTransform: "uppercase", marginLeft: 8 }}>Status:</span>
          {STATUSES.map((v) => filterBtn("status", v))}
        </div>
      </Card>

      <Card>
        {loading ? (
          <LoadingSpinner />
        ) : leads.length === 0 ? (
          <EmptyState icon="◈" title="No leads found" description="Adjust filters or capture a new lead to get started." />
        ) : (
          <LeadsTable leads={leads} onSelect={(l) => router.push(`/leads/${l._id}`)} />
        )}
      </Card>
    </div>
  );
}
