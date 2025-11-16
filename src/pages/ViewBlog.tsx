// src/pages/ViewBlog.tsx
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "../features/home/service/blog.service";
import { useAuthStore } from "@/stores/auth.store";
import { useParams, useNavigate } from "react-router-dom";
import type { Blog } from "../features/home/types/blog.type";

// MUI
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import BlogLikes from "../features/home/components/BlogLike";
import BlogComments from "../features/home/components/BlogComment";

const formatDate = (v?: string) => (v ? new Date(v).toLocaleString() : "");

const BlogItem = React.memo(function BlogItem({
  blog,
  userId,
  onBack,
  onShare,
}: {
  blog?: Blog | Blog[] | null;
  userId?: string;
  onBack: () => void;
  onShare?: () => void;
}) {
  // chuẩn hóa: blog có thể là 1 object hoặc mảng
  const blogs = Array.isArray(blog) ? blog : blog ? [blog] : [];

  // UX: nếu có nhiều hơn 1 blog (hiếm) hiển thị theo list; normal là 1 item
  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Tooltip title="Back">
          <IconButton onClick={onBack} color="primary" aria-label="back">
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          View post
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              if (onShare) onShare();
            }}
          >
            Copy link
          </Button>
        </Stack>
      </Stack>

      {blogs.length === 0 ? (
        <Card variant="outlined" sx={{ p: 4 }}>
          <Typography variant="body1">
            Bài viết trống hoặc không tìm thấy nội dung.
          </Typography>
        </Card>
      ) : (
        blogs.map((b, idx) => (
          <Card key={b?.id ?? `blog-${idx}`} sx={{ mb: 4, boxShadow: 3 }}>
            {/* Left column: optional cover image */}
            {/*
              Nếu backend có trường coverImage: dùng b.coverImage
              mình dùng CardMedia conditional — nếu không có ảnh, hiển thị avatar ở bên trong content.
            */}

            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <CardContent sx={{ flex: "1 0 auto", p: { xs: 2, sm: 3 } }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={2}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      component="h1"
                      sx={{ mb: 1, fontWeight: 700 }}
                    >
                      {b?.title ?? "(No title)"}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ color: "text.secondary", mb: 1 }}
                    >
                      <PersonIcon fontSize="small" />
                      <Typography variant="body2">
                        {b?.user?.username ?? "Unknown"}
                      </Typography>
                      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="body2">
                        {formatDate(b?.createdAt)}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      sx={{ mt: 1 }}
                    >
                      {Array.isArray(b?.tags) && b.tags.length > 0 ? (
                        b.tags.map((t) => (
                          <Chip
                            key={t.id ?? t.name}
                            label={t.name}
                            size="small"
                            sx={{ mr: 1, mt: 1 }}
                          />
                        ))
                      ) : (
                        <Chip label="No tags" size="small" sx={{ mt: 1 }} />
                      )}
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    {b?.id && (
                      <BlogLikes blogId={b.id} currentUserId={userId} />
                    )}
                    <Tooltip title="Share">
                      <IconButton
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href);
                          if (onShare) onShare();
                        }}
                        color="primary"
                      >
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Content: nếu content là HTML, sanitize bằng DOMPurify trước khi dùng dangerouslySetInnerHTML */}
                <Box
                  sx={{
                    typography: "body1",
                    color: "text.primary",
                    lineHeight: 1.7,
                  }}
                >
                  {/* Safe render: prefer sanitized HTML; fallback render as plain text */}
                  {/* Example (uncomment after npm i dompurify and import DOMPurify):
                      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(b.content || '') }} />
                  */}
                  {!b?.content ? (
                    <Typography variant="body2" color="text.secondary">
                      (No content)
                    </Typography>
                  ) : (
                    <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                      {b.content}
                    </pre>
                  )}
                </Box>
              </CardContent>

              <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
                {b?.id && <BlogComments blogId={b.id} />}
              </Box>
            </Box>
          </Card>
        ))
      )}
    </Box>
  );
});

export default function ViewDetail() {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();

  const [snackOpen, setSnackOpen] = useState(false);

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery<Blog | any>({
    queryKey: ["blog", blogId],
    queryFn: () => blogService.getPostById(blogId as string),
    enabled: !!blogId,
    staleTime: 1000 * 60 * 5,
  });

  // Optional: if your service returns { data: blog } normalize:
  const normalizedBlog = useMemo(() => {
    if (!blog) return null;
    return blog.data ?? blog;
  }, [blog]);

  if (isLoading) {
    // nice skeleton loader
    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", px: 2, py: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
        <Stack spacing={1}>
          <Skeleton width="40%" />
          <Skeleton width="30%" />
          <Skeleton />
          <Skeleton />
          <Skeleton width="60%" />
        </Stack>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 6 }}>
        <Typography variant="h6" color="error">
          Không thể tải bài viết
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Vui lòng thử lại sau hoặc kiểm tra kết nối.
        </Typography>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </Button>
      </Box>
    );
  }

  if (!normalizedBlog) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 6 }}>
        <Typography variant="h6">Bài viết không tồn tại.</Typography>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => navigate("/")}
        >
          Quay về trang chủ
        </Button>
      </Box>
    );
  }

  return (
    <>
      <BlogItem
        blog={normalizedBlog}
        userId={authUser?.id}
        onBack={() => navigate(-1)}
        onShare={() => setSnackOpen(true)}
      />

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        message="Link copied to clipboard"
      />
    </>
  );
}
