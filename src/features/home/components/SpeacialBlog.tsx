import React, { useMemo, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTopLikedBlogs, useRecentBlogs, useEstimateReadTime } from '@/hooks/useBlogFeed';
import { Blog } from '../types/blog.type';
import { Card } from '@/components/common/Card';

type TabType = 'highlight' | 'recent';

interface MiniPost {
  id: string;
  title: string;
  date?: string;
  readTime?: string;
  authorInitials: string;
  color: string;
}

// Gradient colors for avatar backgrounds
const GRADIENT_COLORS = [
  'from-yellow-400 to-orange-400',
  'from-green-400 to-teal-400',
  'from-indigo-500 to-purple-500',
  'from-pink-400 to-red-400',
  'from-sky-400 to-indigo-400',
];

/**
 * TabButton - Individual tab in tab list
 */
const TabButton = memo(function TabButton({
  isActive,
  label,
  onClick,
}: {
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={`relative flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isActive
          ? 'bg-indigo-600 text-white shadow-md focus:ring-indigo-500'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-indigo-500'
      }`}
    >
      {label}
      {isActive && (
        <motion.span
          layoutId="tab-underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full"
          initial={false}
        />
      )}
    </button>
  );
});

/**
 * PostItem - Individual featured post item
 */
const PostItem = memo(function PostItem({
  post,
  index,
}: {
  post: MiniPost;
  index: number;
}) {
  const navigate = useNavigate();

  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      <button
        onClick={() => navigate(`/viewDetail/${post.id}`)}
        className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left transition-all hover:border-indigo-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label={`Read ${post.title}`}
      >
        <div className="flex items-start gap-3">
          {/* Avatar with gradient */}
          <div
            className={`h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br ${post.color} flex items-center justify-center text-sm font-bold text-white shadow`}
            aria-hidden="true"
          >
            {post.authorInitials}
          </div>

          {/* Post info */}
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
              {post.title}
            </h4>
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              {post.date && <time>{post.date}</time>}
              {post.date && post.readTime && <span>•</span>}
              {post.readTime && <span>{post.readTime}</span>}
            </div>
          </div>
        </div>
      </button>
    </motion.li>
  );
});

/**
 * TabContent - Content area for tab
 */
const TabContent = memo(function TabContent({
  posts,
  isLoading,
}: {
  posts: MiniPost[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading posts">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 rounded bg-gray-200" />
              <div className="h-2 w-1/2 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-gray-500">Chưa có bài viết nào trong mục này.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3" role="list">
      <AnimatePresence mode="wait">
        {posts.map((post, i) => (
          <PostItem key={post.id} post={post} index={i} />
        ))}
      </AnimatePresence>
    </ul>
  );
});

/**
 * Utility functions
 */
const getAuthorInitials = (blog: Blog): string => {
  const name = blog.user?.username || blog.title || 'U';
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const formatDate = (dateStr?: string | null): string | undefined => {
  if (!dateStr) return undefined;
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return undefined;
  }
};

const mapToMiniPosts = (blogs: Blog[] | undefined, colors: string[]): MiniPost[] => {
  if (!blogs) return [];
  return blogs.map((blog, idx) => ({
    id: blog.id,
    title: blog.title ?? 'Untitled',
    date: formatDate(blog.createdAt),
    readTime: `${Math.max(1, Math.ceil((blog.content?.split(/\s+/).length || 0) / 200))} min read`,
    authorInitials: getAuthorInitials(blog),
    color: colors[idx % colors.length],
  }));
};

/**
 * SpecialBlog Component
 * Right sidebar showing featured and recent posts with tab switching
 * 
 * Features:
 * - Tab switching between favorites and recent posts
 * - Gradient badges for visual appeal
 * - Responsive design (hidden on mobile)
 * - Accessibility support (ARIA labels, semantic HTML)
 * - Memoized sub-components for performance
 */
export default function SpecialBlog() {
  const [activeTab, setActiveTab] = useState<TabType>('highlight');

  // Fetch top liked (featured) posts
  const { data: featuredPosts, isLoading: isLoadingFeatured } = useTopLikedBlogs();

  // Fetch recent posts
  const { data: recentPosts, isLoading: isLoadingRecent } = useRecentBlogs();

  // Convert blogs to mini posts
  const highlightMiniPosts = useMemo(
    () => mapToMiniPosts(featuredPosts, GRADIENT_COLORS),
    [featuredPosts]
  );

  const recentMiniPosts = useMemo(
    () => mapToMiniPosts(recentPosts, GRADIENT_COLORS),
    [recentPosts]
  );

  const currentPosts = activeTab === 'highlight' ? highlightMiniPosts : recentMiniPosts;
  const isLoading = activeTab === 'highlight' ? isLoadingFeatured : isLoadingRecent;

  return (
    <aside className="space-y-5" role="complementary" aria-label="Featured and recent posts">
      <div className="sticky top-24 space-y-5 z-20">
        {/* Featured Posts Card */}
        <Card variant="default" padding="md">
          {/* Tab controls */}
          <div
            role="tablist"
            aria-label="Post section tabs"
            className="mb-4 flex gap-2"
          >
            <TabButton
              isActive={activeTab === 'highlight'}
              label="Yêu thích"
              onClick={() => setActiveTab('highlight')}
            />
            <TabButton
              isActive={activeTab === 'recent'}
              label="Gần đây"
              onClick={() => setActiveTab('recent')}
            />
          </div>

          {/* Tab Content */}
          <TabContent posts={currentPosts} isLoading={isLoading} />
        </Card>

        {/* Filters Card */}
        <Card variant="default" padding="md">
          <h3 className="mb-3 text-sm font-semibold text-gray-800">Danh mục</h3>
          <div className="flex flex-wrap gap-2">
            {['Tất cả', 'Phổ biến', 'Mới', 'Được lưu'].map((category) => (
              <button
                key={category}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`Filter by ${category}`}
              >
                {category}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </aside>
  );
}
