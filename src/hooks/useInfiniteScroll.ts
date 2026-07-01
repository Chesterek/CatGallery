import { useEffect, useRef } from 'react';

const SCROLL_THRESHOLD = 0.8; // trigger when 80% of page is scrolled

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const useInfiniteScroll = ({
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
}: UseInfiniteScrollOptions) => {
  const canFetch = useRef(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasNextPage || isFetchingNextPage || !canFetch.current) return;

      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;

      if (scrolled / total >= SCROLL_THRESHOLD) {
        canFetch.current = false;
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, hasNextPage, isFetchingNextPage]);

  // Re-enable fetching once the current fetch settles
  useEffect(() => {
    if (!isFetchingNextPage) {
      canFetch.current = true;
    }
  }, [isFetchingNextPage]);
};

