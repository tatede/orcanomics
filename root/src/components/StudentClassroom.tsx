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

export default function StudentClassroom({
  currentStudent,
  classmates,
  className,
}: {
  currentStudent: Student;
  classmates: Student[];
  className: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/student/dashboard", icon: "⊞" },
    { label: "Classroom", href: "/student/classroom", icon: "🖥", active: true },
    { label: "Practice", href: "/student/practice", icon: "🎮" },
    { label: "Shop", href: "/student/shop", icon: "🛒" },
    { label: "Account", href: "/student/account", icon: "👤" },
  ];

  const sorted = [...classmates].sort((a, b) => (b.coins ?? 0) - (a.coins ?? 0));
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  const podiumStyles = [
    { height: "180px", color: "#CBD5E1", label: "#2", labelColor: "#64748B" },
    { height: "220px", color: "#FFD700", label: "#1", labelColor: "#92400E" },
    { height: "150px", color: "#92400E", label: "#3", labelColor: "#78350F" },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: "#F1F5F9", fontFamily: "Inter, sans-serif" }}>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

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
          <Link
            href="/api/student/logout"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ color: "#94A3B8" }}
            onMouseOver={e => (e.currentTarget.style.color = "#EF4444")}
            onMouseOut={e => (e.currentTarget.style.color = "#94A3B8")}
          >
            <span>⮞</span> Logout
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3" style={{ background: "#0F172A", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => setMobileOpen(true)} style={{ color: "white", fontSize: "1.4rem", background: "none", border: "none", cursor: "pointer" }}>☰</button>
          <span style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 800, color: "white" }}>Orcanomics</span>
          <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: "0.9rem" }}>🪙 {currentStudent.coins ?? 0}</span>
        </header>

        <main className="flex-1 p-6 md:p-8 space-y-8">
          {/* Header */}
          <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>{className}</h1>
            <p style={{ color: "#64748B", marginTop: "4px" }}>{classmates.length} students enrolled</p>
          </div>

          {/* Podium */}
          {top3.length > 0 && (
            <div>
              <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#0F172A", borderLeft: "4px solid #FFD700", paddingLeft: "12px", marginBottom: "24px" }}>
                🏆 Leaderboard
              </h2>
              <div className="flex items-end justify-center gap-4" style={{ height: "280px" }}>
                {podiumOrder.map((student, i) => {
                  if (!student) return null;
                  const style = i === 0 ? podiumStyles[0] : i === 1 ? podiumStyles[1] : podiumStyles[2];
                  const isMe = student.id === currentStudent.id;
                  return (
                    <div key={student.id} className="flex flex-col items-center" style={{ width: "140px" }}>
                      <div style={{
                        fontSize: "2.5rem", marginBottom: "8px",
                        width: "60px", height: "60px", borderRadius: "50%",
                        background: "#F1F5F9", border: `3px solid ${style.color}`,
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        {student.avatar ? <img src={student.avatar} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : "🦈"}
                      </div>
                      <p style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#0F172A", margin: "0 0 4px", textAlign: "center" }}>
                        {student.displayName ?? student.username} {isMe ? "(You)" : ""}
                      </p>
                      <p style={{ color: "#FFD700", fontWeight: 800, fontSize: "0.9rem", margin: "0 0 8px" }}>
                        {(student.coins ?? 0).toLocaleString()} 🪙
                      </p>
                      <div style={{
                        width: "100%", height: style.height,
                        background: style.color, borderRadius: "12px 12px 4px 4px",
                        display: "flex", alignItems: "flex-end", justifyContent: "center",
                        paddingBottom: "12px", opacity: isMe ? 1 : 0.85
                      }}>
                        <span style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 800, fontSize: "2rem", color: style.labelColor, opacity: 0.4 }}>{style.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Roster */}
          <div>
            <h2 style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#0F172A", borderLeft: "4px solid #0284C7", paddingLeft: "12px", marginBottom: "16px" }}>
              👥 Class Roster
            </h2>
            <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0" }}>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B" }}>Rank</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B" }}>Student</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B" }}>Coins</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B" }}>Lesson</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((student, index) => {
                    const isMe = student.id === currentStudent.id;
                    return (
                      <tr key={student.id} style={{
                        borderBottom: "1px solid #F1F5F9",
                        background: isMe ? "#F0FDFA" : "white"
                      }}>
                        <td className="px-6 py-3">
                          <span style={{
                            fontWeight: 800, fontSize: "0.9rem",
                            color: index === 0 ? "#FFD700" : index === 1 ? "#94A3B8" : index === 2 ? "#92400E" : "#64748B"
                          }}>
                            #{index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div style={{
                              width: "36px", height: "36px", borderRadius: "50%",
                              background: "#F1F5F9", border: `2px solid ${isMe ? "#0D9488" : "#E2E8F0"}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "1.2rem", overflow: "hidden"
                            }}>
                              {student.avatar ? <img src={student.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🦈"}
                            </div>
                            <span style={{ fontWeight: isMe ? 700 : 500, color: "#0F172A" }}>
                              {student.displayName ?? student.username} {isMe ? <span style={{ color: "#0D9488", fontSize: "0.75rem" }}>(You)</span> : ""}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3" style={{ fontWeight: 700, color: "#FFD700" }}>
                          {(student.coins ?? 0).toLocaleString()} 🪙
                        </td>
                        <td className="px-6 py-3" style={{ color: "#64748B" }}>
                          Lesson {student.lessonProgress ?? 1}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}