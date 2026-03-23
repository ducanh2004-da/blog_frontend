import { Blog } from "@/features/home/types/blog.type";
export const STATIC_POSTS: Blog[] = [
  {
    id: '031dc522-a9b2-40dc-abaf-7ca2fc465e0f',
    title: 'Bạn không có tiền đi học thì sao?',
    content: 'Mở đề của Thùy Minh là: đi chợ cùng một gia đình ở Cần Thơ, mua 5 cân thịt và họ nấu hết số thịt đó một lần, nên mệnh đề để cho chương trình cùng tìm hiểu là...',
    createdAt: new Date().toISOString(),
    user: { id: 'cb414fd4-46d2-4818-bf1b-c8013f72e334', username: 'Do Duc Anh' }
  } as Blog,
  {
    id: '685f8050-468b-46d3-a392-82ebca5b1de6',
    title: 'VÌ SAO NHIỀU NGƯỜI VẪN ÔM CỔ DÀI, BẤT CHẤP THỊ TRƯỜNG LIÊN TỤC CÓ SÓNG?',
    content: 'Thị trường chứng khoán vận hành theo chu kỳ rất rõ: cứ sau mỗi nhịp điều chỉnh, lại xuất hiện một đợt sóng tăng mới...',
    createdAt: new Date().toISOString(),
    user: { id: 'cb414fd4-46d2-4818-bf1b-c8013f72e334', username: 'Do Duc Anh' }
  } as Blog
];