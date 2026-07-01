import * as Dialog from '@radix-ui/react-dialog';
import { useGetCatImageById } from '../../hooks/useGetCatImageById.ts';
import { useEffect, useRef } from 'react';
import { LoadingState } from "./LoadingState.tsx";
import { ErrorState } from "./ErrorState.tsx";
import { NoBreedInfo } from "./NoBreedInfo.tsx";
import { NavArrow } from './NavArrow.tsx';
import './CatDetailModal.scss';

interface CatDetailModalProps {
  catId: string | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const SWIPE_THRESHOLD = 50; // px


const CatDetailModal = ({ catId, onClose, onPrev, onNext, hasPrev, hasNext }: CatDetailModalProps) => {
  const { data, isLoading, isError, error } = useGetCatImageById(catId);

  const breed = data?.breeds?.[0] ?? null;

  useEffect(() => {
    if (!catId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [catId, hasPrev, hasNext, onPrev, onNext]);

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
          <Dialog.Close className="cat-modal__close" aria-label="Close">
            ✕
          </Dialog.Close>

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
