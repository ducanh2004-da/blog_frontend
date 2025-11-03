import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'sonner'
export default function Register() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)


  const onChange = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }))


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password || !form.username) return toast.error('Please fill required fields')
    if (form.password !== form.confirm) return toast.error('Passwords do not match')


    try {
      setLoading(true)
      const res = await register('', form.email.trim(), form.username.trim(), '', form.password)
      if (res?.success) {
        toast.success(res.message || 'Registered successfully')
        navigate('/auth/login')
      } else {
        toast.error(res?.message || 'Register failed')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Register error')
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
          <h3 className="text-xl font-bold text-gray-900">Create account</h3>
          <p className="mt-1 text-sm text-gray-500">Start sharing your ideas with the world</p>


          <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-label="Register form">
            <label className="block">
              <span className="text-xs text-gray-600">Full name</span>
              <input
                type="text"
                value={form.username}
                onChange={(e) => onChange('username', e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="Your full name"
                required
              />
            </label>


            <label className="block">
              <span className="text-xs text-gray-600">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => onChange('email', e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="you@domain.com"
                required
              />
            </label>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-gray-600">Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => onChange('password', e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="••••••••"
                  required
                />
              </label>


              <label className="block">
                <span className="text-xs text-gray-600">Confirm</span>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={(e) => onChange('confirm', e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="••••••••"
                  required
                />
              </label>
            </div>


            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="ml-auto inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create account'}
              </button>
            </div>


            <p className="mt-4 text-xs text-gray-500">By creating an account you agree to our <a className="text-indigo-600 underline">Terms</a> and <a className="text-indigo-600 underline">Privacy Policy</a>.</p>
          </form>
        </div>
      </motion.div >
    </main >
  )
}