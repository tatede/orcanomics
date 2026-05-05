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
  const [step, setStep] = useState<"history" | "info" | "chat">("history");
  const [topic, setTopic] = useState("");
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [lastSeen, setLastSeen] = useState<Record<string, number>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/student_id=([^;]+)/);
    if (match) setStudentId(match[1]);
  }, []);

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

  useEffect(() => {
    if (!ticketId || open) return;
    const agentMessages = messages.filter(m => m.sender === "agent");
    const seen = lastSeen[ticketId] ?? 0;
    const unreadCount = agentMessages.filter(m => new Date(m.created_at).getTime() > seen).length;
    setUnread(unreadCount);
  }, [messages, ticketId, open, lastSeen]);

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
    setLoading(true);
    const res = await fetch("/api/support/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
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
  const displayName = session?.user?.name ?? (studentId ? "Student" : "there");

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 50,
          width: 56, height: 56, borderRadius: "50%",
          background: "#0284C7", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}
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
        <div style={{
          position: "fixed", bottom: 96, right: 24, zIndex: 50,
          width: 320, height: 520, borderRadius: 16,
          overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          display: "flex", flexDirection: "column", background: "white"
        }}>

          {/* Header */}
          <div style={{ background: "#0284C7", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            {step !== "history" && (
              <button
                onClick={() => setStep("history")}
                style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1rem", padding: "0 8px 0 0" }}
              >
                ←
              </button>
            )}
            <img src="/images/LogoV1.png" alt="Orcanomics" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "contain" }} />
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "white", fontSize: "0.9rem" }}>Orcanomics Support</p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#BAE6FD" }}>We typically reply within minutes</p>
            </div>
          </div>

          {/* History step */}
          {step === "history" && (
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {!isLoggedIn ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: "0 16px" }}>
                  <div style={{ fontSize: "3rem" }}>🔒</div>
                  <p style={{ fontWeight: 700, color: "#0F172A", margin: 0 }}>Sign in required</p>
                  <p style={{ fontSize: "0.85rem", color: "#64748B", margin: 0 }}>You must be signed in as a student or teacher to access support.</p>
                  
                    href="/login/student"
                    style={{ width: "100%", background: "#0284C7", color: "white", padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: "0.85rem", textAlign: "center", textDecoration: "none", display: "block" }}
                  >
                    Student Sign In
                  </a>
                  
                    href="/login"
                    style={{ width: "100%", background: "#F1F5F9", color: "#0F172A", padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: "0.85rem", textAlign: "center", textDecoration: "none", display: "block" }}
                  >
                    Teacher Sign In
                  </a>
                </div>
              ) : (
                <>
                  <p style={{ fontWeight: 600, color: "#0F172A", margin: 0 }}>Hello {displayName}! 👋</p>
                  <p style={{ fontSize: "0.8rem", color: "#64748B", margin: 0 }}>How can we help you today?</p>
                  <button
                    onClick={() => setStep("info")}
                    style={{ background: "#0284C7", color: "white", padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer" }}
                  >
                    + New Conversation
                  </button>
                  {tickets.length > 0 && (
                    <>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "8px 0 0" }}>Previous Conversations</p>
                      {tickets.map(ticket => (
                        <div
                          key={ticket.id}
                          onClick={() => openTicket(ticket)}
                          style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: 12, cursor: "pointer" }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.85rem", color: "#0F172A" }}>{ticket.topic}</p>
                            <span style={{
                              fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                              background: ticket.status === "open" ? "#DCFCE7" : "#F1F5F9",
                              color: ticket.status === "open" ? "#059669" : "#64748B"
                            }}>
                              {ticket.status}
                            </span>
                          </div>
                          <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#94A3B8" }}>{new Date(ticket.created_at).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Info step */}
          {step === "info" && (
            <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: 12 }}>
                <p style={{ margin: 0, fontWeight: 600, color: "#059669", fontSize: "0.85rem" }}>✓ Signed in as {displayName}</p>
                <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#16A34A" }}>Your conversation will be saved to your account</p>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>Select a Topic</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {topics.map(t => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      style={{
                        padding: "6px 12px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
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
                disabled={!topic || loading}
                style={{
                  background: "#0284C7", color: "white", padding: "12px", borderRadius: 10,
                  fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer",
                  opacity: !topic || loading ? 0.5 : 1
                }}
              >
                {loading ? "Starting..." : "Start Chat →"}
              </button>
            </div>
          )}

          {/* Chat step */}
          {step === "chat" && (
            <>
              <div style={{ flex: 1, overflowY: "auto", padding: 16, background: "#F8FAFC", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "#94A3B8", background: "white", borderRadius: 999, padding: "4px 12px", border: "1px solid #E2E8F0" }}>
                    {topic}
                  </span>
                </div>
                <div style={{ background: "#E2E8F0", borderRadius: "18px 18px 18px 4px", padding: "10px 14px", fontSize: "0.85rem", color: "#1E293B", maxWidth: "85%" }}>
                  Hi {displayName}! Thanks for reaching out about <strong>{topic}</strong>. A support agent will be with you shortly.
                </div>
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "customer" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "85%", padding: "10px 14px", fontSize: "0.85rem",
                      background: msg.sender === "customer" ? "#0284C7" : "#E2E8F0",
                      color: msg.sender === "customer" ? "white" : "#1E293B",
                      borderRadius: msg.sender === "customer" ? "18px 18px 4px 18px" : "18px 18px 18px 4px"
                    }}>
                      {msg.message}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div style={{ padding: 12, borderTop: "1px solid #E2E8F0", display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: "0.85rem", outline: "none" }}
                />
                <button
                  onClick={sendMessage}
                  style={{ background: "#0284C7", color: "white", padding: "10px 16px", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
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
