import { useQuery } from '@tanstack/react-query';
import { fetchCatImages } from '../api/catApi';
import type { CatImage } from '../types/cat';

const CAT_IMAGES_QUERY_KEY = ['catImages'] as const;

export const useGetCatImages = (limit = 30) => {
  return useQuery<CatImage[], Error>({
    queryKey: [...CAT_IMAGES_QUERY_KEY, limit],
    queryFn: () => fetchCatImages(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

