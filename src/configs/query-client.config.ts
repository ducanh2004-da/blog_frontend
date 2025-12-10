import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ở production, người dùng chuyển sang tab khác rồi quay lại nếu data đã cũ (stale) thì React Query sẽ tự động gọi lại query để lấy dữ liệu mới
      refetchOnWindowFocus: import.meta.env.PROD,
      // tránh khi component mount (gắn vào DOM) thì tự động refetch ngay cả khi có cache => giảm số request không cần thiết
      refetchOnMount: false,
      // nếu trình duyệt vừa mất mạng rồi có mạng lại, query sẽ tự refetch
      refetchOnReconnect: true,
      // nếu request thất bại thì sẽ gửi 3 lần để chắc chắn
      retry: 3,
      // nếu sau 5 phút ko phản hồi thì báo lỗi
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