import { useGetCatImages } from '../hooks/useGetCatImages';
import Gallery from '../components/Gallery';
import './Home.css';

const Home = () => {
  const { data: images, isLoading, isError, error } = useGetCatImages(30);

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
      {images && images.length > 0 ? (
        <Gallery images={images} />
      ) : (
        <p className="home-status">No images found.</p>
      )}
    </main>
  );
};

export default Home;

