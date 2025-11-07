export type Blog = {
  comments: {
    content: string;
    createdAt: string;
    id: string;
  }[];
  content: string;
  createdAt: string;
  id: string;
  tags: {
    createdAt: string;
    id: string;
    name: string;
  }[];
  title: string;
  updatedAt: string;
  user: {
    avatar: string;
    email: string;
    phoneNumber: string;
    role: string;
    username: string;
  };
};

export interface PostProps {
  posts: Blog[] | undefined
  isLoading: any
  isError: any
}

export interface BlogFormProps {
  editId?: string | number | null;
  open?: boolean;
  onClose?: () => void;
  rows?: any[];
  onblogChange?: (blog: any, id?: string | number | null) => void;
}