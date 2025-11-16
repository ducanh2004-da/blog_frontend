// comment.service.ts
import apiConfig from "@/configs/api.config";
import { toast } from "sonner";

export const commentService = {
  getCommentByBlog: async (blogId: string | undefined) => {
    if(!blogId){
      toast.error('Get comment fail');
      throw new Error('Get comment fail');
    }
    const response = await apiConfig.post('', {
      query: `
        query Query($blogId: String!) {
          getCommentByBlog(blogId: $blogId) {
            success
            message
            comments {
              content
              createdAt
              id
              user {
                avatar
                id
                role
                username
                email
              }
            }
          }
        }`,
      variables: { blogId } // <-- phải là "variables"
    });

    // Trả về phần data đã parse
    return response.data.data.getCommentByBlog;
  },

  createPost: async (content: string, blogId: string | null | undefined) => {
    const response = await apiConfig.post('', {
      query: `
        mutation Mutation($data: CreateComment!) {
          createComment(data: $data) {
            success
            message
            comments {
              content
              createdAt
              id
              user {
                avatar
                email
                id
                role
                username
              }
            }
          }
        }`,
      variables: { data: { content, blogId } }
    });

    return response.data.data.createComment;
  },
};
