import axios from 'axios'
import { useAuthStore } from '../stores/auth.store'

const apiConfig = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CRITICAL: Cho phép gửi cookies
})

// Request interceptor - Không cần thêm token vào header nữa vì dùng httpOnly cookies
apiConfig.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Xử lý token hết hạn và tự động refresh
apiConfig.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response) {
      const { status } = error.response
      
      // Nếu access token hết hạn (401) và chưa retry
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // Gọi mutation refresh để lấy token mới
          const refreshResponse = await axios.post(
            import.meta.env.VITE_API_BACKEND_URL,
            {
              query: `
                mutation Refresh {
                  refresh {
                    success
                    message
                  }
                }
              `
            },
            {
              withCredentials: true, // Gửi refresh token cookie
            }
          )

          if (refreshResponse.data.data.refresh.success) {
            // Retry request ban đầu với cookie mới
            return apiConfig(originalRequest)
          }
        } catch (refreshError) {
          // Refresh thất bại -> logout
          const { logout } = useAuthStore.getState()
          logout()
          window.location.href = '/auth/login'
          return Promise.reject(refreshError)
        }
      }

      // Nếu vẫn 401 sau khi refresh hoặc lỗi khác
      if (status === 401) {
        const { logout } = useAuthStore.getState()
        logout()
        window.location.href = '/auth/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiConfig