import type { CatImage, CatImageDetail } from '../types/cat';
import { PAGE_SIZE, catApiClient } from "./config.ts";

export const fetchCatImages = async (limit = PAGE_SIZE, page = 0): Promise<CatImage[]> => {
  const response = await catApiClient.get<CatImage[]>('/images/search', {
    params: {
      limit,
      page,
      mime_types: 'jpg,png',
      has_breeds: true,
    },
  });
  return response.data;
};

export const fetchCatImageById = async (id: string): Promise<CatImageDetail> => {
  const response = await catApiClient.get<CatImageDetail>(`/images/${id}`);
  return response.data;
};

