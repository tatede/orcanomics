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
    { label: "Classroom", href: "/student/classroom", icon: "🏫" },
    { label: "Practice", href: "/student/practice", icon: "🎮" },
    { label: "Shop", href: "/student/shop", icon: "🛒" },
    { label: "Account", href: "/student/account", icon: "👤" },
  ];

  const displayName = student.displayName ?? student.username;
  const coins = student.coins ?? 0;
  const progress = student.lessonProgress ?? 1;

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-60 bg-slate-800 border-r border-slate-700 flex flex-col transition-transform duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:h-screen`}>
        <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-700">
          <img src="/images/LogoV1.png" alt="Orcanomics" className="h-9 w-9 rounded-xl object-contain" />
          <div>
            <p className="font-extrabold tracking-tight text-cyan-400">Orcanomics</p>
            <p className="text-xs text-slate-400">Student Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition
                ${item.active
                  ? "bg-cyan-600 text-white"
                  : "text-slate-300 hover:bg-slate-700"
                }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-700">
          <Link
            href="/api/student/logout"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition"
          >
            <span>→</span>
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between bg-slate-800 border-b border-slate-700 px-4 py-3">
          <button onClick={() => setMobileOpen(true)} className="text-white text-xl">☰</button>
          <p className="font-bold text-cyan-400">Orcanomics</p>
          <div className="text-sm font-bold text-yellow-400">🪙 {coins}</div>
        </header>

        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between bg-slate-800 border-b border-slate-700 px-8 py-4">
          <div>
            <h1 className="text-xl font-extrabold text-white">
              Welcome back, <span className="text-cyan-400">{displayName}</span>!
            </h1>
            <p className="text-sm text-slate-400">{className}</p>
          </div>
          <div className="flex items-center gap-4">
            {student.isPremium && (
              <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-slate-900">
                ⭐ Orca Gold
              </span>
            )}
            <div className="rounded-xl bg-slate-700 border border-slate-600 px-4 py-2 text-sm font-bold text-yellow-400">
              🪙 {coins} Coins
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <main className="flex-1 p-6 md:p-8 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-slate-800 border border-slate-700 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Coins</p>
              <p className="mt-1 text-3xl font-extrabold text-yellow-400">{coins}</p>
            </div>
            <div className="rounded-2xl bg-slate-800 border border-slate-700 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Lesson</p>
              <p className="mt-1 text-3xl font-extrabold text-cyan-400">{progress}</p>
            </div>
            <div className="rounded-2xl bg-slate-800 border border-slate-700 px-5 py-4 col-span-2 md:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</p>
              <p className="mt-1 text-sm font-bold text-green-400">● Active</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/student/practice" className="rounded-2xl bg-cyan-600 hover:bg-cyan-700 transition p-6 text-white">
              <p className="text-2xl mb-2">🎮</p>
              <p className="font-bold text-lg">Practice</p>
              <p className="text-sm text-cyan-100 mt-1">Earn coins while you learn</p>
            </Link>
            <Link href="/student/classroom" className="rounded-2xl bg-teal-600 hover:bg-teal-700 transition p-6 text-white">
              <p className="text-2xl mb-2">🏫</p>
              <p className="font-bold text-lg">Classroom</p>
              <p className="text-sm text-teal-100 mt-1">View your class leaderboard</p>
            </Link>
            <Link href="/student/shop" className="rounded-2xl bg-violet-600 hover:bg-violet-700 transition p-6 text-white">
              <p className="text-2xl mb-2">🛒</p>
              <p className="font-bold text-lg">Shop</p>
              <p className="text-sm text-violet-100 mt-1">Spend your coins</p>
            </Link>
          </div>

          {/* Current mission */}
          <div className="rounded-2xl bg-slate-800 border border-slate-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Current Mission</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-cyan-400">Lesson {progress}</p>
                <p className="text-sm text-slate-400 mt-1">Keep going to earn more coins and unlock new items.</p>
              </div>
              <Link
                href="/student/practice"
                className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-cyan-700 transition"
              >
                Continue →
              </Link>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-2 w-full rounded-full bg-slate-700">
              <div
                className="h-2 rounded-full bg-cyan-500 transition-all"
                style={{ width: `${Math.min(100, (progress / 18) * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">Lesson {progress} of 18</p>
          </div>

        </main>
      </div>
    </div>
  );
}
