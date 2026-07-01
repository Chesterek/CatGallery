import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mocks/server';
import { CAT_API_BASE, mockImageDetail } from '../test/mocks/handlers';
import { useGetCatImageById } from './useGetCatImageById';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useGetCatImageById', () => {
  it('fetches and returns image detail for a valid id', async () => {
    const { result } = renderHook(() => useGetCatImageById('abc1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockImageDetail);
    expect(result.current.data?.breeds[0].name).toBe('Abyssinian');
  });

  it('does not fetch when id is null', () => {
    const { result } = renderHook(() => useGetCatImageById(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('reports error on API failure', async () => {
    server.use(
      http.get(`${CAT_API_BASE}/images/abc1`, () => HttpResponse.error()),
    );

    const { result } = renderHook(() => useGetCatImageById('abc1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

