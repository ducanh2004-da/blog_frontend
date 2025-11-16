import { User } from "./user.type";

export type Like = {
    id: string;
    blogId: string;
    user: User;
    createdAt: Date;
}

export type LikeResponse = {
    success: boolean;
    message: string;
    count: number;
    likes: Like[];
}

export type LikeProps = {
    blogId?: string;
    onClose?: () => void;
    open?: boolean;
    currentUserId?: string;
}