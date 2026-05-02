"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

type Teacher = { id: string; name: string | null; email: string };
type Class = { id: string; name: string; teacherId: string };
type Student = { id: string; username: string; classId: string };

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
  const [message, setMessage] = useState("");

  async function createClass() {
    if (!className.trim()) return;
    const res = await fetch("/api/teacher/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: className }),
    });
    if (res.ok) {
      setMessage("Class created!");
      setClassName("");
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
      setMessage("Student created!");
      setUsername("");
      setPassword("");
      window.location.reload();
    } else {
      const data = await res.json();
      setMessage(data.message || "Error creating student");
    }
  }

  async function deleteStudent(id: string) {
    await fetch(`/api/teacher/students/${id}`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/LogoV1.png" alt="Orcanomics" className="h-8 w-8 rounded-lg object-contain" />
            <div>
              <p className="font-bold text-cyan-700">Orcanomics</p>
              <p className="text-xs text-slate-500">Teacher Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-600">{teacher.name ?? teacher.email}</p>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        {message && (
          <div className="rounded-lg bg-cyan-50 px-4 py-3 text-sm text-cyan-700">
            {message}
          </div>
        )}

        {/* Create Class */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Create a Class</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Class name"
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none"
            />
            <button
              onClick={createClass}
              className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-800"
            >
              Create
            </button>
          </div>
        </section>

        {/* Add Student */}
        {classes.length > 0 && (
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Add a Student</h2>
            <div className="space-y-3">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none"
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
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={createStudent}
                className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Add Student
              </button>
            </div>
          </section>
        )}

        {/* Student List */}
        {classes.map((c) => {
          const classStudents = students.filter((s) => s.classId === c.id);
          return (
            <section key={c.id} className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">{c.name}</h2>
              {classStudents.length === 0 ? (
                <p className="text-sm text-slate-500">No students yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-600">
                      <th className="pb-2 font-medium">Username</th>
                      <th className="pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map((s) => (
                      <tr key={s.id} className="border-b border-slate-100">
                        <td className="py-2 text-slate-900">{s.username}</td>
                        <td className="py-2">
                          <button
                            onClick={() => deleteStudent(s.id)}
                            className="text-red-600 hover:underline text-xs"
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
        })}
      </div>
    </main>
  );
}
