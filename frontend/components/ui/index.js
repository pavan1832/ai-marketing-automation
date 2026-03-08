import { scoreColor, priorityClass, statusClass, initials, formatDate } from "../../lib/utils";

export function StatCard({ icon, label, value, sub, color = "#a78bfa" }) {
  return (
    <div
      style={{
        borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)", padding: 20,
        position: "relative", overflow: "hidden",
        transition: "border-color 0.3s",
      }}
    >
      <div style={{ fontSize: 22, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: "white", marginBottom: 4, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 12, color }}>{sub}</div>}
    </div>
  );
}

export function Badge({ children, variant = "default" }) {
  const styles = {
    default: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    danger: "bg-red-500/20 text-red-300 border-red-500/30",
    info: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    purple: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  };
  return (
    <span
      style={{
        fontSize: 11, padding: "3px 10px", borderRadius: 999,
        border: "1px solid", display: "inline-block",
      }}
      className={styles[variant]}
    >
      {children}
    </span>
  );
}

export function Avatar({ name, size = 32 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: size / 4,
        background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(168,85,247,0.35))",
        border: "1px solid rgba(168,85,247,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size / 3, fontWeight: 700, color: "rgba(196,181,253,1)",
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  );
}

export function ScoreBadge({ score }) {
  const color = scoreColor(score);
  return (
    <div
      style={{
        width: 26, height: 26, borderRadius: "50%",
        background: color + "20", border: `1px solid ${color}40`,
        color, fontSize: 11, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {score}
    </div>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div
      style={{
        borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.025)", ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionHeader({ title, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", margin: 0 }}>{title}</h2>
      {action}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div
        style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.1)",
          borderTopColor: "#a855f7",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function EmptyState({ icon = "◈", title, description }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{description}</div>
    </div>
  );
}
