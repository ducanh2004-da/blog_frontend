// BlogLikes.tsx (sửa)
import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Like, LikeProps, LikeResponse } from "../types/like.type";
import { likeService } from "../service/like.service";

// MUI
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { toast } from "sonner";

function formatDate(d?: string | Date) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString();
}

const LikeItem = React.memo(function LikeItem(props: {
  totalLike?: number;
  likes?: Like[];
  dialogOpen: boolean;
  hasLiked: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  handleLike: () => void;
  isMutating: boolean;
}) {
  const { totalLike, likes, dialogOpen, hasLiked, handleOpen, handleClose, handleLike, isMutating } = props;

  return (
    <>
      <div className="flex items-center gap-1" role="group" aria-label="like controls">
        <IconButton
          aria-label={hasLiked ? "Bỏ like" : "Like"}
          size="large"
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          aria-pressed={hasLiked ?? false}
          disabled={isMutating}
        >
          {isMutating ? <CircularProgress size={20} /> : hasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>

        <Tooltip title={`${totalLike ?? 0} likes`}>
          <Button
            variant="text"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            aria-label="Xem danh sách người đã like"
            className="min-w-[1px] w-1 py-0 px-2"
          >
            {totalLike ?? 0} người thích
          </Button>
        </Tooltip>
      </div>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm" aria-label="like-list-dialog">
        <DialogTitle>
          <Typography variant="h6">Likes — {totalLike ?? 0}</Typography>
        </DialogTitle>

        <DialogContent dividers>
          {likes && likes.length > 0 ? (
            <List>
              {likes.map((like) => (
                <ListItem key={like.id} divider>
                  <ListItemAvatar>
                    {like.user?.avatar ? (
                      <Avatar alt={like.user.username} src={like.user.avatar} sx={{ width: 36, height: 36 }} />
                    ) : (
                      <Avatar sx={{ width: 36, height: 36 }}>
                        {like.user?.username?.charAt(0)?.toUpperCase() ?? "U"}
                      </Avatar>
                    )}
                  </ListItemAvatar>

                  <ListItemText primary={like.user?.username ?? "Unknown"} secondary={formatDate(like.createdAt)} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{ py: 2 }}>
              Chưa có ai like bài viết này.
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} aria-label="close-like-dialog">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default function BlogLikes({ blogId, open = false, onClose, currentUserId }: LikeProps) {
  const [dialogOpen, setDialogOpen] = useState(Boolean(open));
  const queryClient = useQueryClient();

  // Query: scoped by blogId
  const { data: likeReturn, isLoading, isError, refetch } = useQuery<LikeResponse>({
    queryKey: ["likes", blogId],
    queryFn: () => likeService.getLikeByBlog(blogId),
    enabled: Boolean(blogId),
    staleTime: 1000 * 60 * 5,
  });

  // Mutations: note we use the same queryClient instance via hook
  const createLike = useMutation({
    mutationFn: ({ blogId }: { blogId: string }) => likeService.createLike(blogId),
    onSuccess: () => {
      // invalidate the exact query key used by useQuery to refresh
      queryClient.invalidateQueries({ queryKey: ["likes", blogId] });
      toast.success("Liked");
    },
    onError: (err: any) => {
      console.error("like error:", err);
      toast.error(err?.message ?? "Like failed");
    },
  });

  const unLike = useMutation({
    mutationFn: ({ blogId }: { blogId: string }) => likeService.unLike(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", blogId] });
      toast.success("Unliked");
    },
    onError: (err: any) => {
      console.error("unlike error:", err);
      toast.error(err?.message ?? "Unlike failed");
    },
  });

  const totalLike = likeReturn?.count ?? 0;
  const likes = likeReturn?.likes ?? [];

  const hasLiked = useMemo(() => {
    if (!currentUserId) return false;
    return likes.some((l) => l.user?.id === currentUserId);
  }, [likes, currentUserId]);

  // sync external open prop -> internal state
  useEffect(() => {
    setDialogOpen(Boolean(open));
  }, [open]);

  const handleLocalOpen = () => setDialogOpen(true);
  const handleLocalClose = () => {
    setDialogOpen(false);
    if (onClose) onClose();
  };

  const handleLike = async () => {
    if (!blogId) return toast.error("Blog ID missing");
    try {
      if (!hasLiked) {
        await createLike.mutateAsync({ blogId });
      } else {
        await unLike.mutateAsync({ blogId });
      }
    } catch (err) {
      console.error("Unexpected like/unlike error:", err);
      toast.error("Unexpected error");
    }
  };

  useEffect(() => {
    if (dialogOpen && refetch) refetch();
  }, [dialogOpen, refetch]);

  if (isError) {
    return (
      <Tooltip title="Likes">
        <IconButton aria-label="likes-error">
          <FavoriteIcon />
        </IconButton>
      </Tooltip>
    );
  }

  const isMutating = createLike.isPending || unLike.isPending;

  return (
    <div>
      {isLoading ? (
        <CircularProgress size={20} />
      ) : (
        <LikeItem
          totalLike={totalLike}
          likes={likes}
          hasLiked={hasLiked}             // <-- SỬA: truyền biến đúng
          dialogOpen={dialogOpen}
          handleOpen={handleLocalOpen}
          handleClose={handleLocalClose}
          handleLike={handleLike}
          isMutating={isMutating}
        />
      )}
    </div>
  );
}
