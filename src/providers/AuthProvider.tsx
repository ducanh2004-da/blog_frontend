import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/auth.store'
import { Loading } from '../components'

// Tự viết để Quản lý authentication state (người dùng có đăng nhập chưa, token, profile…), người ch và người có sẽ làm gì
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initAuth = useAuthStore(state => state.initAuth)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  useEffect(() => {
    initAuth()
      .catch(() => {
        // lỗi thì vẫn cho qua (người dùng chưa auth)
      })
      .finally(() => setIsInitialized(true));
  }, [initAuth]);

  if (!isInitialized) return <Loading />

  return <>{children}</>
}
