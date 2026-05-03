"use client";
import { useEffect, useState } from "react";

export default function SiteBanner() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/message")
      .then((r) => r.json())
      .then((d) => setMessage(d.message));
  }, []);

  if (!message) return null;

  return (
    <div className="w-full bg-cyan-700 px-4 py-2 text-center text-sm font-semibold text-white">
      {message}
    </div>
  );
}
