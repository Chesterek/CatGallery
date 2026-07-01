import type { CatImage, CatImageDetail } from '../types/cat';
import { catApiClient } from "./config.ts";

export const fetchCatImages = async (limit = 30): Promise<CatImage[]> => {
  const response = await catApiClient.get<CatImage[]>('/images/search', {
    params: {
      limit,
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

