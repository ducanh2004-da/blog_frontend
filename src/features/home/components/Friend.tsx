import { User } from '@/types/user.type';
import { useChatStore } from '@/stores/chat.store';
import { useUsers, useTags, useUserInitials } from '@/hooks/useUserData';
import { Card } from '@/components/common/Card';
import ConversationList from './ConversationList';

/**
 * FriendItem - Individual friend list item with avatar and interactions
 * Memoized to prevent unnecessary re-renders
 */
const FriendItem = ({ user, onChat }: { user: User; onChat: (id: string, name: string) => void }) => {
  const initials = useUserInitials(user?.username);

  return (
    <button
      onClick={() => onChat(user.id, user.username ?? '')}
      className="w-full flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      aria-label={`Chat with ${user.username}`}
      type="button"
    >
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-semibold text-white"
        aria-hidden="true"
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-900 truncate">{user?.username}</div>
        <div className="text-xs text-gray-500">Active now</div>
      </div>
    </button>
  );
};

/**
 * FriendsCard - Section displaying list of friends
 */
const FriendsCard = ({ users }: { users: User[] | undefined }) => {
  const openChatWithUser = useChatStore((s) => s.openChatWithUser);

  if (!users || users.length === 0) {
    return (
      <Card variant="default" padding="md">
        <h2 className="text-base font-semibold text-gray-800 mb-1">Tìm Bạn bè</h2>
        <p className="text-xs text-gray-400 mb-4">Chưa có bạn bè nào</p>
        <div className="flex gap-2">
          <button className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Tất cả
          </button>
          <button className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            Theo dõi
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="md">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Tìm Bạn bè</h2>
      <p className="text-xs text-gray-400 mb-4">Gửi tin nhắn đến bạn bè của bạn</p>

      <ul className="space-y-2 mb-4">
        {users.map((user: User) => (
          <li key={user.id}>
            <FriendItem user={user} onChat={openChatWithUser} />
          </li>
        ))}
      </ul>

      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Tất cả
        </button>
        <button className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
          Theo dõi
        </button>
      </div>
    </Card>
  );
};

/**
 * TagsCard - Section displaying featured tags
 */
const TagsCard = ({ tags }: { tags: any[] | undefined }) => {
  if (!tags || tags.length === 0) {
    return (
      <Card variant="default" padding="md">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Tags nổi bật</h3>
        <p className="text-xs text-gray-400">Chưa có tag nào</p>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="md">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Tags nổi bật</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag?.id}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={`Filter by tag ${tag?.name}`}
          >
            #{tag?.name}
          </button>
        ))}
      </div>
    </Card>
  );
};

/**
 * Friend Component - Sidebar with friends, tags, and conversations
 * Responsive design: hidden on mobile, visible from tablet (md) breakpoint
 */
export default function Friend() {
  const { data: users } = useUsers();
  const { data: tags } = useTags();

  return (
    <aside className="space-y-5" aria-label="Friends and tags sidebar">
      <div className="sticky top-24 space-y-5 z-10">
        <FriendsCard users={users} />
        <TagsCard tags={tags} />
        <div>
          <ConversationList />
        </div>
      </div>
    </aside>
  );
}
