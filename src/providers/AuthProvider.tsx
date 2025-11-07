import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/auth.store'
import { Loading } from '../components'

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
