import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/auth.store'
import { Loading } from '../components'

// Tự viết để Quản lý authentication state (người dùng có đăng nhập chưa, token, profile…), người ch và người có sẽ làm gì
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initAuth = useAuthStore(state => state.initAuth)

  useEffect(() => {
    // Gọi ngầm chạy background, không block UI nữa
    initAuth()
  }, [initAuth]);

  return <>{children}</>
}
