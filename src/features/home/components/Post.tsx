import { motion, AnimatePresence } from 'framer-motion'
type Post = {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
}
export default function Post(){
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

    return (
        <div className="space-y-6">
                {samplePosts.map((post, i) => (
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
                            <div className="mt-1 text-sm text-gray-500">{post.excerpt}</div>
                          </div>

                          <div className="hidden md:flex md:flex-col md:items-end md:justify-between">
                            <div className="text-xs text-gray-400">{post.date}</div>
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                              <span>By {post.author}</span>
                              <span>•</span>
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                          <button className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Read more</button>
                          <button className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100">Save</button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
    );
}