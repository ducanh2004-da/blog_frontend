import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'sonner'


export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Please fill email and password')
    try {
      setLoading(true)
      const result = await login(email.trim(), password)
      if (result?.success) {
        toast.success(result.message || 'Welcome back!')
        navigate('/')
      } else {
        toast.error(result?.message || 'Login failed')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Login error')
    } finally {
      setLoading(false)
    }
  }


  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-white"
      >
        {/* Left decorative panel */}
        <div className="hidden md:flex flex-col justify-center items-start gap-6 p-8 bg-gradient-to-br from-indigo-600 to-pink-500 text-white">
          <h2 className="text-3xl font-extrabold">Welcome back</h2>
          <p className="opacity-90 max-w-xs text-sm">
            Sign in to continue writing, saving drafts and sharing your ideas with the world.
          </p>


          <div className="mt-4 w-full">
            <div className="rounded-lg bg-white/10 p-3 text-xs">No account? <Link to="/auth/register" className="font-semibold underline">Create one</Link></div>
          </div>
        </div>


        {/* Right: form */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-900">Sign in</h3>
          <p className="mt-1 text-sm text-gray-500">Enter your credentials to access your dashboard</p>


          <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-label="Login form">
            <label className="block">
              <span className="text-xs text-gray-600">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="you@domain.com"
                required
              />
            </label>


            <label className="block">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Password</span>
                <Link to="/auth/forgot" className="text-xs text-indigo-600 hover:underline">Forgot?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="••••••••"
                required
              />
            </label>


            <div className="flex items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>


              <button
                type="submit"
                disabled={loading}
                className="ml-auto inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>


            <div className="pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-400">Or continue with</span>
                </div>
              </div>


              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => toast('Social auth not set up in this demo')}
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm bg-white hover:bg-gray-50"
                >
                  Google
                </button>
                <button type="button" className="rounded-md border border-gray-200 px-3 py-2 text-sm bg-white hover:bg-gray-50">GitHub</button>
              </div>
            </div>


            <p className="mt-4 text-xs text-gray-500">
              Don’t have an account? <Link to="/auth/register" className="text-indigo-600 font-medium">Create one</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </main>
  )
}