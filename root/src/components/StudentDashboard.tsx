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
};

export default function StudentDashboard({
  student,
  className,
}: {
  student: Student;
  className: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/student/dashboard", icon: "⊞", active: true },
    { label: "Classroom", href: "/student/classroom", icon: "🖥" },
    { label: "Practice", href: "/student/practice", icon: "🎮" },
    { label: "Shop", href: "/student/shop", icon: "🛒" },
    { label: "Account", href: "/student/account", icon: "👤" },
  ];

  const displayName = student.displayName ?? student.username;
  const coins = student.coins ?? 0;
  const progress = student.lessonProgress ?? 1;

  return (
    <div className="flex min-h-screen" style={{ background: "#F1F5F9", fontFamily: "Inter, sans-serif" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 flex flex-col transition-transform duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:h-screen`}
        style={{ background: "#0F172A" }}>
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <img src="/images/LogoV1.png" alt="Orcanomics" className="h-10 w-10 rounded-xl object-contain" />
          <span style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 800, color: "white", fontSize: "1.1rem" }}>Orcanomics</span>
        </div>

        {/* Nav */}
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
              <span style={{ fontSize: "1rem" }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link
            href="/api/student/logout"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ color: "#94A3B8" }}
            onMouseOver={e => (e.currentTarget.style.color = "#EF4444")}
            onMouseOut={e => (e.currentTarget.style.color = "#94A3B8")}
          >
            <span>⮞</span> Logout
          </Link>
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

        <main className="flex-1 p-6 md:p-10 space-y-6">

          {/* Profile card */}
          <div className="rounded-2xl bg-white p-6 flex items-center justify-between" style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <div>
              <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "2rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>{displayName}</h1>
              {student.isPremium && (
                <p style={{ color: "#FFD700", fontWeight: 700, fontSize: "0.85rem", marginTop: "4px" }}>
                  ORCA GOLD MEMBER 👑
                </p>
              )}
              <p style={{ color: "#64748B", fontSize: "0.9rem", marginTop: "4px" }}>{className}</p>
            </div>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              border: "3px solid #0284C7",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2.5rem", background: "#F1F5F9", overflow: "hidden"
            }}>
              {student.avatar ? <img src={student.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🦈"}
            </div>
          </div>

          {/* Treasury + Education */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Treasury */}
            <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ background: "#0D9488" }}>
                <span style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 700, color: "white", fontSize: "0.85rem", letterSpacing: "0.1em" }}>TREASURY</span>
                <span style={{ fontSize: "1.2rem" }}>🪙</span>
              </div>
              <div className="px-5 py-5">
                <p style={{ fontSize: "2rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>{coins.toLocaleString()} Coins</p>
                <p style={{ color: "#64748B", marginTop: "6px", fontSize: "0.9rem" }}>Current Lesson: {progress}</p>
              </div>
            </div>

            {/* Education */}
            <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ background: "#0284C7" }}>
                <span style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 700, color: "white", fontSize: "0.85rem", letterSpacing: "0.1em" }}>EDUCATION</span>
                <span style={{ fontSize: "1.2rem" }}>🏛</span>
              </div>
              <div className="px-5 py-5">
                <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>Active Class</p>
                <p style={{ color: "#64748B", marginTop: "6px", fontSize: "0.9rem", marginBottom: "16px" }}>Review your materials and grades.</p>
                <Link
                  href="/student/classroom"
                  className="block w-full text-center py-3 rounded-xl font-bold text-sm text-white transition"
                  style={{ background: "#0F172A", fontFamily: "Orbitron, sans-serif", fontSize: "0.8rem", letterSpacing: "0.05em" }}
                >
                  GO TO CLASS
                </Link>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Practice", href: "/student/practice", icon: "🎮", color: "#F97316" },
              { label: "Shop", href: "/student/shop", icon: "🛒", color: "#0D9488" },
              { label: "Settings", href: "/student/settings", icon: "⚙️", color: "#64748B" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl bg-white flex flex-col items-center justify-center py-6 gap-2 transition hover:-translate-y-1"
                style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", textDecoration: "none" }}
              >
                <span style={{ fontSize: "1.8rem", color: item.color }}>{item.icon}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1E293B" }}>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Progress */}
          <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 700, color: "#0F172A", marginTop: 0, fontSize: "1rem" }}>Unit Progress</h2>
            <div style={{ background: "#F1F5F9", borderRadius: "999px", height: "10px", marginTop: "12px", overflow: "hidden" }}>
              <div style={{ width: `${Math.min(100, (progress / 18) * 100)}%`, height: "100%", background: "#0284C7", borderRadius: "999px", transition: "width 1s ease" }} />
            </div>
            <p style={{ color: "#64748B", fontSize: "0.85rem", marginTop: "8px" }}>Lesson {progress} of 18</p>
          </div>

        </main>
      </div>
    </div>
  );
}
