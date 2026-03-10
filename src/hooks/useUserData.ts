import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { User } from '@/types/user.type';
import { userService } from '@/features/home/service/user.service';
import { Tag } from '@/features/home/types/tag.type';
import { tagService } from '@/features/home/service/tag.service';

/**
 * Custom hook to fetch all users
 */
export const useUsers = (): UseQueryResult<User[], Error> => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => userService.getAllUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Custom hook to fetch all tags
 */
export const useTags = (): UseQueryResult<Tag[], Error> => {
  return useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: () => tagService.getTags(),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Custom hook to get user initials for avatar fallback
 */
export const useUserInitials = (username?: string): string => {
  if (!username) return 'U';
  return username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};
