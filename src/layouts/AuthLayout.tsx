import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <section className="w-full min-h-screen flex items-center justify-center relative overflow-hidden">
        <Outlet />
      </section>
    </div>
  )
}