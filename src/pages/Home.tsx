import { useMemo } from 'react';
import { useGetCatImages } from '../hooks/useGetCatImages';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import Gallery from '../components/Gallery/Gallery.tsx';
import { Loading } from "../components/Gallery/Loading.tsx";
import { ErrorPage } from "../components/Gallery/Error.tsx";
import {LoadingMoreCats} from "../components/Gallery/LoadingMoreCats.tsx";
import {AllCatsSeen} from "../components/Gallery/AllCatsSeen.tsx";
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
    return <Loading />;
  }

  if (isError) {
    return <ErrorPage error={error} />;
  }

  return (
    <main className="home">
      <h1 className="home__title">🐱 Cat Gallery</h1>
      <Gallery images={images} />

      {isFetchingNextPage && <LoadingMoreCats />}

      {!hasNextPage && images.length > 0 && (<AllCatsSeen />)}
    </main>
  );
};

export default Home;
