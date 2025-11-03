// src/components/SpecialBlog.tsx
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type MiniPost = {
  id: string;
  title: string;
  date?: string;
  readTime?: string;
  authorInitials?: string;
  color?: string; // Tailwind gradient base (e.g. "from-yellow-400 to-orange-400")
};

type Props = {
  posts?: {
    highlights?: MiniPost[];
    recent?: MiniPost[];
  };
  initialTab?: 'highlight' | 'recent';
  loading?: boolean;
  onOpen?: (id: string) => void;
  className?: string;
};

export default function SpecialBlog({
  posts,
  initialTab = 'highlight',
  loading = false,
  onOpen,
  className = '',
}: Props) {
  const [tab, setTab] = useState<'highlight' | 'recent'>(initialTab);

  const list = useMemo(() => {
    if (!posts) return [];
    return tab === 'highlight' ? posts.highlights ?? [] : posts.recent ?? [];
  }, [posts, tab]);

  const gradients = [
    'from-yellow-400 to-orange-400',
    'from-green-400 to-teal-400',
    'from-indigo-500 to-purple-500',
    'from-pink-400 to-red-400',
    'from-sky-400 to-indigo-400',
  ];

  return (
    <aside className={`lg:col-span-3 order-3 ${className}`}>
      <div className="sticky top-6 space-y-6">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          {/* Tab controls */}
          <div
            role="tablist"
            aria-label="Special blog tabs"
            className="flex items-center gap-3 rounded-lg p-1 bg-gradient-to-r from-blue-50 to-white"
          >
            {(['highlight', 'recent'] as const).map((t) => {
              const isActive = tab === t;
              return (
                <button
                  key={t}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setTab(t)}
                  className={`relative flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="capitalize">
                    {t === 'highlight' ? 'Highlight' : 'Recent'}
                  </span>

                  {/* animated indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="tab-active"
                      className="absolute inset-x-0 -bottom-1 h-1 bg-indigo-600 rounded-t-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="mt-3">
            {loading ? (
              // simple skeleton
              <div className="space-y-3">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-3 animate-pulse">
                    <div className="h-10 w-10 rounded-lg bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-3 w-3/4 rounded bg-gray-200 mb-2" />
                      <div className="h-2 w-1/3 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : list.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">
                Không có bài viết nào trong mục này.
              </div>
            ) : (
              <ul className="mt-3 space-y-3">
                <AnimatePresence>
                  {list.map((p, idx) => {
                    const gradient = p.color ?? gradients[idx % gradients.length];
                    return (
                      <motion.li
                        key={p.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.25, delay: idx * 0.03 }}
                      >
                        <button
                          onClick={() => onOpen?.(p.id)}
                          className="w-full text-left rounded-lg p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 flex items-start gap-3"
                        >
                          <div
                            className={`h-10 w-10 flex-shrink-0 rounded-lg text-white flex items-center justify-center font-semibold bg-gradient-to-br ${gradient}`}
                            aria-hidden
                          >
                            {p.authorInitials ?? p.title.split(' ').map((s) => s[0]).slice(0, 2).join('')}
                          </div>

                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{p.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {p.date ? `${p.date} • ${p.readTime ?? ''}` : p.readTime}
                            </div>
                          </div>
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800">Filters</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {['All', 'Frontend', 'Backend', 'Design', 'Tips'].map((f) => (
              <button
                key={f}
                className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
