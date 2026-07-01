import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from './useInfiniteScroll';

const triggerScroll = (scrollY: number, scrollHeight: number, innerHeight: number) => {
  Object.defineProperty(window, 'scrollY', { value: scrollY, writable: true });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: scrollHeight,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(window, 'innerHeight', { value: innerHeight, writable: true });
  window.dispatchEvent(new Event('scroll'));
};

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    // reset scroll position
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  it('calls onLoadMore when scrolled past 80% threshold', () => {
    const onLoadMore = vi.fn();

    renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasNextPage: true, isFetchingNextPage: false }),
    );

    act(() => {
      // 800 + 200 = 1000 / 1000 = 100% scroll — above 80%
      triggerScroll(800, 1000, 200);
    });

    expect(onLoadMore).toHaveBeenCalledOnce();
  });

  it('does not call onLoadMore when below 80% threshold', () => {
    const onLoadMore = vi.fn();

    renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasNextPage: true, isFetchingNextPage: false }),
    );

    act(() => {
      // 500 + 200 = 700 / 1000 = 70% — below threshold
      triggerScroll(500, 1000, 200);
    });

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('does not call onLoadMore when hasNextPage is false', () => {
    const onLoadMore = vi.fn();

    renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasNextPage: false, isFetchingNextPage: false }),
    );

    act(() => {
      triggerScroll(800, 1000, 200);
    });

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('does not call onLoadMore while a fetch is already in progress', () => {
    const onLoadMore = vi.fn();

    renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasNextPage: true, isFetchingNextPage: true }),
    );

    act(() => {
      triggerScroll(800, 1000, 200);
    });

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('does not call onLoadMore twice for consecutive scroll events', () => {
    const onLoadMore = vi.fn();

    renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasNextPage: true, isFetchingNextPage: false }),
    );

    act(() => {
      triggerScroll(800, 1000, 200);
      triggerScroll(850, 1000, 200);
    });

    expect(onLoadMore).toHaveBeenCalledOnce();
  });
});

