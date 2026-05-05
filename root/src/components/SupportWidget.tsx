"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

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
  created_at: string;
};

type Ticket = {
  id: string;
  topic: string;
  status: string;
  created_at: string;
};

export default function SupportWidget() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"history" | "info" | "topic" | "chat">("history");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [lastSeen, setLastSeen] = useState<Record<string, number>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  // Get student id from cookie
  const [studentId, setStudentId] = useState<string | null>(null);
  useEffect(() => {
    const match = document.cookie.match(/student_id=([^;]+)/);
    if (match) setStudentId(match[1]);
  }, []);

  // Load previous tickets
  useEffect(() => {
    if (!open) return;
    async function loadTickets() {
      if (studentId) {
        const res = await fetch(`/api/support/tickets?studentId=${studentId}`);
        const data = await res.json();
        setTickets(data);
      } else if (session?.user?.email) {
        const res = await fetch(`/api/support/tickets?teacherEmail=${encodeURIComponent(session.user.email)}`);
        const data = await res.json();
        setTickets(data);
      }
    }
    loadTickets();
  }, [open, studentId, session]);

  // Poll messages
  useEffect(() => {
    if (!ticketId) return;
    async function fetchMessages() {
      const res = await fetch(`/api/support/messages?ticketId=${ticketId}`);
      const data = await res.json();
      setMessages(data);
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [ticketId]);

  // Count unread agent messages
  useEffect(() => {
    if (!ticketId || open) return;
    const agentMessages = messages.filter(m => m.sender === "agent");
    const seen = lastSeen[ticketId] ?? 0;
    const unreadCount = agentMessages.filter(m => new Date(m.created_at).getTime() > seen).length;
    setUnread(unreadCount);
  }, [messages, ticketId, open, lastSeen]);

  // Mark as read when opened
  useEffect(() => {
    if (open && ticketId) {
      setLastSeen(prev => ({ ...prev, [ticketId]: Date.now() }));
      setUnread(0);
    }
  }, [open, ticketId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startChat() {
    if (!topic) return;
    if (!studentId && !session?.user?.email && !email.trim()) return;
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

  async function openTicket(ticket: Ticket) {
    setTicketId(ticket.id);
    setTopic(ticket.topic);
    setStep("chat");
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

  const isLoggedIn = !!studentId || !!session?.user?.email;
  const displayName = session?.user?.name ?? name ?? "there";

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg transition hover:scale-105"
        style={{ width: 56, height: 56, background: "#0284C7" }}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {unread > 0 && !open && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            background: "#EF4444", color: "white",
            borderRadius: "999px", width: "20px", height: "20px",
            fontSize: "0.7rem", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid white"
          }}>
            {unread}
          </span>
        )}
      </button>

      {/* Widget */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl overflow-hidden shadow-2xl flex flex-col" style={{ height: "520px", background: "white" }}>

          {/* Header */}
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: "#0284C7" }}>
            {step !== "history" && (
              <button
                onClick={() => setStep("history")}
                style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: "0 8px 0 0", fontSize: "1rem" }}
              >
                ←
              </button>
            )}
            <img src="/images/LogoV1.png" alt="Orcanomics" className="h-8 w-8 rounded-lg object-contain" />
            <div>
              <p className="font-bold text-white text-sm">Orcanomics Support</p>
              <p className="text-xs text-cyan-100">We typically reply within minutes</p>
            </div>
          </div>

          {/* History step */}
          {step === "history" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-900">Hello {isLoggedIn ? displayName : ""}! 👋</p>
              <p className="text-xs text-slate-500">How can we help you today?</p>

              <button
                onClick={() => setStep("info")}
                className="w-full rounded-xl py-3 text-sm font-bold text-white"
                style={{ background: "#0284C7" }}
              >
                + New Conversation
              </button>

              {tickets.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-2">Previous Conversations</p>
                  {tickets.map(ticket => (
                    <div
                      key={ticket.id}
                      onClick={() => openTicket(ticket)}
                      className="rounded-xl p-3 cursor-pointer hover:bg-slate-50 transition"
                      style={{ border: "1px solid #E2E8F0" }}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">{ticket.topic}</p>
                        <span style={{
                          fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px",
                          borderRadius: "999px",
                          background: ticket.status === "open" ? "#DCFCE7" : "#F1F5F9",
                          color: ticket.status === "open" ? "#059669" : "#64748B"
                        }}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{new Date(ticket.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </>
              )}

              {!isLoggedIn && tickets.length === 0 && (
                <p className="text-xs text-slate-400 text-center mt-4">
                  Sign in as a student or teacher to view previous conversations
                </p>
              )}
            </div>
          )}

          {/* Info step */}
          {step === "info" && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {!isLoggedIn && (
                <>
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
                </>
              )}
              {isLoggedIn && (
                <div className="rounded-xl p-3 text-sm" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                  <p className="font-semibold text-green-700">✓ Signed in</p>
                  <p className="text-green-600 text-xs mt-0.5">Your conversation will be saved to your account</p>
                </div>
              )}
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
                disabled={!topic || (!isLoggedIn && !email.trim()) || loading}
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
                    Hi {displayName}! Thanks for reaching out about <strong>{topic}</strong>. A support agent will be with you shortly.
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
