import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Message } from "@/features/home/types/chat.types";
import { chatService } from "@/features/home/service/chat.service";

type UseChatSocketOptions = {
  conversationId?: string | null;
  apiUrl?: string;
  onMessage?: (m: Message) => void;
};

export function useChatSocket({
  conversationId,
  apiUrl = import.meta.env.VITE_API_BACKEND_URL,
  onMessage,
}: UseChatSocketOptions) {

  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Connect socket function
  const connectSocket = useCallback(
    async (token?: string) => {
      try {
        const t = token ?? (await chatService.getSocketToken());
        
        // Disconnect old socket
        if (socketRef.current) {
          socketRef.current.removeAllListeners();
          socketRef.current.disconnect();
          socketRef.current = null;
        }

        //socket.io thực hiện handshake → tạo kết nối WebSocket, gọi handleConnection ở backend
        const socket = io(`https://blogplatform-backend-2ikg.onrender.com/chat`, {
          auth: { token: t },
          transports: ["websocket"],
          withCredentials: true,
          autoConnect: true,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
        });

        socketRef.current = socket;
        
        // ✅ FIX: Set connected immediately if already connected
        if (socket.connected) {
          setConnected(true);
        }

        // Client lắng nghe connect, connected từ server
        socket.on("connect", () => {
          setConnected(true);
          console.log("✅ Socket connected:", socket.id);
          
          // Join conversation on connect, nếu đã tạo conversation ở database
          if (conversationId) {
            // gọi đến handleJoinConversation nếu có conversation Id
            socket.emit("joinConversation", { conversationId });
          }
        });

        socket.on("disconnect", (reason) => {
          setConnected(false);
          console.log("❌ Socket disconnected:", reason);
        });

        // lắng nghe message nhận payload message và cập nhật UI.
        // sau khi nhận sự kiện message 
        socket.on("message", (m: Message) => {
          console.log("📨 New message received:", m);
          
          setMessages((prev) => {
            // Remove temp message if exists
            const withoutTemp = prev.filter(
              (p) => !(
                p.id?.startsWith("temp-") &&
                p.content === m.content &&
                p.senderId === m.senderId
              )
            );
            
            // Check if message already exists (avoid duplicates)
            const exists = withoutTemp.find((p) => p.id === m.id);
            if (exists) return withoutTemp;
            
            return [...withoutTemp, m];
          });

          if (onMessage) onMessage(m);
        });

        // lắng nghe join
        socket.on("joined", (data) => {
          console.log("✅ Joined conversation:", data.conversationId);
        });

        socket.on("error", (err: string) => {
          console.error("Socket error:", err);
        });

        socket.on("connect_error", async (err: any) => {
          console.warn("Socket connect_error:", err?.message || err);
          
          // Try to refresh token once
          if (err?.message?.includes('auth') || err?.message?.includes('token')) {
            try {
              const newToken = await chatService.getSocketToken();
              socket.disconnect();
              setTimeout(() => connectSocket(newToken), 1000);
            } catch (e) {
              console.error("Token refresh failed:", e);
            }
          }
        });

        return socket;
      } catch (err) {
        console.error("connectSocket error:", err);
        throw err;
      }
    },
    [apiUrl, conversationId, onMessage]
  );

  // ✅ CRITICAL FIX: Load message history from database
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!conversationId) {
        setMessages([]);
        return;
      }

      try {
        setLoading(true);
        
        // ✅ Load messages from database first
        const history = await chatService.getMessages(conversationId, 50);
        
        if (!mounted) return;
        
        console.log(`📚 Loaded ${history.length} messages from database`);
        setMessages(history);

        // Then connect socket
        if (socketRef.current?.connected) {
          // Khi user muốn vào 1 conversation và socket already connected, just join new conversation
          socketRef.current.emit("joinConversation", { conversationId });
        } else {
          // Otherwise connect new socket
          await connectSocket();
        }
      } catch (err) {
        console.error("useChatSocket init error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [conversationId, connectSocket]);

  // ✅ Re-join conversation when conversationId changes
  useEffect(() => {
    if (!conversationId) return;
    
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit("joinConversation", { conversationId });
    }
  }, [conversationId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current || !conversationId || !content.trim()) return;

      // ✅ Optimistic UI update
      const tempId = "temp-" + Date.now();
      const tempMsg: Message = {
        id: tempId,
        conversationId,
        senderId: "me",
        content: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sender: { id: "me", username: "You" } as any,
        read: false,
      };
      
      setMessages((prev) => [...prev, tempMsg]);

      // Send to server
      socketRef.current.emit("sendMessage", { 
        conversationId, 
        content: content.trim() 
      });
    },
    [conversationId]
  );

  return {
    socket: socketRef.current,
    connected,
    messages,
    sendMessage,
    setMessages,
    loading,
  };
}