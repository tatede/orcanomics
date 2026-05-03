"use client";
import { useState } from "react";

export default function StudentLoginPage() {
  const [error, setError] = useState("");

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <img
            src="/images/LogoV1.png"
            alt="Orcanomics"
            className="mx-auto h-12 w-12 rounded-xl object-contain"
          />
          <h1 className="mt-3 text-xl font-bold text-slate-900">Student Sign In</h1>
          <p className="mt-1 text-sm text-slate-500">Enter your username and password</p>
        </div>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <form method="POST" action="/api/student/login" className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
            <input
              type="text"
              name="username"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none"
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
