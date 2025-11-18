import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { chatService } from '@/features/home/service/chat.service';
import { Conversation } from '@/features/home/types/chat.types';
import { useChatStore } from '@/stores/chat.store';
import { useAuthStore } from '@/stores/auth.store';

export default function ConversationList() {
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatService.getMyConversations(),
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { setActiveConversation, open: chatOpen } = useChatStore();
  const currentUserId = useAuthStore(s => s.user?.id ?? s.userDetails?.id);

  const handleOpenChat = (conv: Conversation) => {
    setActiveConversation(conv);
    useChatStore.setState({ open: true });
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Tin nhắn</h2>
        <div className="text-sm text-gray-400">Đang tải...</div>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Tin nhắn</h2>
        <div className="text-sm text-gray-400 text-center py-8">
          <div className="text-2xl mb-2">💬</div>
          <div>Chưa có cuộc trò chuyện nào</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm sticky top-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Tin nhắn</h2>
      <ul className="space-y-2">
        {conversations.map(conv => {
          const otherUser = conv.participants
            ?.find(p => p.userId !== currentUserId)
            ?.user;
          
          const lastMessage = conv.messages?.[0];
          const title = conv.title || otherUser?.username || 'Chat';

          return (
            <li 
              key={conv.id}
              onClick={() => handleOpenChat(conv)}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
                {title.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {title}
                </div>
                {lastMessage && (
                  <div className="text-xs text-gray-500 truncate">
                    {lastMessage.content}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(conv.updatedAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}