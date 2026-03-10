import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Blog } from '@/features/home/types/blog.type';
import { blogService } from '@/features/home/service/blog.service';

/**
 * Custom hook to manage blog feed data
 * Handles loading, error states, and caching
 */
export const useBlogFeed = (): UseQueryResult<Blog[], Error> => {
  return useQuery<Blog[]>({
    queryKey: ['blogs'],
    queryFn: () => blogService.getPosts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Custom hook for top liked posts
 */
export const useTopLikedBlogs = (): UseQueryResult<Blog[], Error> => {
  return useQuery<Blog[]>({
    queryKey: ['postLike'],
    queryFn: () => blogService.getTop5Like(),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Custom hook for recent posts
 */
export const useRecentBlogs = (): UseQueryResult<Blog[], Error> => {
  return useQuery<Blog[]>({
    queryKey: ['postRecent'],
    queryFn: () => blogService.getTop5Recent(),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Custom hook to filter blogs by search term
 */
export const useFilteredBlogs = (
  blogs: Blog[] | undefined,
  searchTerm: string
): Blog[] => {
  if (!blogs || !searchTerm) return blogs || [];

  const normalizedSearch = searchTerm.toLowerCase();
  return blogs.filter((blog) => {
    const title = blog.title?.toLowerCase() || '';
    const content = blog.content?.toLowerCase() || '';
    const author = blog.user?.username?.toLowerCase() || '';

    return title.includes(normalizedSearch) || content.includes(normalizedSearch) || author.includes(normalizedSearch);
  });
};

/**
 * Custom hook to estimate reading time
 */
export const useEstimateReadTime = (content?: string | null): string | undefined => {
  if (!content) return undefined;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};
