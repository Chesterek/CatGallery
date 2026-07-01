import axios from 'axios';
import type { CatImage } from '../types/cat';

const CAT_API_BASE_URL = 'https://api.thecatapi.com/v1';
const CAT_API_KEY = 'live_r97MdDwabm9Ckdb7lvTrzJ7D7Z5ruf5c3ttj84rBPNDV4bVBnYc6etqNOMtP6iwR';

const catApiClient = axios.create({
  baseURL: CAT_API_BASE_URL,
  headers: {
    'x-api-key': CAT_API_KEY,
  },
});

export const fetchCatImages = async (limit = 30): Promise<CatImage[]> => {
  const response = await catApiClient.get<CatImage[]>('/images/search', {
    params: {
      limit,
      mime_types: 'jpg,png',
      has_breeds: 0,
    },
  });
  return response.data;
};

