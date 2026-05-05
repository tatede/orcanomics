"use client";
import { useState, useEffect, useRef } from "react";

const topics = [
  "General Question",
  "Teacher Account", 
  "Student Account",
  "Billing",
  "Technical Issue",
];

type Message = {
  id: string;
  sender: string;
  message: string;
  createdAt: string;
};

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"info" | "topic" | "chat">("info");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ticketId) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/support/messages?ticketId=${ticketId}`);
      const data = await res.json();
      setMessages(data);
    }, 5000);
    return () => clearInterval(interval);
  }, [ticketId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startChat() {
    if (!email.trim()) return;
    setLoading(true);
    const res = await fetch("/api/support/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, topic }),
    });
    const data = await res.json();
    setTicketId(data.id);
    setMessages([]);
    setStep("chat");
    setLoading(false);
  }

  async function sendMessage() {
    if (!input.trim() || !ticketId) return;
    const msg = input;
    setInput("");
    await fetch("/api/support/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId, sender: "customer", message: msg }),
    });
    const res = await fetch(`/api/support/messages?ticketId=${ticketId}`);
    const data = await res.json();
    setMessages(data);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg transition hover:scale-105"
        style={{ width: 56, height: 56, background: "#0284C7" }}
      >
        {open ? (
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Widget */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl overflow-hidden shadow-2xl flex flex-col" style={{ height: "520px", background: "white" }}>
          
          {/* Header */}
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: "#0284C7" }}>
            <img src="/images/LogoV1.png" alt="Orcanomics" className="h-8 w-8 rounded-lg object-contain" />
            <div>
              <p className="font-bold text-white text-sm">Orcanomics Support</p>
              <p className="text-xs text-cyan-100">We typically reply within minutes</p>
            </div>
          </div>

          {/* Info step */}
          {step === "info" && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <p className="text-lg font-bold text-slate-900">Hello! 👋</p>
                <p className="text-sm text-slate-500 mt-1">Welcome to Orcanomics support. Please provide your details to get started.</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Name <span className="text-slate-400 normal-case font-normal">Optional</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Topic</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {topics.map(t => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className="rounded-full px-3 py-1 text-xs font-medium transition"
                      style={{
                        background: topic === t ? "#0284C7" : "#F1F5F9",
                        color: topic === t ? "white" : "#475569",
                        border: topic === t ? "none" : "1px solid #E2E8F0"
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={startChat}
                disabled={!email.trim() || !topic || loading}
                className="w-full rounded-xl py-3 text-sm font-bold text-white transition disabled:opacity-50"
                style={{ background: "#0284C7" }}
              >
                {loading ? "Starting..." : "Start Chat →"}
              </button>
            </div>
          )}

          {/* Chat step */}
          {step === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "#F8FAFC" }}>
                <div className="text-center">
                  <span className="text-xs text-slate-400 bg-white rounded-full px-3 py-1 border border-slate-200">
                    {topic}
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="rounded-2xl rounded-tl-none px-4 py-2.5 text-sm max-w-xs" style={{ background: "#E2E8F0", color: "#1E293B" }}>
                    Hi {name || "there"}! Thanks for reaching out about <strong>{topic}</strong>. A support agent will be with you shortly. Please describe your issue below.
                  </div>
                </div>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}>
                    <div
                      className="rounded-2xl px-4 py-2.5 text-sm max-w-xs"
                      style={{
                        background: msg.sender === "customer" ? "#0284C7" : "#E2E8F0",
                        color: msg.sender === "customer" ? "white" : "#1E293B",
                        borderRadius: msg.sender === "customer" ? "18px 18px 4px 18px" : "18px 18px 18px 4px"
                      }}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="p-3 border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={sendMessage}
                  className="rounded-xl px-4 py-2 text-sm font-bold text-white"
                  style={{ background: "#0284C7" }}
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
