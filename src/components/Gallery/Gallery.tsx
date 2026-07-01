import { useState } from 'react';
import { ColumnsPhotoAlbum } from 'react-photo-album';
import type { Photo, ClickHandlerProps } from 'react-photo-album';
import type { CatImage } from '../../types/cat.ts';
import CatDetailModal from '../CatDetail/CatDetailModal.tsx';
import { GALLERY_SPACING, GALLERY_COLUMNS, mapToPhotoAlbumPhotos } from "./galleryConfig.ts";
import { NoImages } from "./NoImages.tsx";
import 'react-photo-album/columns.css';

export interface CatPhoto extends Photo {
  catId: string;
}

interface GalleryProps {
  images: CatImage[];
}

const Gallery = ({ images }: GalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const photos = mapToPhotoAlbumPhotos(images);

  const handlePhotoClick = ({ photo }: ClickHandlerProps<CatPhoto>): void => {
    const index = images.findIndex((img) => img.id === photo.catId);

    setSelectedIndex(index);
  };

  const selectedCatId = selectedIndex !== null ? images[selectedIndex]?.id ?? null : null;

  if (!images) {
    return <NoImages />;
  }

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
