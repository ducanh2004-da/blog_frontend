import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'
import { AuthStore, DecodedToken, GoogleUserInfo } from '../types';
import { authService } from '../features/auth/auth.service';
import { toast } from 'sonner';
import { queryClient } from '../configs/query-client.config';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set): AuthStore => ({
      user: null,
      userDetails: null,
      googleInfo: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const loginResult = await authService.login(email, password)
          
          if (loginResult.success) {
            // Token được lưu trong httpOnly cookie, không cần lưu vào state
            // Chỉ decode để lấy thông tin user
            if (loginResult.accessToken) {
              const decoded: DecodedToken = jwtDecode(loginResult.accessToken)
              set({ 
                user: decoded,
                isAuthenticated: true 
              })
            }
            
            toast.success(loginResult.message || 'Login successfully')
            return loginResult
          }
          throw new Error(loginResult.message || 'Login failed')
        } catch (error) {
          set({ isAuthenticated: false })
          throw error
        }
      },

      register: async (address: string, email: string, username: string, phoneNumber: string, password: string) => {
        const registerResult = await authService.register(address, email, password, phoneNumber, username)
        if (registerResult.success) {
          toast.success(registerResult.message || 'Register successfully. Please login.')
          return registerResult
        }
        throw new Error(registerResult.message || 'Registration failed')
      },

      loginWithGoogle: async (idToken: string, googleInfo?: GoogleUserInfo) => {
        try {
          const loginResult = await authService.loginWithGoogle(idToken)
          
          if (loginResult.success) {
            if (loginResult.accessToken) {
              const decoded: DecodedToken = jwtDecode(loginResult.accessToken)
              
              set({ 
                user: decoded,
                googleInfo: googleInfo || null,
                isAuthenticated: true
              })
            }
            
            toast.success(loginResult.message || 'Google login successfully')
            return loginResult
          }
          throw new Error(loginResult.message || 'Google login failed')
        } catch (error) {
          console.error('Google login failed:', error)
          set({ isAuthenticated: false })
          throw error
        }
      },

      logout: async () => {
        try {
          // Gọi API logout để xóa cookie và hashedRefreshToken trong DB
          await authService.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          // Clear state dù logout có thành công hay không
          set({ 
            user: null,
            googleInfo: null,
            userDetails: null,
            isAuthenticated: false
          })
          
          if (queryClient) {
            queryClient.clear()
          }
        }
      },

      getUserInfo: async () => {
        try {
          const userInfo = await authService.getCurrentUser()
          set({ userDetails: userInfo })
          return userInfo
        } catch (error) {
          console.error('Error getting user info:', error)
          throw error
        }
      },

      // Kiểm tra authentication khi app load
      initAuth: async () => {
        try {
          // Gọi một query đơn giản để check xem cookie còn valid không
          const userInfo = await authService.getCurrentUser()
          
          if (userInfo) {
            set({ 
              userDetails: userInfo,
              isAuthenticated: true,
              user: {
                id: userInfo.id,
                email: userInfo.email,
                role: userInfo.role,
                username: userInfo.username
              } as DecodedToken
            })
          }
        } catch (error) {
          // Nếu lỗi, có thể token đã hết hạn hoặc không tồn tại
          set({ 
            user: null,
            userDetails: null,
            isAuthenticated: false 
          })
        }
      },

      setGoogleInfo: (info: GoogleUserInfo) => {
        set({ 
          googleInfo: {
            name: info.name,
            email: info.email,
            picture: info.picture
          } 
        })
      },

      clearGoogleInfo: () => {
        set({ googleInfo: null })
      }
    }),
    {
      name: 'auth-storage',
      // Chỉ persist googleInfo, không persist token
      partialize: (state) => ({ 
        googleInfo: state.googleInfo 
      }),
      storage: createJSONStorage(() => localStorage)
    }
  )
);