// src/features/home/components/Friend.tsx
import { useQuery } from "@tanstack/react-query";
import { userService } from "../service/user.service";
import { User } from "@/types/user.type";
import { useChatStore } from "@/stores/chat.store";
import { tagService } from "../service/tag.service";
import { Tag } from "../types/tag.type";
import ConversationList from "./ConversationList";

export default function Friend() {
  const { data: users, isLoading, isError } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => userService.getAllUser(),
    staleTime: 1000 * 60 * 5,
  });
  const {data: tags} = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: () => tagService.getTags(),
    staleTime: 1000 * 60 * 5,
  })

  const openChatWithUser = useChatStore((s) => s.openChatWithUser);

  return (
    <aside className="lg:col-span-3 order-2 lg:order-1">
      <div className="sticky top-6 space-y-6 z-10">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Bạn bè</h2>
          <p className="text-xs text-gray-400 mt-1">Hãy gửi đến mọi người những tin nhắn yêu thương nào</p>

          <ul className="mt-4 space-y-3">
            {users?.map((u: User) => (
              <li
                key={u.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => openChatWithUser(u.id, u.username ?? '')}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-semibold">
                  {u?.username?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{u?.username}</div>
                  <div className="text-xs text-gray-400">3 posts</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <button className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Tất cả</button>
            <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Theo dõi</button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800">Tags nổi bật</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags?.map((t:Tag) => (
              <button key={t?.id} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">#{t?.name}</button>
            ))}
          </div>
        </div>
        <div>
          <ConversationList />
        </div>
      </div>
    </aside>
  );
}
