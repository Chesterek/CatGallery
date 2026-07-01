import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mocks/server';
import { CAT_API_BASE, mockImages } from '../test/mocks/handlers';
import { renderWithProviders } from '../test/utils/renderWithProviders';
import Gallery from './Gallery';

// ── Mock react-photo-album ────────────────────────────────────────────────────
// react-photo-album requires a real layout engine to render images (ResizeObserver
// + actual element dimensions). We mock it so Gallery tests stay focused on our logic.
vi.mock('react-photo-album', () => ({
  ColumnsPhotoAlbum: ({ photos, onClick }: {
    photos: Array<{ src: string; alt?: string; catId: string }>;
    onClick: (args: { photo: { src: string; catId: string } }) => void;
  }) => (
    <div role="group" aria-label="Photo album">
      {photos.map((photo) => (
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt ?? ''}
          onClick={() => onClick({ photo })}
        />
      ))}
    </div>
  ),
}));

describe('Gallery', () => {
  it('renders all images from the provided list', () => {
    renderWithProviders(<Gallery images={mockImages} />);
    const imgs = screen.getAllByRole('img');
    expect(imgs).toHaveLength(mockImages.length);
  });

  it('each image has the correct src', () => {
    renderWithProviders(<Gallery images={mockImages} />);
    mockImages.forEach((img, i) => {
      expect(screen.getAllByRole('img')[i]).toHaveAttribute('src', img.url);
    });
  });

  it('logs the cat id to console when an image is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    renderWithProviders(<Gallery images={mockImages} />);

    await userEvent.click(screen.getAllByRole('img')[0]);

    expect(consoleSpy).toHaveBeenCalledWith(mockImages[0].id);
    consoleSpy.mockRestore();
  });

  it('opens the modal when an image is clicked', async () => {
    server.use(
      http.get(`${CAT_API_BASE}/images/abc1`, () =>
        HttpResponse.json({ id: 'abc1', url: mockImages[0].url, width: 800, height: 600, breeds: [] }),
      ),
    );
    renderWithProviders(<Gallery images={mockImages} />);
    await userEvent.click(screen.getAllByRole('img')[0]);

    await waitFor(() => screen.getByRole('dialog'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('Previous button is disabled on the first image', async () => {
    server.use(
      http.get(`${CAT_API_BASE}/images/abc1`, () =>
        HttpResponse.json({ id: 'abc1', url: mockImages[0].url, width: 800, height: 600, breeds: [] }),
      ),
    );
    renderWithProviders(<Gallery images={mockImages} />);
    await userEvent.click(screen.getAllByRole('img')[0]);

    await waitFor(() => screen.getByLabelText('Previous image'));
    expect(screen.getByLabelText('Previous image')).toBeDisabled();
    expect(screen.getByLabelText('Next image')).toBeEnabled();
  });

  it('Next button is disabled on the last image', async () => {
    server.use(
      http.get(`${CAT_API_BASE}/images/abc3`, () =>
        HttpResponse.json({ id: 'abc3', url: mockImages[2].url, width: 1024, height: 768, breeds: [] }),
      ),
    );
    renderWithProviders(<Gallery images={mockImages} />);
    const imgs = screen.getAllByRole('img');
    await userEvent.click(imgs[imgs.length - 1]);

    await waitFor(() => screen.getByLabelText('Next image'));
    expect(screen.getByLabelText('Next image')).toBeDisabled();
    expect(screen.getByLabelText('Previous image')).toBeEnabled();
  });
});
