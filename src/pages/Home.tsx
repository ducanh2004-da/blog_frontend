import React from 'react'
import { AnimatePresence } from 'framer-motion'
import Friend from './../features/home/components/Friend';
import Post from './../features/home/components/Post';
import SpeacialBlog from '@/features/home/components/SpeacialBlog';

type Post = {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
}

const samplePosts: Post[] = [
  {
    id: '1',
    title: "My First Blog Post",
    excerpt:
      "A friendly introduction to my blog: stories, learnings and little experiments I do every week.",
    author: 'Viet Anh',
    date: 'Nov 1, 2025',
    readTime: '4 min'
  },
  {
    id: '2',
    title: 'Understanding React Hooks',
    excerpt: 'Clear, practical guide to useEffect, useMemo and custom hooks for real apps.',
    author: 'Duc Anh',
    date: 'Oct 28, 2025',
    readTime: '7 min'
  },
  {
    id: '3',
    title: 'A Guide to Modern CSS',
    excerpt: 'From utility-first to container queries — modern patterns that actually scale.',
    author: 'Nhat An',
    date: 'Oct 20, 2025',
    readTime: '6 min'
  }
]

export default function Home() {
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
          <button className="md:inline-flex items-center gap-2 rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200">
            New Post
          </button>
        </header>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-15 max-w-full">
          {/* Left: Friends */}
          <Friend />

          {/* Main: Posts */}
          <section className="lg:col-span-6 order-1 lg:order-2">
            <AnimatePresence>
              <Post />
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
