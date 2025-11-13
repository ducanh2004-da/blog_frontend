import React, { useState } from 'react';
import { commentService } from '../service/comment.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CommentProps, Comment, CommentResponse } from '../types/comment.type';
import sampleAvatar from '../../img/sampleAvatar.png';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { queryClient } from '@/configs/query-client.config';
import { toast } from 'sonner';
import Button from '@mui/material/Button';

export default function BlogComments({ blogId }: CommentProps) {
  // --- Hooks luôn đứng ở đây, trước mọi return điều kiện ---
  const [value, setValue] = useState<string>('');
  const { data: comments, isLoading, isError } = useQuery<CommentResponse>({
    queryKey: ['comments', blogId],
    queryFn: () => commentService.getCommentByBlog(blogId),
    staleTime: 1000 * 60 * 5,
    enabled: !!blogId, // optional: không fetch khi blogId falsy
  });
  const createComment = useMutation({
    mutationFn: ({ content, blogId }: { content: string; blogId: string | null }) =>
      commentService.createPost(content, blogId),
    onSuccess: (data, variables) => {
      // invalidate đúng query key
      queryClient.invalidateQueries({ queryKey: ['comments', blogId] }); 
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success(data?.message ?? 'Comment created');
    },
    onError: (err: any) => {
      console.error('Error creating comment:', err);
      toast.error(err?.message ?? 'Create comment fail');
    },
  });



  // --- xử lý form ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = value.trim();
    if (!content) {
      toast.error('Vui lòng nhập nội dung bình luận');
      return;
    }
    try {
      await createComment.mutateAsync({ content, blogId });
      setValue('');
    } catch (error) {
      console.error('Submit comment failed:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  // --- điều kiện render (không chạm hook nữa) ---
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Đã có lỗi xảy ra khi tải bài viết.</div>;

  return (
    <>
      {comments?.success &&
      comments?.comments.map((comment, idx) => (
        // tốt nhất dùng id nếu có, nếu không thì fallback `${idx}`
        <div key={comment?.id ?? `comment-${idx}`} className="comments flex border rounded-xl p-2 mb-2">
          <div className="avatar mr-3">
            <img
              src={comment?.user?.avatar ?? sampleAvatar}
              alt=""
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <div className="content">
            <div className="name">
              <small className="font-medium">{comment?.user?.username}</small>
              <p className="mt-1">{comment?.content}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="input">
        <Box
          component="form"
          sx={{ mt: 2, width: 500, maxWidth: '100%' }}
          onSubmit={handleSubmit}
          className="flex items-center gap-2"
        >
          <TextField
            fullWidth
            label="Comment"
            id="content"
            name="content"
            value={value}
            onChange={handleInputChange}
            multiline
            minRows={1}
          />
          <Button type="submit" variant="contained">
            Gửi
          </Button>
        </Box>
      </div>
    </>
  );
}
