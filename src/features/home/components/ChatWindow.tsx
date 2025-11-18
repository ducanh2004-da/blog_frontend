import React, { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/chat.store';
import { useAuthStore } from '@/stores/auth.store';
import { useChatSocket } from '@/hooks/useChatSocket';

export default function ChatWindow() {
  const { activeConversation, open, closeChat } = useChatStore();
  const auth = useAuthStore();
  // sau khi user chọn user thì ta thực hiện hàm openChatWithUser để có conversationId 
  const convId = activeConversation?.id ?? null;
  // sau khi có conversationId thì ta kết nối webSocket
  const { messages, sendMessage, connected, loading } = useChatSocket({ 
    conversationId: convId 
  });

  const [text, setText] = useState('');
  const currentUserId = auth.user?.id ?? auth.userDetails?.id;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    
    sendMessage(trimmed);
    setText('');
  };

  if (!open || !activeConversation) return null;

  // Get conversation title
  const getTitle = () => {
    if (activeConversation.title) return activeConversation.title;
    
    const otherUsers = activeConversation.participants
      ?.filter(p => p.userId !== currentUserId)
      .map(p => p.user?.username)
      .filter(Boolean);
    
    return otherUsers.join(', ') || 'Chat';
  };

  return (
    <div className="fixed right-6 bottom-6 z-50 w-[360px] bg-white shadow-xl rounded-lg overflow-hidden flex flex-col border border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gradient-to-r from-indigo-500 to-indigo-600 text-white flex items-center justify-between">
        <div>
          <div className="font-semibold">{getTitle()}</div>
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-300' : 'bg-red-300'}`} />
            <span>{connected ? 'Online' : 'Offline'}</span>
          </div>
        </div>
        <button 
          onClick={() => closeChat()} 
          className="text-white hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div 
        className="p-3 flex-1 overflow-auto h-80 bg-gray-50" 
        id="chat-scroll" 
        ref={scrollRef}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Đang tải tin nhắn...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-center">
              <div className="text-2xl mb-2">💬</div>
              <div>Chưa có tin nhắn nào</div>
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === currentUserId;
            const isTemp = m.id?.startsWith('temp-');
            
            return (
              <div 
                key={m.id} 
                className={`mb-3 flex ${mine ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    ${mine 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white text-gray-900 border border-gray-200'
                    } 
                    rounded-lg px-3 py-2 max-w-[70%] shadow-sm
                    ${isTemp ? 'opacity-50' : ''}
                  `}
                >
                  {!mine && (
                    <div className="text-xs font-semibold text-indigo-600 mb-1">
                      {m.sender?.username || 'Unknown'}
                    </div>
                  )}
                  <div className="break-words whitespace-pre-wrap">
                    {m.content}
                  </div>
                  <div className={`text-xs mt-1 text-right ${mine ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {new Date(m.createdAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {isTemp && ' ⏳'}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t bg-white">
        {!connected && (
          <div className="mb-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            ⚠️ Đang kết nối...
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            placeholder={connected ? "Nhập tin nhắn..." : "Đang kết nối..."}
          />
          <button 
            onClick={handleSend}
            disabled={!text.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}