import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/capture", label: "Capture Lead", icon: "⊕" },
  { href: "/leads", label: "Leads", icon: "◈" },
  { href: "/campaigns", label: "Campaigns", icon: "✦" },
  { href: "/analytics", label: "Analytics", icon: "◎" },
];

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#07070f" }}>
      {/* Sidebar */}
      <aside
        style={{
          position: "fixed", left: 0, top: 0, bottom: 0, width: 220,
          borderRight: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(20px)",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div
              style={{
                width: 30, height: 30, borderRadius: 8,
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, boxShadow: "0 0 20px #7c3aed50",
              }}
            >
              ⚡
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, color: "white" }}>NexusAI</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>
            Marketing Automation
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {navItems.map((item) => {
            const active = router.pathname === item.href || router.pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 12, marginBottom: 2,
                    fontSize: 14, fontWeight: 500, cursor: "pointer",
                    transition: "all 0.2s",
                    background: active ? "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.2))" : "transparent",
                    color: active ? "white" : "rgba(255,255,255,0.45)",
                    borderLeft: active ? "2px solid #a855f7" : "2px solid transparent",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Status */}
        <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", marginBottom: 6 }}>
            API Status
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#4ade80", boxShadow: "0 0 6px #4ade80",
              }}
            />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>OpenAI Connected</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ marginLeft: 220, minHeight: "100vh" }}>
        {/* Top bar */}
        <header
          style={{
            position: "sticky", top: 0, zIndex: 30,
            padding: "14px 32px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(7,7,15,0.8)", backdropFilter: "blur(20px)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 15, textTransform: "capitalize" }}>
              {router.pathname.replace("/", "") || "dashboard"}
            </div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "monospace" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.3)",
                padding: "6px 12px", borderRadius: 8,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              gpt-4o
            </div>
            <div
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.5))",
                border: "1px solid rgba(168,85,247,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "white",
              }}
            >
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: 32 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
