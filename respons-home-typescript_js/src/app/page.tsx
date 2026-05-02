import Link from "next/link";

// Static landing page – no DB call needed here.
// Move data-fetching to dedicated API routes or server components
// that actually need the data.

const corePillars = [
  {
    title: "Short Weekly Lessons",
    body: "Students complete one focused topic at a time (10–15 minutes) to build steady habits.",
  },
  {
    title: "Real-Life Practice",
    body: "Each lesson includes a small activity like planning a snack budget or comparing prices.",
  },
  {
    title: "Progress You Can Read",
    body: "Parents and teachers get plain-language summaries instead of complicated analytics.",
  },
];

const curriculumRows = [
  { grade: "K–2", focus: "Needs vs. wants, coins, simple saving goals" },
  { grade: "3–5", focus: "Budget basics, earning, spending choices" },
  { grade: "6–8", focus: "Banking intro, interest, digital money habits" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50 text-slate-900">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-600 text-lg text-white shadow-sm">
              🐳
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight text-cyan-700">Orcanomics</p>
              <p className="text-xs text-slate-500">Financial learning for K–8</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="#home" className="text-cyan-700">Home</Link>
            <Link href="#about" className="text-slate-700 transition hover:text-cyan-700">About</Link>
            <Link href="#contact" className="text-slate-700 transition hover:text-cyan-700">Contact</Link>
            <Link href="/login" className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:border-cyan-600 hover:text-cyan-700">
              Login / Signup
            </Link>
            <Link href="/account" className="rounded-full bg-teal-600 px-4 py-2 font-semibold text-white transition hover:bg-teal-700">
              Your Account
            </Link>
          </nav>

          <details className="relative md:hidden">
            <summary className="list-none rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 marker:content-none">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              <Link href="#home" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">Home</Link>
              <Link href="#about" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">About</Link>
              <Link href="#contact" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">Contact</Link>
              <Link href="/login" className="mt-1 block rounded-lg px-3 py-2 text-sm text-cyan-700 hover:bg-cyan-50">Login</Link>
              <Link href="/account" className="block rounded-lg px-3 py-2 text-sm text-teal-700 hover:bg-teal-50">Your Account</Link>
            </div>
          </details>
        </div>
      </header>

      {/* ── Hero ── */}
      <section id="home" className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_0.8fr] md:py-20">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">Now enrolling K–8 classrooms</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
              Financial education that feels clear, practical, and age-appropriate.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-700">
              Orcanomics teaches students how money works using short lessons and everyday examples. No hype—just the
              skills children actually need.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="rounded-md bg-cyan-700 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-800">
                Login
              </Link>
              <Link href="/demo" className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100">
                View Demo Lesson
              </Link>
            </div>
          </div>

          <aside className="rounded-xl border border-slate-200 bg-stone-50 p-5">
            <p className="text-sm font-semibold text-slate-900">This week in class</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="border-l-2 border-cyan-700 pl-3">
                <p className="font-medium text-slate-900">Grade 2</p>
                <p>Choosing between needs and wants</p>
              </li>
              <li className="border-l-2 border-cyan-700 pl-3">
                <p className="font-medium text-slate-900">Grade 5</p>
                <p>Creating a simple weekly budget</p>
              </li>
              <li className="border-l-2 border-cyan-700 pl-3">
                <p className="font-medium text-slate-900">Grade 7</p>
                <p>How debit cards and bank accounts work</p>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Why schools and families use Orcanomics
          </h2>
          <p className="mt-3 text-slate-700">
            We built Orcanomics to support real classrooms. The platform is simple to run, easy to understand, and
            focused on meaningful student growth.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {corePillars.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Curriculum by grade band</h2>
            <p className="mt-3 text-slate-700">
              Lessons are adapted for student age and reading level. Every unit includes guided practice and a short
              follow-up check.
            </p>
            <p className="mt-4 text-sm text-slate-600">Sample scope and sequence:</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-left text-slate-800">
                  <th className="px-4 py-3 font-semibold">Grade Band</th>
                  <th className="px-4 py-3 font-semibold">Core Focus</th>
                </tr>
              </thead>
              <tbody>
                {curriculumRows.map((row) => (
                  <tr key={row.grade} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.grade}</td>
                    <td className="px-4 py-3 text-slate-700">{row.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Parent tools + Mascot ── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid gap-8 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-600">Parent tools</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Stay involved without extra complexity</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>• Weekly summaries with plain-language progress notes</li>
              <li>• Optional at-home challenges to reinforce class topics</li>
              <li>• Suggestions for conversations about spending and saving</li>
            </ul>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-600">Meet Ollie</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">A mascot that guides, not distracts</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              Ollie helps students through lessons with prompts and encouragement. The tone stays calm and supportive,
              so kids stay focused on learning instead of chasing points.
            </p>
          </article>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-slate-900 py-14 text-white">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-wide text-cyan-300">For schools, families, and after-school programs</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Teach money skills early—with tools built for real classrooms.
            </h2>
            <p className="mt-4 text-slate-300">
              Start with one class or one child. Expand as needed. Orcanomics is built to be practical from day one.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/trial" className="rounded-md bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-cyan-400">
                Start Free Trial
              </Link>
              <Link href="/contact" className="rounded-md border border-slate-600 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="border-t border-slate-200 bg-stone-100 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-4 px-6 text-sm text-slate-700 md:flex-row md:items-center">
          <p>© 2026 Orcanomics. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/faq" className="hover:text-cyan-700">FAQ</Link>
            <Link href="/contact" className="hover:text-cyan-700">Contact</Link>
            <Link href="/privacy" className="hover:text-cyan-700">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
