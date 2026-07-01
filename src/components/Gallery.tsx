import { useState } from 'react';
import { ColumnsPhotoAlbum } from 'react-photo-album';
import type { Photo, ClickHandlerProps } from 'react-photo-album';
import 'react-photo-album/columns.css';
import type { CatImage } from '../types/cat';
import CatDetailModal from './CatDetailModal';

// ─── Extended Photo Type ──────────────────────────────────────────────────────

interface CatPhoto extends Photo {
  catId: string;
}

// ─── Component Props ──────────────────────────────────────────────────────────

interface GalleryProps {
  images: CatImage[];
}

// ─── Gallery Configuration ────────────────────────────────────────────────────

const GALLERY_SPACING = 8;

const GALLERY_COLUMNS = (containerWidth: number): number => {
  if (containerWidth < 600) return 1;
  if (containerWidth < 900) return 2;
  return 3;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mapToPhotoAlbumPhotos = (images: CatImage[]): CatPhoto[] =>
  images.map((img) => ({
    src: img.url,
    width: img.width,
    height: img.height,
    catId: img.id,
    alt: `Cat ${img.id}`,
  }));

// ─── Component ───────────────────────────────────────────────────────────────

const Gallery = ({ images }: GalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const photos = mapToPhotoAlbumPhotos(images);

  const handlePhotoClick = ({ photo }: ClickHandlerProps<CatPhoto>): void => {
    const index = images.findIndex((img) => img.id === photo.catId);
    console.log(photo.catId);
    setSelectedIndex(index);
  };

  const selectedCatId = selectedIndex !== null ? images[selectedIndex]?.id ?? null : null;

  return (
    <>
      <div className="gallery-container">
        <ColumnsPhotoAlbum<CatPhoto>
          photos={photos}
          spacing={GALLERY_SPACING}
          columns={GALLERY_COLUMNS}
          onClick={handlePhotoClick}
        />
      </div>

      <CatDetailModal
        catId={selectedCatId}
        onClose={() => setSelectedIndex(null)}
        hasPrev={selectedIndex !== null && selectedIndex > 0}
        hasNext={selectedIndex !== null && selectedIndex < images.length - 1}
        onPrev={() => setSelectedIndex((i) => (i !== null ? i - 1 : i))}
        onNext={() => setSelectedIndex((i) => (i !== null ? i + 1 : i))}
      />
    </>
  );
};

export default Gallery;
