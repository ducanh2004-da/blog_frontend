// src/features/home/components/BlogComment.tsx
import React, { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { commentService } from "../service/comment.service";
import { CommentProps, Comment, CommentResponse } from "../types/comment.type";
import sampleAvatar from "../../img/sampleAvatar.png";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";

import { queryClient } from "@/configs/query-client.config";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";

// helper: hiển thị relative time (nhỏ gọn)
function timeAgo(dateStr?: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export default function BlogComments({ blogId }: CommentProps) {
  const [value, setValue] = useState<string>("");
  const [charCount, setCharCount] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { user: authUser } = useAuthStore();
  const authState = useAuthStore.getState();

  // fetch comments
  const {
    data: commentsResp,
    isLoading,
    isError,
  } = useQuery<CommentResponse>({
    queryKey: ["comments", blogId],
    queryFn: () => commentService.getCommentByBlog(blogId),
    staleTime: 1000 * 60 * 5,
    enabled: !!blogId,
  });

  // mutation with optimistic update
  const createComment = useMutation({
    mutationFn: ({
      content,
      blogId,
    }: {
      content: string;
      blogId: string | null | undefined;
    }) => commentService.createPost(content, blogId),
    onMutate: async ({ content, blogId: bId }) => {
      // cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", bId] });
      // snapshot previous
      const previous = queryClient.getQueryData<CommentResponse>([
        "comments",
        bId,
      ]);

      // create optimistic comment
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        user: {
          id: authUser?.id ?? "me",
          username: authUser?.username ?? "You",
          avatar: sampleAvatar,
        } as any,
      } as any;

      // set optimistic data
      queryClient.setQueryData<CommentResponse>(["comments", bId], (old) => {
        if (!old) {
          return {
            success: true,
            comments: [optimisticComment],
          } as CommentResponse;
        }
        return {
          ...old,
          comments: [optimisticComment, ...old.comments],
        } as CommentResponse;
      });

      // return context to rollback
      return { previous };
    },
    onError: (err: any, variables, context: any) => {
      // rollback
      if (context?.previous) {
        queryClient.setQueryData(
          ["comments", variables.blogId],
          context.previous
        );
      }
      console.error("Error creating comment:", err);
      toast.error(err?.message ?? "Create comment failed");
    },
    onSettled: (_data, _err, variables) => {
      // refetch to sync with server canonical data
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.blogId],
      });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Comment created");
      // scroll to top of comments (new comment)
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = value.trim();
    if (!content) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }
    try {
      const currentUserId = authState.user?.id ?? authState.userDetails?.id;
      if (!currentUserId) {
        toast.error('Bạn chưa đăng nhập');
        return;
      }
      await createComment.mutateAsync({ content, blogId });
      setValue("");
      setCharCount(0);
      // focus back to input
      inputRef.current?.focus();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);
    setCharCount(e.target.value.length);
  };

  // render states
  if (isLoading) {
    return (
      <Paper elevation={0} sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Skeleton
            variant="rectangular"
            height={40}
            sx={{ borderRadius: 2 }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="text" width="60%" />
          </Stack>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="50%" />
        </Stack>
      </Paper>
    );
  }

  if (isError) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="error">
          Đã có lỗi xảy ra khi tải bình luận.
        </Typography>
      </Paper>
    );
  }

  const comments = commentsResp?.comments ?? [];

  return (
    <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
      <Box ref={scrollRef} sx={{ mb: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          <Typography variant="h6">Thảo luận</Typography>
          <Chip
            label={`${comments.length} comment${
              comments.length !== 1 ? "s" : ""
            }`}
            size="small"
          />
        </Stack>

        {/* comment list */}
        {comments.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            {/* <img src={sampleAvatar} alt="no comments" style={{ width: 72, height: 72, borderRadius: "50%", opacity: 0.85 }} /> */}
            <Typography variant="body1" sx={{ mt: 2 }}>
              Làm người đóng góp đầu tiên nào
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Chia sẻ suy nghĩ của bạn về bài viết này.
            </Typography>
          </Box>
        ) : (
          <List sx={{ pt: 0 }}>
            {comments.map((c) => (
              <React.Fragment key={c?.id ?? Math.random()}>
                <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar
                      alt={c.user?.username ?? "user"}
                      sx={{ width: 48, height: 48 }}
                    >
                      {c.user?.username?.charAt(0)?.toUpperCase() ?? "U"}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle2">
                          {c.user?.username ?? "Unknown"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          · {timeAgo(c.createdAt)}
                        </Typography>
                      </Stack>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}
                      >
                        {c.content}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="fullWidth" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* input */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="flex-start"
        >
          <Avatar alt={"Bạn"} sx={{ width: 48, height: 48 }}>
            {"Bạn"}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <TextField
              inputRef={inputRef}
              value={value}
              onChange={handleChange}
              placeholder="Viết gì vui vui ik..."
              fullWidth
              minRows={2}
              maxRows={6}
              multiline
              variant="outlined"
              size="small"
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <Typography
                variant="caption"
                color={charCount > 500 ? "error" : "text.secondary"}
              >
                {charCount}/500
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  disabled={createComment.isPending}
                  startIcon={
                    createComment.isPending ? (
                      <CircularProgress size={16} />
                    ) : undefined
                  }
                >
                  {createComment.isPending ? "Đang gửi..." : "Gửi"}
                </Button>
                <Tooltip title="Discard">
                  <IconButton
                    onClick={() => {
                      setValue("");
                      setCharCount(0);
                    }}
                    size="small"
                  >
                    Xóa
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
