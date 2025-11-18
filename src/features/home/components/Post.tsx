// src/features/home/components/Post.tsx
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Blog, PostProps } from "../types/blog.type";
import BlogForm from "./BlogForm";
import BlogComments from "./BlogComment";
import BlogLikes from "./BlogLike";
import { useAuthStore } from "@/stores/auth.store";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function highlightText(text: string, term: string) {
  if (!term) return <>{text}</>;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
      )}
    </>
  );
}

const PostItem = React.memo(function PostItem({
  post,
  i,
  search,
}: {
  post: Blog;
  i: number;
  search: string;
}) {
  const { user: authUser } = useAuthStore();
  const navigate = useNavigate();

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
        <div className="md:flex-shrink-0 md:w-40 p-4 flex items-center justify-center">
          <img src="https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg" alt={post.title ?? "Post image"} loading="lazy" />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 id={`post-${post?.id}-title`} className="text-xl font-semibold text-gray-900">
                {post?.title ? highlightText(post?.title, search) : "(Không tiêu đề)"}
              </h3>
              <div
                className="mt-1 w-9/12 text-sm text-gray-500"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post?.content}
              </div>
            </div>

            <div className="hidden md:flex md:flex-col md:items-end md:justify-between">
              <div className="text-xs text-gray-400">{post?.createdAt ? new Date(post?.createdAt).toLocaleString() : ""}</div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <span>Bởi {post?.user?.username ?? "Unknown"}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button variant="contained" size="small" onClick={() => navigate(`/viewDetail/${post?.id}`)}>
              Đọc bài viết
            </Button>

            <button type="button" className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100">
              Lưu
            </button>

            <BlogForm editId={post.id} />

            <BlogLikes blogId={post.id} currentUserId={authUser?.id} />
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-100">
        <BlogComments blogId={post.id} />
      </div>
    </motion.article>
  );
});

export default function Post({ posts, isLoading, isError, search = "" }: PostProps & { search?: string }) {
  const [q, setQ] = useState<string>(search ?? "");

  useEffect(() => {
    setQ((prev) => {
      const newVal = search ?? "";
      return prev === newVal ? prev : newVal;
    });
  }, [search]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
  }, []);

  const filtered = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    const term = (q ?? "").trim().toLowerCase();
    if (!term) return posts;

    return posts.filter((p) => {
      const title = (p.title ?? "").toLowerCase();
      const content = (p.content ?? "").toLowerCase();
      return title.includes(term) || content.includes(term);
    });
  }, [posts, q]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Đã có lỗi xảy ra khi tải bài viết.</div>;

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
