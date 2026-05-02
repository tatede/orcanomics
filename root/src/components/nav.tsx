"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Nav() {
  const { data: session } = useSession();
  const [dropdown, setDropdown] = useState(false);

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
        <Link href="#home" className="text-cyan-700">Home</Link>
        <Link href="#about" className="text-slate-700 transition hover:text-cyan-700">About</Link>
        <Link href="#contact" className="text-slate-700 transition hover:text-cyan-700">Contact</Link>

        <div className="relative">
          <button
            onClick={() => setDropdown(!dropdown)}
            className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:border-cyan-600 hover:text-cyan-700"
          >
            Login / Signup ▾
          </button>
          {dropdown && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              <Link
                href="/login/student"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
                onClick={() => setDropdown(false)}
              >
                Student
              </Link>
              <Link
                href="/login"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
                onClick={() => setDropdown(false)}
              >
                Teacher
              </Link>
            </div>
          )}
        </div>

        {session && (
          <Link
            href="/account"
            className="rounded-full bg-teal-600 px-4 py-2 font-semibold text-white transition hover:bg-teal-700"
          >
            Your Account
          </Link>
        )}
      </nav>

      {/* Mobile nav */}
      <details className="relative md:hidden">
        <summary className="list-none rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 marker:content-none">
          Menu
        </summary>
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          <Link href="#home" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">Home</Link>
          <Link href="#about" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">About</Link>
          <Link href="#contact" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">Contact</Link>
          <Link href="/login/student" className="mt-1 block rounded-lg px-3 py-2 text-sm text-cyan-700 hover:bg-cyan-50">
            Login as Student
          </Link>
          <Link href="/login" className="block rounded-lg px-3 py-2 text-sm text-cyan-700 hover:bg-cyan-50">
            Login as Teacher
          </Link>
          {session && (
            <Link href="/account" className="block rounded-lg px-3 py-2 text-sm text-teal-700 hover:bg-teal-50">
              Your Account
            </Link>
          )}
        </div>
      </details>
    </>
  );
}
