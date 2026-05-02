"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

type Teacher = { id: string; name: string | null; email: string; badge: string | null };
type Class = { id: string; name: string; teacherId: string };
type Student = { id: string; username: string; password: string; classId: string };

export default function TeacherDashboard({
  teacher,
  classes,
  students,
}: {
  teacher: Teacher;
  classes: Class[];
  students: Student[];
}) {
  const [className, setClassName] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id ?? "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [resetModal, setResetModal] = useState<{ id: string; username: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"roster" | "management" | "password">("roster");
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");

  function togglePassword(id: string) {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function createClass() {
    if (!className.trim()) return;
    const res = await fetch("/api/teacher/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: className }),
    });
    if (res.ok) {
      setMessage({ text: "Class created!", ok: true });
      setClassName("");
      setShowCreateClass(false);
      window.location.reload();
    }
  }

  async function createStudent() {
    if (!username.trim() || !password.trim() || !selectedClass) return;
    const res = await fetch("/api/teacher/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, classId: selectedClass }),
    });
    if (res.ok) {
      setMessage({ text: "Student added!", ok: true });
      setUsername("");
      setPassword("");
      setShowAddStudent(false);
      window.location.reload();
    } else {
      const data = await res.json();
      setMessage({ text: data.message || "Error creating student", ok: false });
    }
  }

  async function deleteStudent(id: string) {
    if (!confirm("Delete this student?")) return;
    const res = await fetch(`/api/teacher/students/${id}`, { method: "DELETE" });
    if (res.ok) {
      window.location.reload();
    } else {
      const data = await res.json();
      setMessage({ text: data.message || "Error deleting student", ok: false });
    }
  }

  async function resetPassword() {
    if (!resetModal || !newPassword.trim()) return;
    const res = await fetch(`/api/teacher/students/${resetModal.id}/password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });
    if (res.ok) {
      setMessage({ text: `Password updated for ${resetModal.username}`, ok: true });
      setResetModal(null);
      setNewPassword("");
      window.location.reload();
    } else {
      const data = await res.json();
      setMessage({ text: data.message || "Error updating password", ok: false });
    }
  }

  const filteredStudents = students.filter((s) => {
    const matchesClass = filterClass === "all" || s.classId === filterClass;
    const matchesSearch = s.username.toLowerCase().includes(search.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b-2 border-cyan-600 px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/LogoV1.png" alt="Orcanomics" className="h-10 w-10 rounded-xl object-contain" />
            <div>
              <p className="text-lg font-extrabold tracking-tight text-cyan-700">Orcanomics</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Teacher Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-700">{teacher.name ?? teacher.email}</p>
              {teacher.badge && (
                <span className="rounded-full bg-cyan-600 px-3 py-1 text-xs font-bold text-white">
                  {teacher.badge}
                </span>
              )}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-lg bg-slate-100 border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-8 space-y-6">

        {/* Message */}
        {message && (
          <div className={`rounded-xl px-4 py-3 text-sm font-semibold border ${message.ok ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {message.text}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white border border-slate-200 px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Students</p>
            <p className="mt-1 text-3xl font-extrabold text-cyan-700">{students.length}</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Classes</p>
            <p className="mt-1 text-3xl font-extrabold text-teal-600">{classes.length}</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Avg Class Size</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-700">
              {classes.length > 0 ? Math.round(students.length / classes.length) : 0}
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</p>
            <p className="mt-1 text-sm font-bold text-green-600">● Active</p>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex gap-3">
          <button
            onClick={() => { setShowCreateClass(!showCreateClass); setShowAddStudent(false); }}
            className="rounded-xl bg-cyan-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-cyan-800 shadow-sm transition"
          >
            {showCreateClass ? "✕ Cancel" : "+ New Class"}
          </button>
          {classes.length > 0 && (
            <button
              onClick={() => { setShowAddStudent(!showAddStudent); setShowCreateClass(false); }}
              className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700 shadow-sm transition"
            >
              {showAddStudent ? "✕ Cancel" : "+ Add Student"}
            </button>
          )}
        </div>

        {/* Create Class Panel */}
        {showCreateClass && (
          <section className="rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-6">
            <h2 className="text-base font-bold text-cyan-800 mb-4">New Class</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. Period 3 or Finance 101"
                className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium focus:border-cyan-500 focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && createClass()}
              />
              <button
                onClick={createClass}
                className="rounded-xl bg-cyan-700 px-6 py-2 text-sm font-bold text-white hover:bg-cyan-800 transition"
              >
                Create
              </button>
            </div>
          </section>
        )}

        {/* Add Student Panel */}
        {showAddStudent && (
          <section className="rounded-2xl border-2 border-teal-200 bg-teal-50 p-6">
            <h2 className="text-base font-bold text-teal-800 mb-4">Add Student</h2>
            <div className="space-y-3">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium focus:border-teal-500 focus:outline-none"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium focus:border-teal-500 focus:outline-none"
              />
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium focus:border-teal-500 focus:outline-none"
              />
              <button
                onClick={createStudent}
                className="w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 transition"
              >
                Add Student
              </button>
            </div>
          </section>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm w-fit">
          {(["roster", "management", "password"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-bold rounded-xl transition ${
                activeTab === tab
                  ? "bg-cyan-700 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              {tab === "roster" ? "Class Roster" : tab === "management" ? "Management" : "Passwords"}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium focus:border-cyan-500 focus:outline-none shadow-sm"
          />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium focus:border-cyan-500 focus:outline-none shadow-sm"
          >
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Tables */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Table header accent */}
          <div className="bg-cyan-700 px-6 py-3 flex items-center justify-between">
            <p className="text-sm font-bold text-white">
              {activeTab === "roster" ? "Class Roster" : activeTab === "management" ? "Student Management" : "Password Reset"}
            </p>
            <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold text-white">
              {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""}
            </span>
          </div>

          {activeTab === "roster" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-100 text-left text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50">
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Password</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-sm text-slate-400 text-center">No students found.</td></tr>
                ) : filteredStudents.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-3.5 font-bold text-slate-900">{s.username}</td>
                    <td className="px-6 py-3.5">
                      <span className="rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-xs font-semibold text-cyan-700">
                        {classes.find((c) => c.id === s.classId)?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-500">
                      {revealedPasswords[s.id] ? (
                        <span className="text-slate-800 font-semibold">{s.password}</span>
                      ) : "••••••••"}
                      <button onClick={() => togglePassword(s.id)} className="ml-3 text-xs font-bold text-cyan-600 hover:text-cyan-800">
                        {revealedPasswords[s.id] ? "Hide" : "Show"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "management" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-100 text-left text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50">
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-sm text-slate-400 text-center">No students found.</td></tr>
                ) : filteredStudents.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-3.5 font-bold text-slate-900">{s.username}</td>
                    <td className="px-6 py-3.5">
                      <span className="rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-xs font-semibold text-cyan-700">
                        {classes.find((c) => c.id === s.classId)?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => deleteStudent(s.id)}
                        className="rounded-lg bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "password" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-100 text-left text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50">
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-sm text-slate-400 text-center">No students found.</td></tr>
                ) : filteredStudents.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-3.5 font-bold text-slate-900">{s.username}</td>
                    <td className="px-6 py-3.5">
                      <span className="rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-xs font-semibold text-cyan-700">
                        {classes.find((c) => c.id === s.classId)?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => { setResetModal({ id: s.id, username: s.username }); setNewPassword(""); }}
                        className="rounded-lg bg-cyan-50 border border-cyan-300 px-3 py-1 text-xs font-bold text-cyan-700 hover:bg-cyan-100 transition"
                      >
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {/* Password Reset Modal */}
      {resetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="bg-cyan-700 px-6 py-4">
              <h2 className="text-base font-bold text-white">Reset Password</h2>
              <p className="text-xs text-cyan-200 mt-0.5">for <span className="font-bold text-white">{resetModal.username}</span></p>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-medium focus:border-cyan-500 focus:outline-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setResetModal(null)}
                  className="flex-1 rounded-xl border-2 border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={resetPassword}
                  className="flex-1 rounded-xl bg-cyan-700 py-2.5 text-sm font-bold text-white hover:bg-cyan-800 transition"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
