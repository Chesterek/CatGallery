import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mocks/server';
import { CAT_API_BASE, mockImages } from '../test/mocks/handlers';
import { useGetCatImages } from './useGetCatImages';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useGetCatImages', () => {
  it('returns cat images on success', async () => {
    const { result } = renderHook(() => useGetCatImages(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const flat = result.current.data?.pages.flat();
    expect(flat).toHaveLength(mockImages.length);
    expect(flat?.[0].id).toBe('abc1');
  });

  it('reports error state on failure', async () => {
    server.use(
      http.get(`${CAT_API_BASE}/images/search`, () => HttpResponse.error()),
    );

    const { result } = renderHook(() => useGetCatImages(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('does not have a next page when API returns fewer items than page size', async () => {
    server.use(
      http.get(`${CAT_API_BASE}/images/search`, () =>
        HttpResponse.json([mockImages[0]]), // only 1 item — less than PAGE_SIZE (30)
      ),
    );

    const { result } = renderHook(() => useGetCatImages(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(false);
  });
});

