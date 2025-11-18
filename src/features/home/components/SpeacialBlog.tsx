import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { blogService } from '../service/blog.service';
import { useQuery } from '@tanstack/react-query';
import { Blog } from '../types/blog.type';
import { useNavigate } from 'react-router-dom';

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

  const gradients = [
    'from-yellow-400 to-orange-400',
    'from-green-400 to-teal-400',
    'from-indigo-500 to-purple-500',
    'from-pink-400 to-red-400',
    'from-sky-400 to-indigo-400',
  ];

  const navigate = useNavigate();

  // queries same as before...
  const {
    data: postLike,
    isLoading: isLoadingLike,
    isFetching: isFetchingLike,
  } = useQuery<Blog[]>({
    queryKey: ['postLike'],
    queryFn: () => blogService.getTop5Like(),
    staleTime: 1000 * 60 * 5,
    enabled: !posts,
  });

  const {
    data: postRecent,
    isLoading: isLoadingRecent,
  } = useQuery<Blog[]>({
    queryKey: ['postRecent'],
    queryFn: () => blogService.getTop5Recent(),
    staleTime: 1000 * 60 * 5,
    enabled: !posts,
  });

  const queriesLoading = (posts == null) && (isLoadingLike || isLoadingRecent);

  // helpers...
  const estimateReadTime = (content?: string | null) => {
    if (!content) return undefined;
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const getInitials = (b: Blog) => {
    const name = b.user?.username || b.title || 'U';
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const formatDate = (d?: string | Date | null) => {
    if (!d) return undefined;
    try {
      const dt = typeof d === 'string' ? new Date(d) : d;
      return dt.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return String(d);
    }
  };

  const mapToMiniPosts = (blogs?: Blog[]) => {
    if (!blogs) return [];
    return blogs.map((b, idx) => ({
      id: b.id,
      title: b.title ?? 'Untitled',
      date: formatDate(b.createdAt),
      readTime: estimateReadTime(b.content),
      authorInitials: getInitials(b),
      color: gradients[idx % gradients.length],
    } as MiniPost));
  };

  const highlights = useMemo<MiniPost[]>(() => {
    if (posts?.highlights) return posts.highlights;
    return mapToMiniPosts(postLike ?? []);
  }, [posts?.highlights, postLike]);

  const recent = useMemo<MiniPost[]>(() => {
    if (posts?.recent) return posts.recent;
    return mapToMiniPosts(postRecent ?? []);
  }, [posts?.recent, postRecent]);

  const list = tab === 'highlight' ? highlights : recent;

  return (
    // keep it in grid, add a max width so it doesn't overexpand
    <aside className={`lg:col-span-3 order-3 ${className}`}>
      {/* sticky wrapper with z index so dropdowns are above main content */}
      <div className="sticky top-6 space-y-6 z-20 max-w-[320px]">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          {/* Tab controls */}
          <div
            role="tablist"
            aria-label="Special blog tabs"
            className="flex items-center gap-3 rounded-lg p-1 bg-gradient-to-r from-blue-50 to-white"
            style={{ zIndex: 30 }} // ensure clickable / above other parts when animated
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
                    {t === 'highlight' ? 'Yêu thích' : 'Gần đây'}
                  </span>

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
            {loading || queriesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((s) => (
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
                <AnimatePresence initial={false}>
                  {list.map((p, idx) => {
                    const gradient = p.color ?? gradients[idx % gradients.length];
                    return (
                      <motion.li
                        key={p.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.25, delay: idx * 0.03 }}
                        onClick={() => navigate(`/viewDetail/${p?.id}`)}
                      >
                        <button
                          onClick={() => onOpen?.(p.id)}
                          className="w-full text-left rounded-lg p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 flex items-start gap-3 cursor-pointer"
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
                              {p.date ? `${p.date}${p.readTime ? ` • ${p.readTime}` : ''}` : p.readTime}
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
          <h3 className="text-sm font-semibold text-gray-800">Lọc</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {['All', 'Blog hay', 'ĐA dep trai', 'Mr.Gold'].map((f) => (
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
