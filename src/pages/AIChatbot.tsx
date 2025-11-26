import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { Image as ImageIcon, Plus, Loader2, Trash, Send } from "lucide-react";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

/** Types **/
type Role = "user" | "ai" | "system";

type Message = {
  id: string;
  role: Role;
  text: string;
  time?: string;
  loading?: boolean;
  error?: string | null;
  data?: any; // optional structured data (e.g. rows/spec) for DB queries
};

const STORAGE_KEY = "ai_chat_local_conversation_v1";

/** Helpers **/
function nowTime(): string {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function uid(prefix = "") {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// parse model/chat responses (keeps previous robust logic)
function parseModelResponse(data: any): string {
  if (data === null || data === undefined) return "";
  if (typeof data === "object" && typeof (data as any).text === "string") {
    const innerStr = (data as any).text.trim();
    if ((innerStr.startsWith("{") || innerStr.startsWith("["))) {
      try {
        const inner = JSON.parse(innerStr);
        return parseModelResponse(inner);
      } catch {}
    }
  }
  if (typeof data === "string") {
    const s = data.trim();
    if (s === "") return "";
    if ((s.startsWith("{") || s.startsWith("["))) {
      try {
        const parsed = JSON.parse(s);
        return parseModelResponse(parsed);
      } catch {
        return s.length > 2000 ? s.slice(0, 2000) + "..." : s;
      }
    }
    return s.length > 2000 ? s.slice(0, 2000) + "..." : s;
  }
  if (typeof data === "object") {
    const d: any = data;
    const prefer = ["response", "text", "output", "reply", "answer", "content", "message"];
    for (const k of prefer) {
      if (typeof d[k] === "string" && d[k].trim()) return d[k].trim();
      if (Array.isArray(d[k]) && d[k].every((x: any) => typeof x === "string")) return d[k].join(" ");
    }
    if (Array.isArray(d.choices) && d.choices[0]) {
      const c = d.choices[0];
      if (typeof c.text === "string" && c.text.trim()) return c.text.trim();
      if (c.message?.content && typeof c.message.content === "string") return c.message.content.trim();
    }
    if (Array.isArray(d.results) && d.results[0]) {
      const r = d.results[0];
      if (typeof r.output === "string" && r.output.trim()) return r.output.trim();
      if (typeof r.text === "string" && r.text.trim()) return r.text.trim();
      if (typeof r.response === "string" && r.response.trim()) return r.response.trim();
    }
    try {
      const clone: any = Array.isArray(d) ? [...d] : { ...d };
      for (const k of Object.keys(clone)) {
        const v = clone[k];
        if (Array.isArray(v) && v.length > 200 && v.every((x: any) => typeof x === "number")) {
          delete clone[k];
        }
      }
      const s = JSON.stringify(clone);
      return s.length > 1200 ? s.slice(0, 1200) + "..." : s;
    } catch {
      return String(d);
    }
  }
  return String(data);
}

/** API base (Vite env or relative) **/
const API_BASE =  "https://backend-chatbot-query.onrender.com";

/** Main component **/
export default function AIChatbot() {
  const { user: authUser } = useAuthStore();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw
        ? (JSON.parse(raw) as Message[])
        : [
            {
              id: uid("m"),
              role: "ai",
              text: "Chào bạn! Mình là trợ lý AI — bạn có thể chat bình thường hoặc bật 'Query DB' để truy vấn database bằng ngôn ngữ tự nhiên.",
              time: nowTime(),
            },
          ];
    } catch {
      return [
        {
          id: uid("m"),
          role: "ai",
          text: "Chào bạn! Mình là trợ lý AI — bạn có thể chat bình thường hoặc bật 'Query DB' để truy vấn database bằng ngôn ngữ tự nhiên.",
          time: nowTime(),
        },
      ];
    }
  });

  const [input, setInput] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [conversationTitle, setConversationTitle] = useState("Tư vấn với AI");
  const [isTyping, setIsTyping] = useState(false);
  const [isDbQuery, setIsDbQuery] = useState(false); // toggle for DB queries

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const quickPrompts = [
    "Hãy lấy cho tôi các bài blog có tác giả là Do Duc Anh",
    "Cho tôi 5 bài blog gần nhất",
    "Danh sách bài có tag 'react'",
  ];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  function addMessage(msg: Message) {
    setMessages((s) => [...s, msg]);
  }
  function replaceMessageText(id: string, patch: Partial<Message>) {
    setMessages((s) => s.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  // Format rows into a simple array of display items (string + optional meta)
  function formatRowsPreview(rows: any[]): { title: string; subtitle?: string; raw?: any }[] {
    if (!Array.isArray(rows)) return [];
    return rows.map((r) => {
      // try common Blog fields
      if (r.title || r.content) {
        const title = r.title ?? (r.id ? `Blog ${r.id.slice(0, 6)}` : "Untitled");
        const subtitle = r.content ? (typeof r.content === "string" ? (r.content.slice(0, 180) + (r.content.length > 180 ? "..." : "")) : JSON.stringify(r.content).slice(0, 180)) : undefined;
        return { title, subtitle, raw: r };
      }
      // generic: pick first string field as title
      const keys = Object.keys(r);
      const firstStr = keys.map(k => r[k]).find(v => typeof v === "string");
      const title = firstStr ? (String(firstStr).slice(0, 120) + (String(firstStr).length > 120 ? "..." : "")) : (r.id ? String(r.id).slice(0, 12) : JSON.stringify(r).slice(0, 60));
      return { title, subtitle: undefined, raw: r };
    });
  }

  // send either to normal chat or to nlquery endpoint
  async function sendMessageToBackend(inputText: string, assistantMsgId: string) {
    const url = isDbQuery ? `${API_BASE}/api/nlquery` : `${API_BASE}/api/chat`;
    const body = isDbQuery ? { q: inputText } : { message: inputText };

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Server error: ${resp.status} ${txt}`);
      }
      const data = await resp.json();

      if (isDbQuery) {
        // expected shape: { rows: [...], spec: {...} } or { error: "..." }
        if (data?.error) {
          replaceMessageText(assistantMsgId, { text: `Error: ${data.error}`, loading: false, error: data.error, time: nowTime() });
        } else {
          const rows = Array.isArray(data.rows) ? data.rows : [];
          const spec = data.spec ?? null;
          const preview = formatRowsPreview(rows);
          const summaryText = rows.length === 0 ? "Không tìm thấy kết quả." : `Tìm thấy ${rows.length} kết quả. Hiển thị ${Math.min(rows.length, 5)} mục.`;
          replaceMessageText(assistantMsgId, { text: summaryText, loading: false, error: null, data: { rows: preview, rawRows: rows, spec }, time: nowTime() });
        }
      } else {
        // normal chat response - parse robustly
        let parsedText = "";
        if (data && typeof data === "object" && typeof data.text === "string") {
          const inner = data.text.trim();
          if (inner.startsWith("{") || inner.startsWith("[")) {
            try {
              const innerObj = JSON.parse(inner);
              parsedText = parseModelResponse(innerObj);
            } catch {
              parsedText = parseModelResponse(inner);
            }
          } else {
            parsedText = parseModelResponse(data.text);
          }
        } else {
          parsedText = parseModelResponse(data);
        }
        replaceMessageText(assistantMsgId, { text: parsedText, loading: false, error: null, time: nowTime() });
      }

      setIsTyping(false);
    } catch (err: any) {
      console.error("sendMessageToBackend error:", err);
      replaceMessageText(assistantMsgId, { text: err?.message ?? "Lỗi khi gọi server", loading: false, error: err?.message ?? "error", time: nowTime() });
      setIsTyping(false);
    } finally {
      setLoadingSend(false);
    }
  }

  // send wrapper
  function send(userText?: string) {
    const text = (userText ?? input).trim();
    if (!text) return;
    const userMsg: Message = { id: uid("u"), role: "user", text, time: nowTime() };
    addMessage(userMsg);

    const assistantMsg: Message = { id: uid("a"), role: "ai", text: isDbQuery ? "Đang truy vấn database..." : "Đang suy nghĩ...", time: nowTime(), loading: true, error: null };
    addMessage(assistantMsg);

    setInput("");
    setLoadingSend(true);
    setIsTyping(true);

    sendMessageToBackend(text, assistantMsg.id);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loadingSend) send();
    }
  }

  function handleSuggestionClick(prompt: string) {
    setInput(prompt);
    inputRef.current?.focus();
  }

  function clearConversation() {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setConversationTitle("Tư vấn với AI");
  }

  function retryMessage(msg: Message) {
    if (msg.role !== "ai" || !msg.error) return;
    const idx = messages.findIndex((m) => m.id === msg.id);
    let prevUser: Message | undefined;
    for (let i = idx - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        prevUser = messages[i];
        break;
      }
    }
    if (!prevUser) return;
    replaceMessageText(msg.id, { loading: true, error: null, text: "Đang thử lại..." });
    setIsTyping(true);
    // If this AI message had data (db), keep isDbQuery true for retry attempt.
    sendMessageToBackend(prevUser.text, msg.id);
  }

  // render rows preview under bubble
  function renderRowsPreview(msg: Message) {
    const rows = msg.data?.rows as { title: string; subtitle?: string }[] | undefined;
    if (!rows || !Array.isArray(rows) || rows.length === 0) return null;
    return (
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rows.slice(0, 6).map((r, i) => (
          <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md border">
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-100">{r.title}</div>
            {r.subtitle && <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{r.subtitle}</div>}
          </div>
        ))}
        {msg.data?.rawRows && msg.data.rawRows.length > 6 && (
          <div className="text-xs text-slate-500">Hiện chỉ hiển thị 6 mục — bạn có thể tinh chỉnh câu lệnh để lấy nhiều hơn.</div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border">
        <header className="flex items-center justify-between p-4 md:p-6 border-b dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Tooltip title="Back">
              <IconButton onClick={() => navigate(-1)} color="primary" aria-label="back"><ArrowBackIcon /></IconButton>
            </Tooltip>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg">AI</div>
            <div>
              <div className="text-sm text-slate-700 dark:text-slate-200 font-semibold">{conversationTitle}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Trợ lý AI — chat hoặc Query DB bằng ngôn ngữ tự nhiên</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <button onClick={() => setConversationTitle("Tư vấn với AI")} className="px-3 py-2 text-sm rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">New conversation</button>
              <button onClick={clearConversation} className="px-3 py-2 text-sm rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2" aria-label="Clear conversation">
                <Trash className="w-4 h-4" /> Clear
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Avatar sx={{ width: 28, height: 28 }}>{authUser?.username?.charAt(0)?.toUpperCase() ?? "U"}</Avatar>
              <div className="text-sm hidden sm:block text-slate-600 dark:text-slate-300">{authUser?.username ?? "Bạn"}</div>
            </div>
          </div>
        </header>

        <div className="md:flex md:gap-6">
          <main className="flex-1 flex flex-col">
            <div ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
              {messages.length === 0 && (
                <div className="text-center text-slate-500 mt-10">
                  <div className="mx-auto w-12 h-12 text-slate-400">💬</div>
                  <p className="mt-3">Không có tin nhắn — bắt đầu bằng cách gửi một câu hỏi 👇</p>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[78%] ${m.role === "user" ? "text-right" : "text-left"}`}>
                    <div className={`inline-flex items-end gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar sx={{ width: 28, height: 28 }}>{m.role === "user" ? (authUser?.username?.charAt(0)?.toUpperCase() ?? "U") : "AI"}</Avatar>

                      <div className={`rounded-xl p-3 shadow-sm leading-relaxed ${m.role === "user" ? "bg-gradient-to-br from-emerald-500 to-blue-500 text-white" : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border"}`}>
                        <div className="whitespace-pre-wrap break-words">{m.text}</div>

                        {/* render structured rows if present */}
                        {m.data?.rows && renderRowsPreview(m)}

                        <div className="flex items-center gap-2 mt-2">
                          <div className={`text-xs ${m.role === "user" ? "text-white/75" : "text-slate-400"}`}>{m.time}</div>
                          {m.loading && <div className="text-xs text-slate-400 italic"> · thinking…</div>}
                          {m.error && (
                            <button onClick={() => retryMessage(m)} className="ml-2 text-xs text-rose-500 underline">Retry</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img src="/mnt/data/08bcd2d5-26c4-466d-afc4-b7058d045512.png" alt="ai" className="w-full h-full object-cover" />
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
                  <button className="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800" aria-label="attach"><ImageIcon className="w-5 h-5" /></button>
                  <button className="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800" aria-label="quick action"><Plus className="w-5 h-5" /></button>

                  <div className="flex-1">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={isDbQuery ? "Nhập truy vấn bằng ngôn ngữ tự nhiên, ví dụ: 'Hãy lấy 3 bài blog của tác giả Đỗ Đức Anh'" : "Hỏi bất cứ điều gì — ví dụ: 'Làm sao để học React hiệu quả?'"}
                      className="w-full min-h-[46px] max-h-40 resize-none rounded-xl p-3 border dark:border-slate-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      aria-label="Message input"
                    />

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-2 flex-wrap">
                        {quickPrompts.map((q) => (
                          <button key={q} onClick={() => handleSuggestionClick(q)} className="text-xs px-2 py-1 rounded-full border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100">
                            {q}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-xs flex items-center gap-2">
                          <input type="checkbox" checked={isDbQuery} onChange={(e) => setIsDbQuery(e.target.checked)} />
                          <span className="text-xs text-slate-600 dark:text-slate-300">Query DB</span>
                        </label>

                        <div className="text-xs text-slate-500 mr-2 hidden sm:block">{isDbQuery ? "DB mode — server will translate to safe spec" : "Chat mode"}</div>

                        <button
                          onClick={() => send()}
                          disabled={loadingSend || !input.trim()}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${input.trim() ? "bg-emerald-500 text-white hover:opacity-95" : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700/40"}`}
                          aria-label="Send message"
                        >
                          {loadingSend ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          <span className="hidden sm:inline">Gửi</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">Tip: Enter gửi, Shift+Enter xuống dòng. Bật "Query DB" để lấy dữ liệu từ database bằng ngôn ngữ tự nhiên.</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
