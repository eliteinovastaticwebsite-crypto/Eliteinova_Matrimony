import React, { useEffect, useRef, useState } from "react";
import { ChatBubbleLeftEllipsisIcon, XMarkIcon } from "@heroicons/react/24/solid";

/**
 * ChatWidget
 * - Simple floating chat assistant UI
 * - Replace `sendToApi` body with your real API call to integrate AI
 */

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    // keep previous messages in sessionStorage
    try {
      return JSON.parse(sessionStorage.getItem("chat_messages") || "[]");
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem("chat_messages", JSON.stringify(messages));
    // scroll to bottom on new message
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const sendToApi = async (text) => {
    // --- Replace this mock with a real API call to your AI backend ---
    // Example pseudo-code:
    // const res = await fetch('/api/ai-chat', { method: 'POST', body: JSON.stringify({ message: text }) })
    // const data = await res.json();
    // return data.reply;
    await new Promise((r) => setTimeout(r, 700)); // fake delay

    // Very simple mock reply logic
    const low = text.toLowerCase();
    if (low.includes("price") || low.includes("cost")) {
      return "Pricing depends on the service. Which service would you like pricing for? (e.g. Premium Membership, Verification)";
    }
    if (low.includes("hello") || low.includes("hi")) {
      return "Hi! 👋 I'm Eliteinova Assistant. How can I help you today? You can ask about membership, verification, or wedding services.";
    }
    return "Thanks — our team will contact you shortly. Meanwhile, you can check our Services page or request a callback.";
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { id: Date.now() + "-u", role: "user", text: trimmed, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const reply = await sendToApi(trimmed);
      const botMsg = { id: Date.now() + "-b", role: "bot", text: reply, ts: Date.now() + 1 };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      setMessages((m) => [...m, { id: Date.now() + "-b", role: "bot", text: "Sorry, something went wrong. Try again later." }]);
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    sessionStorage.removeItem("chat_messages");
  };

  return (
  <>
    {/* Chat panel — render only when open */}
    {open && (
      <div className="fixed right-4 bottom-24 z-50">
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-br from-red-500 to-red-500  text-white">
            <div className="flex items-center gap-2">
              <ChatBubbleLeftEllipsisIcon className="w-5 h-5 " />
              <div className="font-semibold">Eliteinova Assistant</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                title="Clear chat"
                className="text-white/80 hover:text-white p-1 rounded"
              >
                Clear
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-white/10"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="h-64 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-sm text-gray-500 text-center mt-6">
                Ask me anything about our services, pricing, or how to register.
              </div>
            )}

            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={`${
                      m.role === "user"
                        ? "inline-block bg-red-500 text-white"
                        : "inline-block bg-white border"
                    } px-3 py-2 rounded-xl shadow-sm max-w-[85%]`}
                  >
                    <div className="text-sm">{m.text}</div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </div>

          <form
            onSubmit={sendMessage}
            className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:opacity-60"
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    )}

    {/* Floating chat button */}
    <button
      onClick={() => setOpen(true)}
      aria-label="Open chat"
      className="fixed right-4 bottom-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-500 text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
      title="Chat with Assistant"
    >
      <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
    </button>
  </>
);
}
