import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server.ts';
import { CAT_API_BASE, mockImageDetail } from '../../test/mocks/handlers.ts';
import { renderWithProviders } from '../../test/utils/renderWithProviders.tsx';
import CatDetailModal from './CatDetailModal.tsx';

// ── Touch helpers ─────────────────────────────────────────────────────────────
// jsdom requires real Touch objects; plain objects cause react-remove-scroll to crash.
const makeTouch = (target: EventTarget, clientX: number): Touch =>
  new Touch({ identifier: Date.now(), target, clientX, clientY: 0, screenX: clientX, screenY: 0, pageX: clientX, pageY: 0, radiusX: 1, radiusY: 1, rotationAngle: 0, force: 1 });

const fireTouchStart = (el: Element, clientX: number) =>
  el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true, touches: [makeTouch(el, clientX)], changedTouches: [makeTouch(el, clientX)] }));

const fireTouchEnd = (el: Element, clientX: number) =>
  el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true, touches: [], changedTouches: [makeTouch(el, clientX)] }));

// ── Default props ─────────────────────────────────────────────────────────────

const defaultProps = {
  onClose: vi.fn(),
  onPrev: vi.fn(),
  onNext: vi.fn(),
  hasPrev: true,
  hasNext: true,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CatDetailModal', () => {
  it('renders nothing when catId is null', () => {
    renderWithProviders(<CatDetailModal {...defaultProps} catId={null} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows loading state while fetching', () => {
    server.use(
      http.get(`${CAT_API_BASE}/images/abc1`, async () => {
        await new Promise(() => {}); // never resolves
      }),
    );
    renderWithProviders(<CatDetailModal {...defaultProps} catId="abc1" />);
    expect(screen.getByText(/loading details/i)).toBeInTheDocument();
  });

  it('shows breed details after successful fetch', async () => {
    renderWithProviders(<CatDetailModal {...defaultProps} catId="abc1" />);
    await waitFor(() => screen.getByText('Abyssinian'));
    expect(screen.getByText('Abyssinian')).toBeInTheDocument();
    expect(screen.getByText('Egypt')).toBeInTheDocument();
    expect(screen.getByText(/14 - 15 years/i)).toBeInTheDocument();
    expect(screen.getByText(/3 - 5 kg/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /wikipedia/i })).toHaveAttribute(
      'href',
      mockImageDetail.breeds[0].wikipedia_url,
    );
  });

  it('shows "no breed info" message when breeds array is empty', async () => {
    renderWithProviders(<CatDetailModal {...defaultProps} catId="abc2" />);
    await waitFor(() => screen.getByText(/no breed information/i));
  });

  it('shows error state on API failure', async () => {
    server.use(
      http.get(`${CAT_API_BASE}/images/abc1`, () => HttpResponse.error()),
    );
    renderWithProviders(<CatDetailModal {...defaultProps} catId="abc1" />);
    await waitFor(() => screen.getByText(/failed to load details/i));
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    renderWithProviders(<CatDetailModal {...defaultProps} onClose={onClose} catId="abc1" />);
    await waitFor(() => screen.getByLabelText('Close'));
    await userEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onPrev when the Previous button is clicked', async () => {
    const onPrev = vi.fn();
    renderWithProviders(<CatDetailModal {...defaultProps} onPrev={onPrev} catId="abc1" />);
    await waitFor(() => screen.getByLabelText('Previous image'));
    await userEvent.click(screen.getByLabelText('Previous image'));
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('calls onNext when the Next button is clicked', async () => {
    const onNext = vi.fn();
    renderWithProviders(<CatDetailModal {...defaultProps} onNext={onNext} catId="abc1" />);
    await waitFor(() => screen.getByLabelText('Next image'));
    await userEvent.click(screen.getByLabelText('Next image'));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('Previous button is disabled when hasPrev is false', async () => {
    renderWithProviders(<CatDetailModal {...defaultProps} hasPrev={false} catId="abc1" />);
    await waitFor(() => screen.getByLabelText('Previous image'));
    expect(screen.getByLabelText('Previous image')).toBeDisabled();
  });

  it('Next button is disabled when hasNext is false', async () => {
    renderWithProviders(<CatDetailModal {...defaultProps} hasNext={false} catId="abc1" />);
    await waitFor(() => screen.getByLabelText('Next image'));
    expect(screen.getByLabelText('Next image')).toBeDisabled();
  });

  it('calls onPrev on ArrowLeft key press', () => {
    const onPrev = vi.fn();
    renderWithProviders(<CatDetailModal {...defaultProps} onPrev={onPrev} catId="abc1" />);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('calls onNext on ArrowRight key press', () => {
    const onNext = vi.fn();
    renderWithProviders(<CatDetailModal {...defaultProps} onNext={onNext} catId="abc1" />);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('does not call onPrev on ArrowLeft when hasPrev is false', () => {
    const onPrev = vi.fn();
    renderWithProviders(
      <CatDetailModal {...defaultProps} onPrev={onPrev} hasPrev={false} catId="abc1" />,
    );
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(onPrev).not.toHaveBeenCalled();
  });

  it('calls onNext on swipe left (touch)', async () => {
    const onNext = vi.fn();
    renderWithProviders(<CatDetailModal {...defaultProps} onNext={onNext} catId="abc1" />);
    const dialog = await screen.findByRole('dialog');
    fireTouchStart(dialog, 300);
    fireTouchEnd(dialog, 200); // delta = 100 > 50 → next
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('calls onPrev on swipe right (touch)', async () => {
    const onPrev = vi.fn();
    renderWithProviders(<CatDetailModal {...defaultProps} onPrev={onPrev} catId="abc1" />);
    const dialog = await screen.findByRole('dialog');
    fireTouchStart(dialog, 200);
    fireTouchEnd(dialog, 300); // delta = -100 < -50 → prev
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('does not navigate on swipe below threshold', async () => {
    const onNext = vi.fn();
    const onPrev = vi.fn();
    renderWithProviders(
      <CatDetailModal {...defaultProps} onNext={onNext} onPrev={onPrev} catId="abc1" />,
    );
    const dialog = await screen.findByRole('dialog');
    fireTouchStart(dialog, 300);
    fireTouchEnd(dialog, 275); // delta = 25 < 50 → nothing
    expect(onNext).not.toHaveBeenCalled();
    expect(onPrev).not.toHaveBeenCalled();
  });
});
