import apiConfig from "@/configs/api.config";
import { create } from "zustand";
import { toast } from "sonner";

export const userService = {
  getAllUser: async () => {
    const response = await apiConfig.post('', {
        query: `
        query Query {
  getAllUser {
    username
    email
    role
    phoneNumber
    id
    avatar
  }
}
  `,});
    return response.data.data.getAllUser;
  },
}