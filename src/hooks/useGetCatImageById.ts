import { useQuery } from '@tanstack/react-query';
import { fetchCatImageById } from '../api/catApi';
import type { CatImageDetail } from '../types/cat';

const CAT_IMAGE_BY_ID_QUERY_KEY = 'catImageById';

export const useGetCatImageById = (id: string | null) => {
  return useQuery<CatImageDetail, Error>({
    queryKey: [CAT_IMAGE_BY_ID_QUERY_KEY, id],
    queryFn: () => fetchCatImageById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

