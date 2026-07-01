import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mocks/server';
import { CAT_API_BASE, mockImages } from '../test/mocks/handlers';
import { renderWithProviders } from '../test/utils/renderWithProviders';
import Home from './Home';

describe('Home', () => {
  it('shows loading state initially', () => {
    server.use(
      http.get(`${CAT_API_BASE}/images/search`, async () => {
        await new Promise(() => {}); // never resolves → stays in loading
      }),
    );

    renderWithProviders(<Home />);
    expect(screen.getByText(/loading cat images/i)).toBeInTheDocument();
  });

  it('renders the gallery container after images are loaded', async () => {
    renderWithProviders(<Home />);

    // react-photo-album renders a role="group" once data arrives
    await waitFor(() => screen.getByRole('group', { name: /photo album/i }));
    expect(screen.getByRole('group', { name: /photo album/i })).toBeInTheDocument();
  });

  it('displays the page title', async () => {
    renderWithProviders(<Home />);
    await waitFor(() => screen.getByRole('heading', { name: /cat gallery/i }));
    expect(screen.getByRole('heading', { name: /cat gallery/i })).toBeInTheDocument();
  });

  it('shows error message when the API fails', async () => {
    server.use(
      http.get(`${CAT_API_BASE}/images/search`, () => HttpResponse.error()),
    );

    renderWithProviders(<Home />);

    await waitFor(() =>
      screen.getByText(/failed to load images/i),
    );
  });

  it('shows end-of-list message when no next page available', async () => {
    // Return fewer items than PAGE_SIZE so hasNextPage = false
    server.use(
      http.get(`${CAT_API_BASE}/images/search`, () =>
        HttpResponse.json([mockImages[0]]),
      ),
    );

    renderWithProviders(<Home />);

    await waitFor(() =>
      screen.getByText(/you've seen all the cats/i),
    );
  });
});

