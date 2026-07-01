import type { CatImage } from "../../types/cat.ts";
import type { CatPhoto } from "./Gallery.tsx";

export const GALLERY_SPACING = 8;

export const GALLERY_COLUMNS = (containerWidth: number): number => {
	if (containerWidth < 600) return 1;
	if (containerWidth < 900) return 2;
	return 3;
};

export const mapToPhotoAlbumPhotos = (images: CatImage[]): CatPhoto[] =>
	images.map((img) => ({
		src: img.url,
		width: img.width,
		height: img.height,
		catId: img.id,
		alt: `Cat ${img.id}`,
	}));