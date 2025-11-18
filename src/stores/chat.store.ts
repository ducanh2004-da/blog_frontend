// src/stores/chat.store.ts
import { create } from 'zustand';
import { Conversation } from '@/features/home/types/chat.types';
import { chatService } from '@/features/home/service/chat.service';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

type ChatStore = {
  activeConversation: Conversation | null;
  open: boolean;
  setActiveConversation: (conv: Conversation | null) => void;
  openChatWithUser: (userId: string, username?: string) => Promise<void>;
  closeChat: () => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  activeConversation: null,
  open: false,

  setActiveConversation: (conv) => set({ activeConversation: conv }),

  // tạo hoặc lấy conversation giữa current user và userId, rồi mở chat
  openChatWithUser: async (userId: string, username?: string) => {
    try {
      const authState = useAuthStore.getState();
      const currentUserId = authState.user?.id ?? authState.userDetails?.id;
      if (!currentUserId) {
        toast.error('Bạn chưa đăng nhập');
        return;
      }

      // gọi server tạo hoặc trả về conversation giữa 2 user
      // server mutation createConversation nên trả object conversation (id, participants...)
      const conv = await chatService.createConversation([currentUserId, userId], username);
      if (!conv) {
        toast.error('Không thể tạo cuộc trò chuyện');
        return;
      }
      set({ activeConversation: conv, open: true });
    } catch (err: any) {
      console.error('openChatWithUser error', err);
      toast.error(err?.message || 'Lỗi khi mở chat');
    }
  },

  closeChat: () => set({ open: false, activeConversation: null }),
}));
