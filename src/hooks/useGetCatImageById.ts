import { useQuery } from '@tanstack/react-query';
import { fetchCatImageById } from '../api/catApi';
import type { CatImageDetail } from '../types/cat';
import { REQUEST_STATE_TIME } from "../api/config.ts";

const CAT_IMAGE_BY_ID_QUERY_KEY = 'catImageById';

export const useGetCatImageById = (id: string | null) => {
  return useQuery<CatImageDetail, Error>({
    queryKey: [CAT_IMAGE_BY_ID_QUERY_KEY, id],
    queryFn: () => fetchCatImageById(id!),
    select: (item) => {
      // For DEMO/DISCUSSION purposes
      // return buildFrontendModel(item)
      // interface (backendModel: BackendModel): FrontendModel
      return item;
    },
    enabled: !!id,
    staleTime: REQUEST_STATE_TIME
  });
};

