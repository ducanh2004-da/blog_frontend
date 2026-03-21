import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ở production, người dùng chuyển sang tab khác rồi quay lại nếu data đã cũ (stale) thì React Query sẽ tự động gọi lại query để lấy dữ liệu mới
      refetchOnWindowFocus: import.meta.env.PROD,
      // khi component mount lại, nếu data đã cũ (stale) thì React Query sẽ tự động gọi lại query để lấy dữ liệu mới
      refetchOnMount: true,
      // nếu trình duyệt vừa mất mạng rồi có mạng lại, query sẽ tự refetch
      refetchOnReconnect: true,
      // Chỉ retry 3 lần nếu lỗi KHÔNG phải là lỗi từ phía Client (4xx)
      retry: (failureCount, error) => {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          // Không retry nếu là các lỗi xác thực, không tìm thấy, hoặc lỗi input
          if (status && status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      // Sau 5 phút thì data sẽ được coi là cũ (stale) và sẽ tự động refetch khi người dùng tương tác lại với trang
      staleTime: 5 * 60 * 1000
    },
    mutations: {
      // Set retry attempts for failed mutations
      retry: 2,
      // Use 'always' network mode for mutations to ensure they are sent even when offline
      networkMode: 'always'
    }
  }
})