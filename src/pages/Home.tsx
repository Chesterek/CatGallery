import { useMemo } from 'react';
import { useGetCatImages } from '../hooks/useGetCatImages';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import Gallery from '../components/Gallery';
import './Home.scss';

const Home = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCatImages();

  useInfiniteScroll({ onLoadMore: fetchNextPage, hasNextPage, isFetchingNextPage });

  const images = useMemo(
    () => data?.pages.flat() ?? [],
    [data],
  );

  if (isLoading) {
    return (
      <div className="home-status">
        <p>Loading cat images…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="home-status home-status--error">
        <p>Failed to load images: {error.message}</p>
      </div>
    );
  }

  return (
    <main className="home">
      <h1 className="home__title">🐱 Cat Gallery</h1>
      {images.length > 0 ? (
        <Gallery images={images} />
      ) : (
        <p className="home-status">No images found.</p>
      )}
      {isFetchingNextPage && (
        <p className="home__loading-more">Loading more cats…</p>
      )}
      {!hasNextPage && images.length > 0 && (
        <p className="home__end-message">You've seen all the cats! 🐾</p>
      )}
    </main>
  );
};

export default Home;
