// comment.service.ts
import apiConfig from "@/configs/api.config";

export const likeService = {
  getLikeByBlog: async (blogId: string) => {
    const response = await apiConfig.post('', {
      query: `
        query Query($blogId: String!) {
  getLikesByBlog(blogId: $blogId) {
    count
    likes {
      blogId
      createdAt
      id
      user {
        avatar
        email
        phoneNumber
        username
        role
      }
    }
    message
    success
  }
}`,
      variables: { blogId } // <-- phải là "variables"
    });

    // Trả về phần data đã parse
    return response.data.data.getLikesByBlog;
  },

  createLike: async (blogId: string) => {
    const response = await apiConfig.post('', {
      query: `
        mutation Mutation($blogId: String!) {
  createLike(blogId: $blogId) {
    message
    success
  }
}`,
      variables: { blogId }
    });

    return response.data.data.createLike;
  },

  unLike: async (blogId: string) => {
    const response = await apiConfig.post('', {
      query: `
        mutation Mutation($blogId: String!) {
  unLike(blogId: $blogId) {
    message
    success
  }
}`,
      variables: { blogId }
    });

    return response.data.data.unLike;
  },

};
