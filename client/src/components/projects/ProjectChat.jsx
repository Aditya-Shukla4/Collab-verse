import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { Send } from "lucide-react";

export default function ProjectChat({ projectId }) {
  const socket = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [focused, setFocused] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!socket || !projectId) return;
    socket.emit("join_project_room", projectId);
    const handler = (message) => setMessages((p) => [...p, message]);
    socket.on("receive_message", handler);
    return () => socket.off("receive_message", handler);
  }, [socket, projectId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    const msg = {
      projectId,
      text: newMessage,
      sender: { _id: user._id, name: user.name },
      timestamp: new Date(),
    };
    socket.emit("send_message", msg);
    setMessages((p) => [...p, msg]);
    setNewMessage("");
  };

  return (
    <div
      style={{
        background: "var(--as-surface)",
        border: "1px solid var(--as-border)",
        borderRadius: "var(--as-radius-lg)",
        height: 380,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "0.875rem 1.25rem",
          borderBottom: "1px solid var(--as-border)",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontFamily: "var(--as-font-head)",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "var(--as-text)",
            margin: 0,
          }}
        >
          Project Chat
        </p>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.875rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.625rem",
        }}
      >
        {messages.length === 0 && (
          <p
            style={{
              textAlign: "center",
              margin: "auto",
              fontFamily: "var(--as-font-mono)",
              fontSize: "0.72rem",
              color: "var(--as-text3)",
              letterSpacing: "0.04em",
            }}
          >
            No messages yet
          </p>
        )}
        {messages.map((msg, i) => {
          const isOwn = msg.sender._id === user?._id;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isOwn ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: isOwn
                    ? "12px 12px 2px 12px"
                    : "12px 12px 12px 2px",
                  background: isOwn ? "var(--as-glow)" : "var(--as-bg3)",
                  border: `1px solid ${isOwn ? "rgba(108,99,255,0.2)" : "var(--as-border)"}`,
                }}
              >
                {!isOwn && (
                  <p
                    style={{
                      fontFamily: "var(--as-font-mono)",
                      fontSize: "0.62rem",
                      color: "var(--as-accent)",
                      margin: "0 0 2px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {msg.sender.name}
                  </p>
                )}
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--as-text)",
                    margin: 0,
                    lineHeight: 1.5,
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "0.75rem",
          borderTop: "1px solid var(--as-border)",
          flexShrink: 0,
        }}
      >
        <form onSubmit={handleSend} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Type a message…"
            style={{
              flex: 1,
              height: 36,
              background: "var(--as-bg3)",
              border: `1px solid ${focused ? "var(--as-accent)" : "var(--as-border2)"}`,
              borderRadius: "var(--as-radius-md)",
              padding: "0 0.75rem",
              fontFamily: "var(--as-font-body)",
              fontSize: "0.85rem",
              color: "var(--as-text)",
              outline: "none",
              boxShadow: focused ? "0 0 0 3px rgba(108,99,255,0.1)" : "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
          />
          <button
            type="submit"
            style={{
              width: 36,
              height: 36,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--as-radius-md)",
              border: "none",
              background:
                "linear-gradient(135deg, var(--as-accent), rgba(108,99,255,0.85))",
              color: "#fff",
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
