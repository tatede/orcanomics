import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orcanomics | Financial Learning for K–8",
  description:
    "Orcanomics helps students learn practical money skills through interactive lessons, progress tracking, and family-friendly tools.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
