import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { useBlogFeed } from '@/hooks/useBlogFeed';
import Friend from '@/features/home/components/Friend';
import SpeacialBlog from '@/features/home/components/SpeacialBlog';
import BlogForm from '@/features/home/components/BlogForm';
import Post from '@/features/home/components/Post';
import ChatWindow from '@/features/home/components/ChatWindow';

type OutletContextType = { search: string };

/**
 * Home Page - Main blog platform feed
 * 
 * Layout (responsive):
 * - Mobile: Single column (main content only)
 * - Tablet: Two columns (left sidebar + main)
 * - Desktop: Three columns (left sidebar + main + right sidebar)
 *
 * Features:
 * - Blog post feed with search filtering
 * - Left sidebar with friends and tags
 * - Right sidebar with featured posts
 * - Real-time chat window
 * - Smooth animations and transitions
 */
export default function Home() {
  const { search } = useOutletContext<OutletContextType>();
  const { data: posts, isLoading, isError } = useBlogFeed();

  return (
    <>
      {/* Page Header */}
      <header className="mb-6 md:mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Sáng tạo thế giới của riêng bạn
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Chia sẻ ý tưởng, kiến thức và trải nghiệm của bạn với cộng đồng
          </p>
        </div>
        <div className="flex-shrink-0">
          <BlogForm editId={null} />
        </div>
      </header>

      {/* Three-Column Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr_300px] gap-6 md:gap-7 lg:gap-8 auto-rows-max lg:auto-rows-start">
        {/* Left Sidebar: Friends & Tags (Hidden on mobile) */}
        <div className="hidden md:block md:col-span-1 lg:col-span-1">
          <Friend />
        </div>

        {/* Center: Main Feed */}
        <div className="col-span-1">
          <AnimatePresence mode="wait">
            <Post posts={posts} isLoading={isLoading} isError={isError} search={search} />
          </AnimatePresence>

          {/* Pagination */}
          {posts && posts.length > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Load more posts"
              >
                Xem thêm
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar: Featured Posts (Hidden on tablet and below) */}
        <div className="hidden lg:block lg:col-span-1">
          <SpeacialBlog />
        </div>
      </div>

      {/* Chat Window */}
      <ChatWindow />
    </>
  );
}
