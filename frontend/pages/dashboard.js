import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { analyticsAPI, leadsAPI, campaignsAPI } from "../lib/api";
import { StatCard, Card, SectionHeader, LoadingSpinner } from "../components/ui";
import LeadsTable from "../components/LeadsTable";
import CampaignCard from "../components/CampaignCard";
import { INDUSTRY_COLORS } from "../lib/utils";

export default function Dashboard() {
  const router = useRouter();
  const [overview, setOverview] = useState(null);
  const [leads, setLeads] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ovRes, leadsRes, campRes, indRes] = await Promise.allSettled([
          analyticsAPI.getOverview(),
          leadsAPI.getAll({ limit: 5 }),
          campaignsAPI.getAll({ limit: 3 }),
          analyticsAPI.getIndustry(),
        ]);
        if (ovRes.status === "fulfilled") setOverview(ovRes.value.data.data);
        if (leadsRes.status === "fulfilled") setLeads(leadsRes.value.data.data);
        if (campRes.status === "fulfilled") setCampaigns(campRes.value.data.data);
        if (indRes.status === "fulfilled") setIndustry(indRes.value.data.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalIndustry = industry.reduce((a, d) => a + d.totalLeads, 0) || 1;

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 4 }}>
          Welcome back, Admin 👋
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          Your AI campaigns are running. Here's your automation overview.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="◈" label="Total Leads" value={overview?.totalLeads ?? "—"} sub={`${overview?.conversionRate ?? 0}% conversion rate`} color="#a78bfa" />
        <StatCard icon="✦" label="Campaigns" value={overview?.totalCampaigns ?? "—"} sub={`${overview?.sentCampaigns ?? 0} delivered`} color="#60a5fa" />
        <StatCard icon="◎" label="Avg Open Rate" value={`${overview?.avgOpenRate ?? 0}%`} sub="Industry avg: 21%" color="#4ade80" />
        <StatCard icon="💬" label="Avg Reply Rate" value={`${overview?.avgReplyRate ?? 0}%`} sub="Industry avg: 5%" color="#fb923c" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginBottom: 24 }}>
        {/* Recent Leads */}
        <Card style={{ padding: 20 }}>
          <SectionHeader
            title="Recent Leads"
            action={
              <button
                onClick={() => router.push("/leads")}
                style={{ fontSize: 12, color: "#a855f7", background: "none", border: "none", cursor: "pointer" }}
              >
                View all →
              </button>
            }
          />
          <LeadsTable leads={leads} onSelect={(l) => router.push(`/leads/${l._id}`)} />
        </Card>

        {/* Industry Breakdown */}
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Industry Breakdown" />
          {industry.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No data yet.</p>
          ) : (
            industry.map((d) => {
              const pct = Math.round((d.totalLeads / totalIndustry) * 100);
              const color = INDUSTRY_COLORS[d._id] || "#6b7280";
              return (
                <div key={d._id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                      {d._id}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{d.totalLeads}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, background: color, width: `${pct}%`, transition: "width 1s ease" }} />
                  </div>
                </div>
              );
            })
          )}
        </Card>
      </div>

      {/* Latest Campaigns */}
      <Card style={{ padding: 20 }}>
        <SectionHeader
          title="Latest Campaigns"
          action={
            <button
              onClick={() => router.push("/campaigns")}
              style={{ fontSize: 12, color: "#a855f7", background: "none", border: "none", cursor: "pointer" }}
            >
              View all →
            </button>
          }
        />
        {campaigns.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No campaigns yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {campaigns.map((c) => <CampaignCard key={c._id} campaign={c} />)}
          </div>
        )}
      </Card>
    </div>
  );
}
