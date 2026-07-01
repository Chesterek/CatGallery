import * as Dialog from '@radix-ui/react-dialog';
import { useGetCatImageById } from '../hooks/useGetCatImageById';
import './CatDetailModal.scss';
import { useEffect, useRef } from 'react';

// ─── Component Props ──────────────────────────────────────────────────────────

interface CatDetailModalProps {
  catId: string | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SWIPE_THRESHOLD = 50; // px

// ─── Sub-components ───────────────────────────────────────────────────────────

const LoadingState = () => (
  <p className="cat-modal__status">Loading details…</p>
);

const ErrorState = ({ message }: { message: string }) => (
  <p className="cat-modal__status cat-modal__status--error">
    Failed to load details: {message}
  </p>
);

const NoBreedInfo = () => (
  <p className="cat-modal__status">No breed information available for this cat.</p>
);

// ─── Arrow button ─────────────────────────────────────────────────────────────

interface NavArrowProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
}

const NavArrow = ({ direction, onClick, disabled }: NavArrowProps) => (
  <button
    className={`cat-modal__nav cat-modal__nav--${direction}`}
    onClick={onClick}
    disabled={disabled}
    aria-label={direction === 'prev' ? 'Previous image' : 'Next image'}
  >
    {direction === 'prev' ? (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    )}
  </button>
);

// ─── Component ───────────────────────────────────────────────────────────────

const CatDetailModal = ({ catId, onClose, onPrev, onNext, hasPrev, hasNext }: CatDetailModalProps) => {
  const { data, isLoading, isError, error } = useGetCatImageById(catId);

  const breed = data?.breeds?.[0] ?? null;

  // ── Keyboard navigation ──────────────────────────────────────────────────
  useEffect(() => {
    if (!catId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [catId, hasPrev, hasNext, onPrev, onNext]);

  // ── Touch / swipe ────────────────────────────────────────────────────────
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;

    if (delta > SWIPE_THRESHOLD && hasNext) onNext();
    if (delta < -SWIPE_THRESHOLD && hasPrev) onPrev();
  };

  return (
    <Dialog.Root open={!!catId} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="cat-modal__overlay" />
        <Dialog.Content
          className="cat-modal__content"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >

          {/* Close button */}
          <Dialog.Close className="cat-modal__close" aria-label="Close">
            ✕
          </Dialog.Close>

          {/* Cat image + nav arrows */}
          <div className="cat-modal__image-section">
            <NavArrow direction="prev" onClick={onPrev} disabled={!hasPrev} />

            {data?.url && (
              <div className="cat-modal__image-wrapper">
                <img
                  src={data.url}
                  alt={breed?.name ?? 'Cat'}
                  className="cat-modal__image"
                />
              </div>
            )}

            <NavArrow direction="next" onClick={onNext} disabled={!hasNext} />
          </div>

          {/* Body */}
          <div className="cat-modal__body">
            {isLoading && <LoadingState />}
            {isError && <ErrorState message={error.message} />}

            {!isLoading && !isError && !breed && data && <NoBreedInfo />}

            {breed && (
              <>
                <Dialog.Title className="cat-modal__title">
                  {breed.name}
                </Dialog.Title>

                <dl className="cat-modal__details">
                  <div className="cat-modal__detail-row">
                    <dt>Origin</dt>
                    <dd>{breed.origin}</dd>
                  </div>
                  <div className="cat-modal__detail-row">
                    <dt>Life span</dt>
                    <dd>{breed.life_span} years</dd>
                  </div>
                  <div className="cat-modal__detail-row">
                    <dt>Weight (metric)</dt>
                    <dd>{breed.weight.metric} kg</dd>
                  </div>
                  {breed.wikipedia_url && (
                    <div className="cat-modal__detail-row">
                      <dt>Wikipedia</dt>
                      <dd>
                        <a
                          href={breed.wikipedia_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cat-modal__link"
                        >
                          Read on Wikipedia ↗
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </>
            )}
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CatDetailModal;
