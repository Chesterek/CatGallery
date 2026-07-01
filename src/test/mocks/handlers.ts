import { http, HttpResponse } from 'msw';
import type { CatImage, CatImageDetail } from '../../types/cat';

export const CAT_API_BASE = 'https://api.thecatapi.com/v1';

export const mockImages: CatImage[] = [
  { id: 'abc1', url: 'https://cdn2.thecatapi.com/images/abc1.jpg', width: 800, height: 600 },
  { id: 'abc2', url: 'https://cdn2.thecatapi.com/images/abc2.jpg', width: 600, height: 800 },
  { id: 'abc3', url: 'https://cdn2.thecatapi.com/images/abc3.jpg', width: 1024, height: 768 },
];

export const mockImageDetail: CatImageDetail = {
  id: 'abc1',
  url: 'https://cdn2.thecatapi.com/images/abc1.jpg',
  width: 800,
  height: 600,
  breeds: [
    {
      id: 'abys',
      name: 'Abyssinian',
      origin: 'Egypt',
      life_span: '14 - 15',
      wikipedia_url: 'https://en.wikipedia.org/wiki/Abyssinian_(cat)',
      weight: { imperial: '7 - 10', metric: '3 - 5' },
    },
  ],
};

export const mockImageDetailNoBreed: CatImageDetail = {
  id: 'abc2',
  url: 'https://cdn2.thecatapi.com/images/abc2.jpg',
  width: 600,
  height: 800,
  breeds: [],
};

export const handlers = [
  http.get(`${CAT_API_BASE}/images/search`, () =>
    HttpResponse.json(mockImages),
  ),

  http.get(`${CAT_API_BASE}/images/abc1`, () =>
    HttpResponse.json(mockImageDetail),
  ),

  http.get(`${CAT_API_BASE}/images/abc2`, () =>
    HttpResponse.json(mockImageDetailNoBreed),
  ),
];

