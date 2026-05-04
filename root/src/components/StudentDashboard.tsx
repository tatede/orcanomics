"use client";
import Link from "next/link";
import { useState } from "react";

type Student = {
  id: string;
  username: string;
  displayName: string | null;
  coins: number | null;
  lessonProgress: number | null;
  isPremium: boolean | null;
  avatar: string | null;
  grade: string | null;
};

export default function StudentDashboard({
  student,
  className,
}: {
  student: Student;
  className: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [gameCode, setGameCode] = useState("");

 const navItems: { label: string; href: string; icon: React.ReactNode; active?: boolean }[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: <i className="fas fa-th-large" /> },
  { label: "Classroom", href: "/student/classroom", icon: <i className="fas fa-chalkboard-teacher" /> },
  { label: "Practice", href: "/student/practice", icon: <i className="fas fa-gamepad" /> },
  { label: "Shop", href: "/student/shop", icon: <i className="fas fa-shopping-cart" /> },
  { label: "Account", href: "/student/account", icon: <i className="fas fa-user-circle" />, active: true },
];

  const displayName = student.displayName ?? student.username;
  const coins = student.coins ?? 0;
  const progress = student.lessonProgress ?? 1;
  const grade = student.grade ?? "3";

  const TOTAL_UNITS = 18;
  const percent = Math.min(100, Math.round(((Math.max(0, progress - 1)) / TOTAL_UNITS) * 100));

  function getMission() {
    if (["3", "4", "5"].includes(grade)) {
      return {
        title: "The Coral Reef",
        subtitle: "Financial Basics",
        desc: "Dive into basics of money, currency, and value.",
        href: "/student/practice",
        color: "#0284C7",
      };
    } else if (["6", "7", "8"].includes(grade)) {
      return {
        title: "The Deep",
        subtitle: "Earning & Saving",
        desc: "Explore income, budgeting, and smart saving.",
        href: "/student/practice",
        color: "#7E22CE",
      };
    } else {
      return {
        title: "Crystal Caverns",
        subtitle: "Advanced Investing",
        desc: "Master the tunnels of wealth building.",
        href: "/student/practice",
        color: "#0D9488",
      };
    }
  }

  const mission = getMission();

  return (
    <div className="flex min-h-screen" style={{ background: "#F1F5F9", fontFamily: "Inter, sans-serif" }}>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 flex flex-col transition-transform duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:h-screen`}
        style={{ background: "#0F172A" }}>
        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <img src="/images/LogoV1.png" alt="Orcanomics" className="h-10 w-10 rounded-xl object-contain" />
          <span style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 800, color: "white", fontSize: "1.1rem" }}>Orcanomics</span>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                color: item.active ? "white" : "#94A3B8",
                background: item.active ? "rgba(255,255,255,0.08)" : "transparent",
                borderLeft: item.active ? "3px solid #0284C7" : "3px solid transparent",
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            onClick={() => window.location.href = "/api/student/logout"}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ color: "#94A3B8", background: "none", border: "none", cursor: "pointer" }}
            onMouseOver={e => (e.currentTarget.style.color = "#EF4444")}
            onMouseOut={e => (e.currentTarget.style.color = "#94A3B8")}
          >
            <span>⮞</span> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3" style={{ background: "#0F172A", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => setMobileOpen(true)} style={{ color: "white", fontSize: "1.4rem", background: "none", border: "none", cursor: "pointer" }}>☰</button>
          <span style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 800, color: "white" }}>Orcanomics</span>
          <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: "0.9rem" }}>🪙 {coins}</span>
        </header>

        <main className="flex-1 p-6 md:p-8 space-y-6">

          {/* Coin badge top right — desktop */}
          <div className="hidden md:flex justify-end">
            <div className="rounded-full px-4 py-2 text-sm font-bold flex items-center gap-2" style={{ background: "white", border: "1px solid #E2E8F0", color: "#1E293B" }}>
              🪙 <span style={{ color: "#FFD700" }}>{coins.toLocaleString()}</span> Coins
            </div>
          </div>

          {/* Welcome banner */}
          <div className="rounded-2xl bg-white p-6 flex items-center justify-between flex-wrap gap-4" style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <div>
              <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                Welcome, <span style={{ color: "#F97316" }}>{displayName}</span>
                {student.isPremium && " 👑"}
              </h1>
              <p style={{ color: "#64748B", fontSize: "0.9rem", marginTop: "4px" }}>Grade Level: {grade}</p>
            </div>
            <div className="text-right">
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748B" }}>Unit 1 Progress: {percent}%</p>
              <div style={{ background: "#F1F5F9", borderRadius: "999px", height: "8px", width: "200px", marginTop: "8px", overflow: "hidden" }}>
                <div style={{ width: `${percent}%`, height: "100%", background: "#0284C7", borderRadius: "999px", transition: "width 1s ease" }} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#0F172A", borderLeft: "4px solid #0284C7", paddingLeft: "12px" }}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {/* Live Game */}
              <div className="flex flex-col items-center cursor-pointer transition hover:scale-105">
                <div className="relative w-full flex justify-center">
                  <img src="/images/dashboard/orangechest.png" alt="Live Game" style={{ width: "100%", maxWidth: "260px", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.2))" }} />
                </div>
                <div className="w-full max-w-xs mt-2 space-y-2">
                  <input
                    type="text"
                    value={gameCode}
                    onChange={e => setGameCode(e.target.value.toUpperCase())}
                    placeholder="Input Ancient Code"
                    maxLength={8}
                    className="w-full rounded-xl px-4 py-2 text-sm text-center font-mono"
                    style={{ border: "2px solid #E2E8F0", background: "white" }}
                  />
                  <button
                    onClick={() => gameCode && (window.location.href = `/student/game?code=${gameCode}`)}
                    className="w-full rounded-xl py-2 text-sm font-bold text-white transition"
                    style={{ background: "#F97316" }}
                  >
                    Go 🌎
                  </button>
                </div>
              </div>

              {/* Practice */}
              <div className="flex flex-col items-center cursor-pointer transition hover:scale-105" onClick={() => window.location.href = "/student/practice"}>
                <div className="relative w-full flex justify-center">
                  <img src="/images/dashboard/greenchest.png" alt="Practice" style={{ width: "100%", maxWidth: "260px", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.2))" }} />
                </div>
                <div className="w-full max-w-xs mt-2">
                  <button
                    className="w-full rounded-xl py-2 text-sm font-bold text-white transition"
                    style={{ background: "#0D9488" }}
                  >
                    Go 🏹
                  </button>
                </div>
              </div>

              {/* Ollie's Influence */}
              <div className="flex flex-col items-center cursor-pointer transition hover:scale-105" onClick={() => window.location.href = "/student/practice"}>
                <div className="relative w-full flex justify-center">
                  <img src="/images/dashboard/bluechest.png" alt="Ollie's Influence" style={{ width: "100%", maxWidth: "260px", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.2))" }} />
                </div>
                <div className="w-full max-w-xs mt-2">
                  <button
                    className="w-full rounded-xl py-2 text-sm font-bold text-white transition"
                    style={{ background: "#3B82F6" }}
                  >
                    Go 🔮
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Mission */}
          <div>
            <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#0F172A", borderLeft: "4px solid #0284C7", paddingLeft: "12px" }}>
              Current Mission
            </h2>
            <div className="mt-4 rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ background: mission.color }}>
                <span style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 700, color: "white", fontSize: "0.85rem", letterSpacing: "0.1em" }}>CURRENT MISSION</span>
                <span style={{ fontSize: "1.2rem" }}>📖</span>
              </div>
              <div className="px-6 py-6">
                <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>{mission.title}</h3>
                <p style={{ color: mission.color, fontWeight: 600, fontSize: "0.9rem", marginTop: "4px" }}>{mission.subtitle}</p>
                <p style={{ color: "#64748B", fontSize: "0.9rem", marginTop: "8px", marginBottom: "24px" }}>{mission.desc}</p>
                <Link
                  href={mission.href}
                  className="block w-full text-center py-3 rounded-xl font-bold text-white transition"
                  style={{ background: mission.color, fontFamily: "Orbitron, sans-serif", fontSize: "0.8rem", letterSpacing: "0.05em" }}
                >
                  CONTINUE ADVENTURE
                </Link>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
