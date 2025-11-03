import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className="w-full">
      <header className='flex h-15 justify-between px-10 items-center border-b border-gray-200 bg-white shadow-sm'>
        <div className="search-box max-w-3xl flex">
          <input type="text" placeholder="Search..." className="w-150 p-2 border border-gray-300 rounded-l-md focus:outline-none" />
          <button className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600">Search</button>
        </div>

        <div className="left-side-header flex items-center gap-4">
          <div className="notification">
            <button className="p-2 relative">
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1
              .055-1.595L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>

          <div className="profile-menu">
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <section className="w-full max-w-full min-h-screen relative overflow-hidden py-5">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/35" />
        <div className="absolute inset-0 bg-gradient-to-tl from-emerald-200/35" />
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