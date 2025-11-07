import apiConfig from "@/configs/api.config";
import { create } from "zustand";

export const tagService = {
    getTags: async () => {
        const response = await apiConfig.post('', {
            query: `
        query Query {
  getAllTags {
    success
    message
    tags {
      name
      id
      createdAt
    }
  }
}
  `,
        });
        return response.data.data.getAllTags.tags;
    },

    getTagById: async (id: string) => {
        const response = await apiConfig.post('', {
            query: `
        query GetTagById($getTagByIdId: String!) {
  getTagById(id: $getTagByIdId) {
    message
    success
    tags {
      name
      id
      createdAt
    }
  }
}` ,
            variables: { getTagByIdId: id }
        });
        return response.data.data.getTagById;
    },

    createTag: async (name: string) => {
        const response = await apiConfig.post('', {
            query: `
        mutation Mutation($data: CreateTag!) {
  createTag(data: $data) {
    message
    success
    tags {
      name
      id
      createdAt
    }
  }
}`,
            variables: { data: { name } }

        });
        return response.data.data.createTag;
    },

    updateTag: async (id: string, name: string) => {
        const response = await apiConfig.post('', {
            query: `
        mutation UpdateTag($updateTagId: String!, $data: UpdateTag!) {
  updateTag(id: $updateTagId, data: $data) {
    message
    success
    tags {
      name
      id
      createdAt
    }
  }
}`,
            variables: { updateTagId: id, data: { name } }
        });
        return response.data.data.updateTag;
    },

    deletePost: async (id: string) => {
        const response = await apiConfig.post('', {
            query: `
        mutation DeleteTag($deleteTagId: String!) {
  deleteTag(id: $deleteTagId) {
    message
    success
    tags {
      name
      id
      createdAt
    }
  }
}`,
            variables: { deleteTagId: id }
        });
        return response.data.data.deleteTag;
    }

};