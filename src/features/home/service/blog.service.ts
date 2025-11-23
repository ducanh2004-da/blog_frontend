import apiConfig from "@/configs/api.config";
import { create } from "zustand";
import { toast } from "sonner";

export const blogService = {
  getPosts: async () => {
    const response = await apiConfig.post('', {
        query: `
        query Query {
  getAllBlogs {
    message
    success
    blogs {
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
      content
      createdAt
      id
      tags {
        createdAt
        id
        name
      }
      title
      updatedAt
      user {
        avatar
        id
        email
        phoneNumber
        role
        username
      }
    }
  }
}
  `,});
    return response.data.data.getAllBlogs.blogs;
  },

  getPostById: async (id: string | undefined) => {
    if(!id){
      toast.error('get post fail');
      throw new Error('get post fail');
    }
    const response = await apiConfig.post('', {
        query: `
        query Query($getBlogByIdId: String!) {
  getBlogById(id: $getBlogByIdId) {
    message
    success
    blogs {
      comments {
        id
        content
        user {
          avatar
          email
          username
          role
          updatedAt
          id
        }
      }
      content
      createdAt
      id
      tags {
        name
        id
        createdAt
      }
      title
      updatedAt
      user {
        avatar
        username
        id
        email
        role
        createdAt
      }
    }
  }
}` ,
      variables: { getBlogByIdId: id }
    });
    return response.data.data.getBlogById.blogs;
  },

  getPostByUserId: async (userId: string | undefined) => {
    if(!userId){
      toast.error('get post fail');
      throw new Error('get post fail');
    }
    const response = await apiConfig.post('', {
        query: `
        query Query($userId: String!) {
  getBlogByUserId(userId: $userId) {
    blogs {
      content
      createdAt
      id
      tags {
        createdAt
        id
        name
      }
      title
      updatedAt
      user {
        username
        avatar
        role
        id
        email
      }
    }
    message
    success
  }
}` ,
      variables: { getBlogByIdId: userId }
    });
    return response.data.data.getBlogByUserId.blogs;
  },

  createPost: async (title: string, content: string, userId: string | null, tagId: string | null) => {
    const response = await apiConfig.post('', {
        query: `
        mutation Mutation($data: CreateBlog!) {
  createBlog(data: $data) {
    message
    success
    blogs {
      content
      createdAt
      id
      title
      updatedAt
      tags {
        name
        id
        createdAt
      }
      user {
        avatar
        email
        phoneNumber
        username
        role
        id
      }
    }
  }
}`,
        variables: { data: { title, content, userId, tagId } }

  });
    return response.data.data.createBlog;
},

updatePost: async (id: string, title: string, content: string, tagId: string | null) => {
    const response = await apiConfig.post('', {
        query: `
        mutation UpdateBlog($blogId: String!, $data: UpdateBlog!) {
  updateBlog(blogId: $blogId, data: $data) {
    message
    success
    blogs {
      content
      createdAt
      id
      tags {
        createdAt
        id
        name
      }
      title
      updatedAt
      user {
        avatar
        email
        phoneNumber
        username
        role
        id
      }
    }
  }
}`,
        variables: { blogId: id, data: { title, content, tagId } }
    });
    return response.data.data.updateBlog;
  },

    deletePost: async (id: string) => {
    const response = await apiConfig.post('', {
        query: `
        mutation Mutation($deleteBlogId: String!) {
  deleteBlog(id: $deleteBlogId) {
    success
    message
    blogs {
      content
      createdAt
      id
      tags {
        createdAt
        id
        name
      }
      title
      updatedAt
      user {
        avatar
        id
        phoneNumber
        role
        username
        createdAt
        email
      }
    }
  }
}`,
        variables: { deleteBlogId: id }
    });
    return response.data.data.deleteBlog;
  },

  getTop5Like: async () => {
    const response = await apiConfig.post('', {
        query: `
        query GetTop5Like {
  getTop5Like {
    success
    message
    blogs {
      id
      title
      content
      createdAt
      tags {
        name
        id
      }
      user {
        avatar
        username
        email
        role
      }
    }
  }
}
  `,});
    return response.data.data.getTop5Like.blogs;
  },

  getTop5Recent: async () => {
    const response = await apiConfig.post('', {
        query: `
        query Query {
  getTop5Recent {
    success
    message
    blogs {
      id
      title
      content
      createdAt
      tags {
        name
        id
      }
      user {
        avatar
        username
        email
        role
      }
    }
  }
}
  `,});
    return response.data.data.getTop5Recent.blogs;
  },

};