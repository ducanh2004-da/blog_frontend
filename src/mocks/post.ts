import { Blog } from "@/features/home/types/blog.type";
export const STATIC_POSTS: Blog[] = [
  {
    id: 'a4a5b1ec-62c3-4ee2-981c-97e27fdc3595',
    title: 'Xu hướng Web Development năm nay',
    content: 'Cùng tìm hiểu về các công nghệ nổi bật như React 19, NextJS và cách tối ưu hóa hiệu suất ứng dụng web...',
    createdAt: new Date().toISOString(),
    user: { id: 'admin', username: 'Learnify Team' }
  } as Blog,
  {
    id: 'b5f4c8d7-9a1e-5bf3-871d-46e58d2c9874',
    title: 'Kinh nghiệm tự học Lập trình hiệu quả',
    content: 'Hành trình từ con số 0 đến khi nắm vững kiến trúc backend với NestJS và Render...',
    createdAt: new Date().toISOString(),
    user: { id: 'admin', username: 'Do Duc Anh' }
  } as Blog
];