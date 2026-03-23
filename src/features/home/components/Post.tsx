// src/features/home/components/Post.tsx
import React, { useMemo, useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Blog, PostProps } from "../types/blog.type";
import BlogForm from "./BlogForm";
import BlogComments from "./BlogComment";
import BlogLikes from "./BlogLike";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigate } from "react-router-dom";
import { useEstimateReadTime } from "@/hooks/useBlogFeed";
import { STATIC_POSTS } from "@/mocks/post";

/**
 * Utility to highlight search terms in text
 */

const highlightText = (text: string, term: string) => {
  if (!term) return <>{text}</>;
  const escaped = term.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  const parts = text.split(new RegExp(`(${escaped})`, 'iu'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark key={`highlight-${i}-${part}`} className="bg-yellow-200 font-medium">
            {part}
          </mark>
        ) : (
          <span key={`text-${i}-${part}`}>{part}</span>
        )
      )}
    </>
  );
};

/**
 * PostImage - Lazy-loaded post image with fallback
 */
const PostImage = memo(function PostImage({ alt, src }: { alt: string; src: string }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="md:flex-shrink-0 md:w-40 h-40 md:h-auto bg-gray-100 flex items-center justify-center overflow-hidden">
      {imageError ? (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-200 to-gray-300">
          <span className="text-gray-500 text-sm">No image</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
});

/**
 * PostMetadata - Author and date information
 */
const PostMetadata = memo(function PostMetadata({
  author,
  date,
  readTime,
}: {
  author: string;
  date: string;
  readTime?: string;
}) {
  return (
    <div className="flex flex-col gap-1 text-xs text-gray-500">
      <time dateTime={new Date(date).toISOString()}>{new Date(date).toLocaleDateString()}</time>
      <div className="flex items-center gap-2">
        <span>By {author}</span>
        {readTime && <span className="text-gray-400">•</span>}
        {readTime && <span>{readTime}</span>}
      </div>
    </div>
  );
});

/**
 * PostContent - Title and excerpt with search term highlighting
 */
const PostContent = memo(function PostContent({
  title,
  content,
  search,
  postId,
}: {
  title: string;
  content: string;
  search: string;
  postId: string;
}) {
  return (
    <div className="flex-1">
      <h3
        id={`post-${postId}-title`}
        className="text-base md:text-lg font-semibold text-gray-900 leading-tight"
      >
        {title ? highlightText(title, search) : '(Không tiêu đề)'}
      </h3>
      <p
        className="mt-2 text-sm text-gray-600 line-clamp-3"
        role="doc-subtitle"
      >
        {content}
      </p>
    </div>
  );
});

/**
 * PostActions - Like, Save, Edit buttons
 */
const PostActions = memo(function PostActions({
  postId,
  canEdit,
  isAuthor,
}: {
  postId: string;
  canEdit: boolean;
  isAuthor: boolean;
}) {
  const navigate = useNavigate();

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button
        onClick={() => navigate(`/viewDetail/${postId}`)}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="Read full article"
      >
        Đọc bài viết
      </button>

      <button
        className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="Save this article"
      >
        Lưu
      </button>

      {isAuthor && canEdit && (
        <BlogForm editId={postId} />
      )}

      <BlogLikes blogId={postId} currentUserId={undefined} />
    </div>
  );
});

/**
 * PostItem - Individual post card component
 * Memoized to prevent unnecessary re-renders
 */
const PostItem = memo(
  function PostItem({
    post,
    index,
    search,
  }: {
    post: Blog;
    index: number;
    search: string;
  }) {
    const { user: authUser } = useAuthStore();
    const readTime = useEstimateReadTime(post.content);
    const isAuthor = authUser?.id === post.user?.id;

    return (
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
        role="article"
        aria-labelledby={`post-${post.id}-title`}
      >
        {/* Main content */}
        <div className="flex flex-col md:flex-row">
          <PostImage
            alt={post.title ?? 'Post image'}
            src="https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg"
          />

          <div className="flex-1 p-4 md:p-6 flex flex-col">
            <div className="flex-1">
              <PostContent
                title={post?.title ?? ''}
                content={post?.content ?? ''}
                search={search}
                postId={post.id}
              />
            </div>

            {/* Metadata and actions */}
            <div className="mt-4 space-y-3">
              {post.createdAt && post.user && (
                <PostMetadata
                  author={post.user?.username ?? 'Unknown'}
                  date={post.createdAt}
                  readTime={readTime}
                />
              )}
              <PostActions
                postId={post.id}
                canEdit={isAuthor}
                isAuthor={isAuthor}
              />
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="border-t border-gray-100 px-4 md:px-6 py-4">
          <BlogComments blogId={post.id} />
        </div>
      </motion.article>
    );
  },
  (prev, next) => {
    // Custom comparison to check if props have actually changed
    return (
      prev.post.id === next.post.id &&
      prev.search === next.search &&
      prev.index === next.index
    );
  }
);

/**
 * LoadingState - Skeleton loading state
 */
const LoadingState = () => (
  <div className="space-y-6" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100}>
    {[1, 2].map((i) => (
      <div
        key={i}
        className="h-48 rounded-2xl bg-gray-200 animate-pulse border border-gray-100"
      />
    ))}
  </div>
);

/**
 * EmptyState - No posts found message
 */
const EmptyState = ({ hasSearch }: { hasSearch: boolean }) => (
  <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
    <p className="text-gray-600">
      {hasSearch ? 'Không tìm thấy bài viết phù hợp.' : 'Chưa có bài viết nào.'}
    </p>
  </div>
);

/**
 * Post Component - Main feed component displaying list of blog posts
 * Features:
 * - Responsive design (mobile, tablet, desktop)
 * - Search term filtering and highlighting
 * - Lazy image loading
 * - Memoized sub-components for performance
 * - Accessibility support (ARIA labels, semantic HTML)
 */
export default function Post({
  posts,
  isLoading,
  isError,
  search = '',
}: PostProps & { search?: string }) {
  const [searchTerm, setSearchTerm] = useState<string>(search ?? '');

  useEffect(() => {
    setSearchTerm((prev) => {
      const newSearchTerm = search ?? '';
      return prev === newSearchTerm ? prev : newSearchTerm;
    });
  }, [search]);

  const filteredPosts = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    const term = (searchTerm ?? '').trim().toLowerCase();
    if (!term) return posts;

    return posts.filter((p) => {
      const title = (p.title ?? '').toLowerCase();
      const content = (p.content ?? '').toLowerCase();
      const author = (p.user?.username ?? '').toLowerCase();
      return title.includes(term) || content.includes(term) || author.includes(term);
    });
  }, [posts, searchTerm]);

  if (isLoading) {
    return (
      <div className="space-y-6" role="feed" aria-busy={true}>
        {/* Render bài viết tĩnh có sẵn */}
        <div className="space-y-6 mb-6">
          {STATIC_POSTS.map((post, i) => (
            <PostItem key={post.id} index={i} post={post} search="" />
          ))}
        </div>
        {/* Render Skeleton nhấp nháy báo hiệu đang tải thêm */}
        <LoadingState />
      </div>
    );
  }
  if (isError)
    return (
      <div
        className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
        role="alert"
      >
        Đã có lỗi xảy ra khi tải bài viết. Vui lòng thử lại.
      </div>
    );

  return (
    <div className="space-y-6" role="feed" aria-label="Blog feed">
      {filteredPosts.length === 0 ? (
        <EmptyState hasSearch={searchTerm.length > 0} />
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post, i) => (
            <PostItem key={post.id} index={i} post={post} search={searchTerm} />
          ))}
        </div>
      )}
    </div>
  );
}
