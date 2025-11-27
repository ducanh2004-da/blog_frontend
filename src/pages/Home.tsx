import React, {useState} from 'react'
import { AnimatePresence } from 'framer-motion'
import Friend from './../features/home/components/Friend';
import SpeacialBlog from '@/features/home/components/SpeacialBlog';
import BlogForm from '@/features/home/components/BlogForm';
import { blogService } from '@/features/home/service/blog.service';
import { useQuery } from '@tanstack/react-query';
import Post from '@/features/home/components/Post';
import { Blog } from '@/features/home/types/blog.type';
import { useOutletContext } from 'react-router-dom';
import ChatWindow from '@/features/home/components/ChatWindow';
import { Conversation } from '@/features/home/types/chat.types';
import ConversationList from '@/features/home/components/ConversationList';


type OutletContextType = { search: string };

export default function Home() {
  const {search} = useOutletContext<OutletContextType>()

  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Blog[]>({
    queryKey: ['blogs'],
    queryFn: () => blogService.getPosts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8 px-6 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-[1300px]">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              Sáng tạo thế giới của riêng bạn
            </h1>
            <p className="mt-1 text-sm text-gray-500">Lên ý tượng độc đáo cho content bạn nào</p>
          </div>
          <BlogForm editId = {null} />
        </header>

        {/* Layout */}
        {/* important: items-start so sticky children align to top */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Friends */}
          <Friend />

          {/* Main: Posts */}
          <section className="lg:col-span-6 order-1 lg:order-2">
            <AnimatePresence>
              <Post posts = {posts} isLoading = {isLoading} isError = {isError} search={search} />
            </AnimatePresence>

            {/* Right: ConversationList */}
          

            {/* Pagination / load more */}
            <div className="mt-6 flex justify-center">
              <button className="rounded-full border border-gray-200 bg-white px-6 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">Load more</button>
            </div>
          </section>

          {/* Right: Highlights / small list */}
          <SpeacialBlog />
        </div>
      </div>
      <ChatWindow />
    </main>
  )
}
