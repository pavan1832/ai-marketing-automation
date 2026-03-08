import { useEffect, useState } from "react";
import { analyticsAPI } from "../lib/api";
import { StatCard, Card, LoadingSpinner } from "../components/ui";
import { INDUSTRY_COLORS } from "../lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const CHART_TOOLTIP_STYLE = {
  contentStyle: { background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "white" },
  itemStyle: { color: "rgba(255,255,255,0.7)" },
};

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [industry, setIndustry] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [timeline, setTimeline] = useState({ leadsTimeline: [], campaignsTimeline: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ovRes, indRes, perfRes, tlRes] = await Promise.allSettled([
          analyticsAPI.getOverview(),
          analyticsAPI.getIndustry(),
          analyticsAPI.getCampaignPerformance(),
          analyticsAPI.getTimeline(30),
        ]);
        if (ovRes.status === "fulfilled") setOverview(ovRes.value.data.data);
        if (indRes.status === "fulfilled") setIndustry(indRes.value.data.data);
        if (perfRes.status === "fulfilled") setPerformance(perfRes.value.data.data);
        if (tlRes.status === "fulfilled") setTimeline(tlRes.value.data.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  const pieData = industry.map((d) => ({ name: d._id, value: d.totalLeads, color: INDUSTRY_COLORS[d._id] || "#6b7280" }));
  const barData = performance.map((d) => ({ name: d._id, openRate: Math.round(d.avgOpenRate), replyRate: Math.round(d.avgReplyRate), count: d.count }));

  // Merge timeline data
  const allDates = new Set([
    ...timeline.leadsTimeline.map((d) => d._id),
    ...timeline.campaignsTimeline.map((d) => d._id),
  ]);
  const lineData = [...allDates].sort().map((date) => ({
    date: date.slice(5),
    leads: timeline.leadsTimeline.find((d) => d._id === date)?.count || 0,
    campaigns: timeline.campaignsTimeline.find((d) => d._id === date)?.count || 0,
  }));

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 4 }}>Analytics</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Campaign performance & pipeline overview · Last 30 days</p>
      </div>

      {/* Overview Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="📬" label="Emails Sent" value={overview?.sentCampaigns ?? 0} sub={`of ${overview?.totalCampaigns ?? 0} total`} color="#60a5fa" />
        <StatCard icon="👁" label="Avg Open Rate" value={`${overview?.avgOpenRate ?? 0}%`} sub="Industry avg: 21%" color="#a78bfa" />
        <StatCard icon="💬" label="Avg Reply Rate" value={`${overview?.avgReplyRate ?? 0}%`} sub="Industry avg: 5%" color="#4ade80" />
        <StatCard icon="🎯" label="Conversions" value={`${overview?.conversionRate ?? 0}%`} sub={`${overview?.convertedLeads ?? 0} leads`} color="#fb923c" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Timeline */}
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 20 }}>Leads & Campaigns — 30 Day Trend</div>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="leads" stroke="#a855f7" strokeWidth={2} dot={false} name="Leads" />
                <Line type="monotone" dataKey="campaigns" stroke="#4ade80" strokeWidth={2} dot={false} name="Campaigns" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              No timeline data yet
            </div>
          )}
        </Card>

        {/* Pie Chart */}
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 20 }}>Industry Distribution</div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 8 }}>
                {pieData.slice(0, 5).map((d) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                    <span style={{ color: "rgba(255,255,255,0.7)", flex: 1 }}>{d.name}</span>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              No data yet
            </div>
          )}
        </Card>
      </div>

      {/* Bar Chart */}
      <Card style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 20 }}>Campaign Performance by Industry</div>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip {...CHART_TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="openRate" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Open Rate %" />
              <Bar dataKey="replyRate" fill="#4ade80" radius={[4, 4, 0, 0]} name="Reply Rate %" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
            No campaign performance data yet. Send campaigns to see results.
          </div>
        )}
      </Card>

      {/* Webhook Log */}
      <Card style={{ padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 16 }}>Webhook Activity</div>
        <div style={{ fontFamily: "monospace", fontSize: 12 }}>
          {[
            { method: "POST", path: "/api/leads", status: "201", note: "Lead captured" },
            { method: "POST", path: "/api/webhook/campaign", status: "200", note: "Campaign triggered" },
            { method: "GET", path: "/api/analytics/overview", status: "200", note: "Dashboard loaded" },
            { method: "GET", path: "/api/campaigns", status: "200", note: "Campaigns fetched" },
          ].map((log, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
              <span style={{ color: log.method === "POST" ? "#a855f7" : "#60a5fa", width: 40 }}>[{log.method}]</span>
              <span style={{ color: "rgba(255,255,255,0.4)", flex: 1 }}>{log.path}</span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{log.note}</span>
              <span style={{ color: "#4ade80", padding: "2px 8px", borderRadius: 4, background: "rgba(74,222,128,0.1)", fontSize: 11 }}>{log.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
