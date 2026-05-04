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
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="bg-slate-100 text-slate-900 antialiased">
        <Providers>
          <SiteBanner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
