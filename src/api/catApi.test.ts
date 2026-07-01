import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mocks/server';
import { CAT_API_BASE, mockImages, mockImageDetail } from '../test/mocks/handlers';
import { fetchCatImages, fetchCatImageById } from './catApi';

describe('fetchCatImages', () => {
  it('returns an array of cat images', async () => {
    const result = await fetchCatImages();
    expect(result).toEqual(mockImages);
  });

  it('forwards limit and page params to the API', async () => {
    let capturedParams: URLSearchParams | null = null;

    server.use(
      http.get(`${CAT_API_BASE}/images/search`, ({ request }) => {
        capturedParams = new URL(request.url).searchParams;
        return HttpResponse.json([]);
      }),
    );

    await fetchCatImages(10, 2);

    expect(capturedParams!.get('limit')).toBe('10');
    expect(capturedParams!.get('page')).toBe('2');
  });

  it('throws on network error', async () => {
    server.use(
      http.get(`${CAT_API_BASE}/images/search`, () => HttpResponse.error()),
    );
    await expect(fetchCatImages()).rejects.toThrow();
  });
});

describe('fetchCatImageById', () => {
  it('returns cat image detail for a given id', async () => {
    const result = await fetchCatImageById('abc1');
    expect(result).toEqual(mockImageDetail);
    expect(result.breeds[0].name).toBe('Abyssinian');
  });

  it('throws on network error', async () => {
    server.use(
      http.get(`${CAT_API_BASE}/images/abc1`, () => HttpResponse.error()),
    );
    await expect(fetchCatImageById('abc1')).rejects.toThrow();
  });
});

