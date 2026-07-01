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
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  const photos = mapToPhotoAlbumPhotos(images);

  const handlePhotoClick = ({ photo }: ClickHandlerProps<CatPhoto>): void => {
    console.log(photo.catId);
    setSelectedCatId(photo.catId);
  };

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
        onClose={() => setSelectedCatId(null)}
      />
    </>
  );
};

export default Gallery;
