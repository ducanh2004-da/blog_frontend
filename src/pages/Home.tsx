import React from 'react'
import { AnimatePresence } from 'framer-motion'
import Friend from './../features/home/components/Friend';
import SpeacialBlog from '@/features/home/components/SpeacialBlog';
import BlogForm from '@/features/home/components/BlogForm';
import { blogService } from '@/features/home/service/blog.service';
import { useQuery } from '@tanstack/react-query';
import Post from '@/features/home/components/Post';
import { Blog } from '@/features/home/types/blog.type';
import { useOutletContext } from 'react-router-dom';

type OutletContextType = { search: string };

export default function Home() {
  const {search} = useOutletContext<OutletContextType>()

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Blog[]>({
    queryKey: ['posts'],
    queryFn: () => blogService.getPosts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8 px-10 sm:px-6 lg:px-12">
      <div className="mx-auto">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              Duc Anh's Blog
            </h1>
            <p className="mt-1 text-sm text-gray-500">Thoughts on web, code, design & life.</p>
          </div>
              <BlogForm editId = {null} />
        </header>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-15 max-w-full">
          {/* Left: Friends */}
          <Friend />

          {/* Main: Posts */}
          <section className="lg:col-span-6 order-1 lg:order-2">
            <AnimatePresence>
              <Post posts = {posts} isLoading = {isLoading} isError = {isError} search={search} />
            </AnimatePresence>

            {/* Pagination / load more */}
            <div className="mt-6 flex justify-center">
              <button className="rounded-full border border-gray-200 bg-white px-6 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">Load more</button>
            </div>
          </section>

          {/* Right: Highlights / small list */}
          <SpeacialBlog />
        </div>
      </div>
    </main>
  )
}
