import React, { useState, useMemo } from 'react';
import { User, Heart, Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * BlogCommentsComponent
 * - Default export React component
 * - Props:
 *    post: { id: number; comments: Comment[] }
 *    onSubmit?: (text: string) => Promise<Comment> | Comment
 *
 * Tailwind is used for styling. This component is self-contained and mocks
 * behavior if onSubmit is not provided.
 */

type Comment = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string; // ISO date
  likes?: number;
};

export default function BlogComments({
  post = { id: '09242', comments: [] as Comment[] },
  onSubmit,
}: {
  post?: { id: string; comments: Comment[] };
  onSubmit?: (text: string) => Promise<Comment> | Comment;
}) {
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const maxChars = 500;

  const commentCount = comments.length;

  const charsLeft = maxChars - text.length;

  const initials = (name: string) =>
    name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    return `${d}d`;
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim() || text.length > maxChars) return;

    setLoading(true);
    // optimistic UI
    const optimistic: Comment = {
      id: `temp-${Date.now()}`,
      authorName: 'You',
      content: text.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setComments((prev) => [optimistic, ...prev]);
    setText('');

    try {
      if (onSubmit) {
        const created = await onSubmit(optimistic.content);
        // replace optimistic
        setComments((prev) => prev.map((c) => (c.id === optimistic.id ? created : c)));
      } else {
        // if no onSubmit provided, simulate server result
        await new Promise((r) => setTimeout(r, 650));
        setComments((prev) => prev.map((c) => (c.id === optimistic.id ? { ...c, id: String(Date.now()) } : c)));
      }
    } catch (err) {
      // rollback
      setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
      alert('Không thể gửi comment — thử lại nhé.');
    } finally {
      setLoading(false);
    }
  }

  function handleLike(id: string) {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, likes: (c.likes || 0) + 1 } : c)));
  }

  const sorted = useMemo(() => comments.slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)), [comments]);

  return (
    <section className="max-w-3xl mx-auto my-8 p-6 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-indigo-50 text-indigo-600 p-2 shadow-sm">
              <MessageSquare size={30} />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-tight">Bình luận</h3>
              <p className="text-sm text-slate-500">Cộng đồng đang thảo luận về bài viết này</p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-slate-600 font-medium">{commentCount} bình luận</div>
          <div className="text-xs text-slate-400">Mới nhất ở trên cùng</div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mb-6">
        <label htmlFor="comment" className="sr-only">Viết bình luận</label>
        <div className="flex gap-3">
          <div className="w-12 flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">{initials('You')}</div>
          </div>
          <div className="flex-1">
            <textarea
              id="comment"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={maxChars}
              rows={3}
              placeholder="Viết bình luận của bạn..."
              className="w-full resize-none rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder-slate-400"
            />

            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <User size={14} /> <span>Đăng nhập để tương tác</span>
                </div>
                <div className="hidden sm:block">·</div>
                <div>{charsLeft} ký tự</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setText('');
                  }}
                  className="px-3 py-1 rounded-md text-sm text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={!text.trim() || loading}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {loading ? 'Đang gửi...' : 'Gửi'} <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="divide-y divide-slate-100">
        <AnimatePresence>
          {sorted.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="py-6 text-center text-slate-500"
            >
              Chưa có bình luận nào — hãy trở thành người đầu tiên!
            </motion.div>
          ) : (
            sorted.map((c) => (
              <motion.article
                key={c.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="py-4 flex gap-4 items-start"
              >
                <div className="w-12 flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 flex items-center justify-center font-semibold text-indigo-800">
                    {initials(c.authorName)}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold">{c.authorName}</h4>
                        <span className="text-xs text-slate-400">· {timeAgo(c.createdAt)}</span>
                      </div>
                      <p className="mt-2 text-slate-700 whitespace-pre-line">{c.content}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => handleLike(c.id)}
                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600"
                        aria-label="Like comment"
                      >
                        <Heart size={16} /> <span>{c.likes || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-6 text-center text-xs text-slate-400">Gợi ý: Giữ lời bình luận lịch sự và tôn trọng cộng đồng.</footer>
    </section>
  );
}
