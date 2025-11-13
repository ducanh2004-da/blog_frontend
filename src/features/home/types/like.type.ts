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
    likes: Like[];
}

export type LikeProps = {
    blogId: string;
}