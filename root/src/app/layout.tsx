import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Providers from "@/components/SessionProvider";
import SiteBanner from "@/components/SiteBanner";

export const metadata: Metadata = {
  title: "Orcanomics | Financial Learning for K–8",
  description: "Orcanomics helps students learn practical money skills.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">
        <Providers>
          <SiteBanner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
