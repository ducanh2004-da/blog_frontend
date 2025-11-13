import { User } from "./user.type";
export type Comment = {
    content: string;
    createdAt: string;
    id: string;
    user: User;
};
export type CommentResponse = {
  success: boolean;
  message: string;
  comments: Comment[];
}

export interface CommentProps {
  blogId: string;
}

export interface CreateComment {
  editId?: string | number | null;
  open?: boolean;
  onClose?: () => void;
  rows?: any[];
  onblogChange?: (blog: any, id?: string | number | null) => void;
}