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

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/LogoV1.png" alt="Orcanomics" className="h-9 w-9 rounded-xl object-contain" />
            <div>
              <p className="font-extrabold tracking-tight text-cyan-700">Orcanomics</p>
              <p className="text-xs text-slate-400">Teacher Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-slate-600">{teacher.name ?? teacher.email}</p>
              {teacher.badge && (
                <span className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  {teacher.badge}
                </span>
              )}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">

        {/* Message */}
        {message && (
          <div className={`rounded-xl px-4 py-3 text-sm font-medium ${message.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        {/* Top actions */}
        <div className="flex gap-3">
          <button
            onClick={() => { setShowCreateClass(!showCreateClass); setShowAddStudent(false); }}
            className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-800 transition"
          >
            {showCreateClass ? "Cancel" : "+ New Class"}
          </button>
          {classes.length > 0 && (
            <button
              onClick={() => { setShowAddStudent(!showAddStudent); setShowCreateClass(false); }}
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition"
            >
              {showAddStudent ? "Cancel" : "+ Add Student"}
            </button>
          )}
        </div>

        {/* Create Class Panel */}
        {showCreateClass && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">New Class</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Class name e.g. Period 3"
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && createClass()}
              />
              <button
                onClick={createClass}
                className="rounded-xl bg-cyan-700 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-800 transition"
              >
                Create
              </button>
            </div>
          </section>
        )}

        {/* Add Student Panel */}
        {showAddStudent && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Add Student</h2>
            <div className="space-y-3">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none"
              />
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={createStudent}
                className="w-full rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition"
              >
                Add Student
              </button>
            </div>
          </section>
        )}

        {/* Class Cards */}
        {classes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-500 text-sm">No classes yet. Create one to get started.</p>
          </div>
        ) : (
          classes.map((c) => {
            const classStudents = students.filter((s) => s.classId === c.id);
            return (
              <section key={c.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
                  <h2 className="font-semibold text-slate-900">{c.name}</h2>
                  <span className="text-xs text-slate-500">{classStudents.length} student{classStudents.length !== 1 ? "s" : ""}</span>
                </div>
                {classStudents.length === 0 ? (
                  <p className="px-6 py-5 text-sm text-slate-400">No students in this class yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        <th className="px-6 py-3">Username</th>
                        <th className="px-6 py-3">Password</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classStudents.map((s) => (
                        <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                          <td className="px-6 py-3 font-medium text-slate-900">{s.username}</td>
                          <td className="px-6 py-3 text-slate-600 font-mono">
                            {revealedPasswords[s.id] ? s.password : "••••••••"}
                            <button
                              onClick={() => togglePassword(s.id)}
                              className="ml-2 text-xs text-cyan-600 hover:underline"
                            >
                              {revealedPasswords[s.id] ? "Hide" : "Show"}
                            </button>
                          </td>
                          <td className="px-6 py-3">
                            <button
                              onClick={() => deleteStudent(s.id)}
                              className="text-xs text-red-500 hover:text-red-700 hover:underline transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            );
          })
        )}
      </div>
    </main>
  );
}
