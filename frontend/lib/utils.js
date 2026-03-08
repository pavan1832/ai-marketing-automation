export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function scoreColor(s) {
  if (s >= 8) return "#4ade80";
  if (s >= 6) return "#fb923c";
  return "#f87171";
}

export function priorityClass(p) {
  const map = {
    High: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    Medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    Low: "bg-red-500/20 text-red-300 border-red-500/30",
  };
  return map[p] || map.Low;
}

export function statusClass(s) {
  const map = {
    sent: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    queued: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    converted: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    pending: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    contacted: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    analyzed: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    disqualified: "bg-red-500/20 text-red-300 border-red-500/30",
    draft: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    failed: "bg-red-500/20 text-red-300 border-red-500/30",
  };
  return map[s] || map.pending;
}

export function initials(name) {
  return (name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export const INDUSTRY_COLORS = {
  "Real Estate": "#4ade80",
  Marketing: "#60a5fa",
  Finance: "#f472b6",
  "E-commerce": "#fb923c",
  Healthcare: "#a78bfa",
  SaaS: "#34d399",
  Education: "#fbbf24",
  Retail: "#f87171",
  Manufacturing: "#94a3b8",
  Other: "#6b7280",
};
