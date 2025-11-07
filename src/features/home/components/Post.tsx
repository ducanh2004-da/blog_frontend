import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { blogService } from '../service/blog.service';
import BlogComments from './BlogComment';
import { Blog, PostProps } from '../types/blog.type';
import BlogForm from './BlogForm';

export default function Post({
  posts,
  isLoading,
  isError,
}: PostProps) {

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Đã có lỗi xảy ra khi tải bài viết.</div>;

  return (
    <div className="space-y-6">
      {posts?.map((post: any, i: any) => (
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
                {/* Decorative image block (replace with <img /> if you have images) */}
                <svg className="h-full w-full" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <rect width="200" height="120" fill="rgba(255,255,255,0.06)" />
                </svg>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 id={`post-${post.id}-title`} className="text-xl font-semibold text-gray-900">{post.title}</h3>
                  <div className="mt-1 text-sm text-gray-500">{post.content}</div>
                </div>

                <div className="hidden md:flex md:flex-col md:items-end md:justify-between">
                  <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <span>By {post.user.username}</span>
                    <span>•</span>
                    <span>{post.user.role}</span>
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

          {/* Comments UI inserted here */}
          <div className="p-6 border-t border-slate-100">
            <BlogComments
              post={{
                id: String(post.id) || post.id,
                comments: (post.comments || []).map((c: any) => ({
                  id: c.id,
                  authorName: 'Khách', // nếu API không trả author, hiển thị placeholder
                  content: c.content,
                  createdAt: c.createdAt,
                  likes: 0,
                })),
              }}
              onSubmit={async (text: any) => {
                // Thử gọi API của bạn; nếu không có, fallback về mock
                try {
                  // tuỳ implement: blogService.addComment || blogService.createComment
                  const svc: any = blogService as any;
                  if (typeof svc.addComment === 'function') {
                    const res = await svc.addComment(post.id, { content: text });
                    return {
                      id: res.id ?? `${Date.now()}`,
                      authorName: res.user?.username ?? 'Bạn',
                      content: res.content,
                      createdAt: res.createdAt ?? new Date().toISOString(),
                      likes: res.likes ?? 0,
                    };
                  }

                  if (typeof svc.createComment === 'function') {
                    const res = await svc.createComment(post.id, { content: text });
                    return {
                      id: res.id ?? `${Date.now()}`,
                      authorName: res.user?.username ?? 'Bạn',
                      content: res.content,
                      createdAt: res.createdAt ?? new Date().toISOString(),
                      likes: res.likes ?? 0,
                    };
                  }

                  // fallback: simulate server created comment
                  await new Promise((r) => setTimeout(r, 600));
                  return {
                    id: `${Date.now()}`,
                    authorName: 'Bạn',
                    content: text,
                    createdAt: new Date().toISOString(),
                    likes: 0,
                  };
                } catch (err) {
                  console.error('Failed to submit comment', err);
                  throw err;
                }
              }}
            />
          </div>

        </motion.article>
      ))}
    </div>
  );
}
