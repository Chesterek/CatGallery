import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchCatImages } from '../api/catApi';
import type { CatImage } from '../types/cat';

const PAGE_SIZE = 30;
const CAT_IMAGES_QUERY_KEY = ['catImages'] as const;

export const useGetCatImages = () => {
  return useInfiniteQuery<CatImage[], Error>({
    queryKey: CAT_IMAGES_QUERY_KEY,
    queryFn: ({ pageParam }) => fetchCatImages(PAGE_SIZE, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
