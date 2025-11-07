// src/layouts/MainLayout.tsx
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

export default function MainLayout() {
  const user = useAuthStore(s => s.userDetails)
  const logout = useAuthStore(s => s.logout)
  const navigate = useNavigate()

  return (
    <div className="w-full">
      <header className='flex h-15 justify-between px-6 items-center border-b border-gray-200 bg-white shadow-sm'>
        <div className="search-box max-w-3xl flex">
          <input type="text" placeholder="Search..." className="w-150 p-2 border border-gray-300 rounded-l-md focus:outline-none" />
          <button className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600">Search</button>
        </div>

        <div className="left-side-header flex items-center gap-4">
          <div className="notification">
            <button className="p-2 relative">...</button>
          </div>

          <div className="profile-menu flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <img src={user.avatar ?? '/default-avatar.png'} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-700">{user.username ?? user.email}</span>
                    <span className="text-xs text-gray-400">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/auth/login');
                  }}
                  className="px-3 py-1 text-sm rounded bg-red-50 text-red-600 border border-red-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => navigate('/auth/login')} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">Sign in</button>
            )}
          </div>
        </div>
      </header>

      <section className="w-full max-w-full min-h-screen relative overflow-hidden py-5">
        <Outlet />
      </section>

      <footer>
        <div className="w-full p-4 text-center text-gray-500">
          &copy; {new Date().getFullYear()} BlogPlatform. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
