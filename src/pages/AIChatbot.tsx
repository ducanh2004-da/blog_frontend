import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import {
  Image as ImageIcon,
  Plus,
  Loader2,
  MessageSquare,
  Trash,
  Zap,
} from "lucide-react";
import { PaperClassKey } from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

// Simple Message type — chỉnh theo dự án của bạn nếu cần
type Role = "user" | "ai" | "system";

type Message = {
  id: string;
  role: Role;
  text: string;
  time?: string;
};

export default function AIChatbot() {
  const { user: authUser } = useAuthStore();
  const navigate = useNavigate();

  // sample messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      role: "ai",
      text: "Chào bạn! Mình là trợ lý AI — mình có thể giúp bạn tìm ra bất cứ bài blog bạn muốn",
      time: "09:00",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [conversationTitle, setConversationTitle] = useState("Tư vấn với AI");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // quick suggestions
  const quickPrompts = [
    "Hãy lấy cho tôi các bài blog có tác giả là Do DUc Anh",
    "Hãy lấy cho tôi danh sách tất cả các bài blog",
  ];

  useEffect(() => {
    // auto scroll to bottom when messages change
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  function nowTime() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function addMessage(role: Role, text: string) {
    const msg: Message = { id: String(Date.now()) + Math.random().toString(36).slice(2, 7), role, text, time: nowTime() };
    setMessages((s) => [...s, msg]);
    return msg;
  }

  function send(userText?: string) {
    const text = (userText ?? input).trim();
    if (!text) return;
    setLoadingSend(true);
    // add user message
    addMessage("user", text);
    setInput("");

    // simulate API call / streaming response
    setTimeout(() => {
      setIsTyping(true);
      setLoadingSend(false);
    }, 250);

    // fake AI reply after delay
    setTimeout(() => {
      // generate a simple canned reply (replace with your real API call)
      const reply = generateFakeReply(text);
      addMessage("ai", reply);
      setIsTyping(false);
    }, 1200 + Math.min(text.length * 25, 2200));
  }

  function generateFakeReply(userText: string) {
    // Very simple heuristics for demo — replace with AI API logic
    if (/react|tailwind|typescript/i.test(userText)) {
      return `Mình thấy bạn quan tâm tới ${userText.match(/react|tailwind|typescript/i)?.[0] || "kĩ thuật"}. Gợi ý nhanh: tách component, dùng hook logic, tối ưu performance bằng memoization và lazy-loading. Muốn mình viết ví dụ code không?`;
    }
    if (/cv|resume|job|position/i.test(userText)) {
      return "Khi viết CV frontend, hãy nhấn mạnh project thực tế, tech stack, con số đo được (ví dụ: cải thiện tốc độ 30%). Mình có thể giúp bạn sửa CV từng mục.";
    }
    return "Cám ơn câu hỏi của bạn — mà cái bạn muốn hiện mình chưa giúp được, Bạn còn muốn mình giúp gì nữa không?";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function handleSuggestionClick(prompt: string) {
    setInput(prompt);
    // optionally send immediately
    // send(prompt)
    inputRef.current?.focus();
  }

  function clearConversation() {
    setMessages([]);
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6 border-b dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Tooltip title="Back">
              <IconButton
                onClick={() => navigate(-1)}
                color="primary"
                aria-label="back"
              >
                <ArrowBackIcon className="w-80 h-80" />
              </IconButton>
            </Tooltip>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg">AI</div>
            <div>
              <div className="text-sm text-slate-700 dark:text-slate-200 font-semibold">{conversationTitle}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Trợ lý AI — luôn sẵn sàng giúp bạn</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => setConversationTitle("Tư vấn với AI")}
                className="px-3 py-2 text-sm rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                New conversation
              </button>
              <button
                onClick={clearConversation}
                className="px-3 py-2 text-sm rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                aria-label="Clear conversation"
              >
                <Trash className="w-4 h-4" />
                Clear
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Avatar
                      alt={authUser?.username ?? "user"}
                      sx={{ width: 25, height: 25 }}
                    >
                      {authUser?.username?.charAt(0)?.toUpperCase() ?? "U"}
                    </Avatar>
                <span className="hidden sm:inline">{authUser?.username || "Bạn"}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Body: messages + sidebar optional */}
        <div className="md:flex md:gap-6">
          {/* Chat column */}
          <main className="flex-1 flex flex-col">
            <div ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
              {messages.length === 0 && (
                <div className="text-center text-slate-500 mt-10">
                  <MessageSquare className="mx-auto w-12 h-12 text-slate-400" />
                  <p className="mt-3">Không có tin nhắn — bắt đầu bằng cách gửi một câu hỏi 👇</p>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[78%] ${m.role === "user" ? "text-right" : "text-left"}`}>
                    <div className={`inline-flex items-end gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}> 
                      {/* avatar */}
                        <Avatar
                      alt={m?.role === 'user' ? authUser?.username : "AI"}
                      sx={{ width: 25, height: 25 }}
                    >
                      {m?.role === 'user' ? authUser?.username?.charAt(0)?.toUpperCase() : "AI"}
                    </Avatar>
                      {/* bubble */}
                      <div
                        className={`rounded-xl p-3 shadow-sm leading-relaxed ${
                          m.role === "user"
                            ? "bg-gradient-to-br from-emerald-500 to-blue-500 text-white"
                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{m.text}</div>
                        <div className={`text-xs mt-2 ${m.role === "user" ? "text-white/75" : "text-slate-400"}`}>{m.time}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1541661538396-2a8a3a6a86b3?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=abc" alt="ai" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border">
                      <div className="flex items-end gap-1">
                        <span className="inline-block w-2 h-2 rounded-full animate-pulse bg-slate-400/80" />
                        <span className="inline-block w-2 h-2 rounded-full animate-pulse bg-slate-400/60" />
                        <span className="inline-block w-2 h-2 rounded-full animate-pulse bg-slate-400/40" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t p-4 bg-white dark:bg-slate-900 dark:border-slate-800">
              <div className="max-w-4xl mx-auto flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800" aria-label="attach">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800" aria-label="quick action">
                    <Plus className="w-5 h-5" />
                  </button>

                  <div className="flex-1">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Hỏi bất cứ điều gì — ví dụ: 'Làm sao để học React hiệu quả?"
                      className="w-full min-h-[46px] max-h-40 resize-none rounded-xl p-3 border dark:border-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      aria-label="Message input"
                    />

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-2 flex-wrap">
                        {quickPrompts.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleSuggestionClick(q)}
                            className="text-xs px-2 py-1 rounded-full border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                          >
                            {q}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            // future: voice recording
                            alert("Chức năng voice sẽ được tích hợp sau");
                          }}
                          className="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
                          aria-label="voice"
                        >
                        </button>

                        <button
                          onClick={() => send()}
                          disabled={loadingSend || !input.trim()}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                            input.trim()
                              ? "bg-emerald-500 text-white hover:opacity-95"
                              : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700/40"
                          }`}
                        >
                          {loadingSend ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-4 h-4 rotate-45"></div>}
                          <span className="hidden sm:inline">Gửi</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">Tip: Nhấn Enter để gửi, Shift+Enter xuống dòng.</div>
              </div>
            </div>
          </main>
          
        </div>
      </div>
    </div>
  );
}

/*
  GHI CHÚ (README nhanh):
  - Component này chỉ là UI + logic giả lập (fake response). Để tích hợp AI thật:
    1. Thay generateFakeReply / setTimeout bằng gọi API đến backend của bạn (ví dụ: OpenAI, Anthropic, v.v.)
    2. Nếu dùng streaming, append partial tokens vào messages để hiện streaming
    3. Lưu conversation vào DB nếu muốn lịch sử
  - Tùy chỉnh màu: đổi gradient, màu nút (bg-emerald-500) theo brand.
  - Thêm tính năng: voice-to-text, gửi file, highlight code block (prismjs) — mình có thể thêm nếu bạn muốn.
*/
