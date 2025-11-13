// src/features/home/components/Post.tsx
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Blog, PostProps } from '../types/blog.type';
import BlogForm from './BlogForm';
import BlogComments from './BlogComment';

// Helper: tách và highlight keyword trong text (trả về React nodes)
function highlightText(text: string, term: string) {
  if (!term) return text;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex chars
  const parts = text.split(new RegExp(`(${escaped})`, 'ig'));
  return parts.map((part, i) =>
    part.toLowerCase() === term.toLowerCase() ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
  );
}

const PostItem = React.memo(function PostItem({ post, i, search }: { post: Blog; i: number; search: string }) {
  return (
    <motion.article
      key={post.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.45, delay: i * 0.06 }}
      className="overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
      role="article"
      aria-labelledby={`post-${post.id}-title`}
    >
      <div className="md:flex">
        <div className="md:flex-shrink-0 md:w-40 bg-gradient-to-tr from-indigo-600 to-pink-500 p-4 flex items-center justify-center">
          <div className="h-28 w-full max-w-xs overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500/20 to-white/10">
            <svg className="h-full w-full" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <rect width="200" height="120" fill="rgba(255,255,255,0.06)" />
            </svg>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 id={`post-${post.id}-title`} className="text-xl font-semibold text-gray-900">
                {post.title ? highlightText(post.title, search) : '(No title)'}
              </h3>
              <div className="mt-1 text-sm text-gray-500">{post.content}</div>
            </div>

            <div className="hidden md:flex md:flex-col md:items-end md:justify-between">
              <div className="text-xs text-gray-400">{post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <span>By {post.user?.username ?? 'Unknown'}</span>
                <span>•</span>
                <span>{post.user?.role ?? ''}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Read more</button>
            <button className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100">Save</button>
            <BlogForm editId={post.id} />
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-100">
        <BlogComments blogId={post.id} />
      </div>
    </motion.article>
  );
});

export default function Post({
  posts,
  isLoading,
  isError,
  search = '',
}: PostProps & { search?: string }) {
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Đã có lỗi xảy ra khi tải bài viết.</div>;

  const [q, setQ] = useState<string>(search ?? '');

  useEffect(() => {
    // only update when search is defined and actually changed
    setQ(prev => {
      const newVal = search ?? '';
      return prev === newVal ? prev : newVal;
    });
  }, [search]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
  }, []);

  const filtered = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    const term = (q ?? '').trim().toLowerCase();
    if (!term) return posts;

    return posts.filter((p) => {
      const title = (p.title ?? '').toLowerCase();
      const content = (p.content ?? '').toLowerCase();
      return title.includes(term) || content.includes(term);
    });
  }, [posts, q]);

  return (
    <div className="space-y-6">
      {filtered.length === 0 ? (
        <div className="p-4 text-gray-500">Không tìm thấy bài viết.</div>
      ) : (
        filtered.map((post, i) => <PostItem key={post.id} i={i} post={post} search={q} />)
      )}
    </div>
  );
}
