import * as Dialog from '@radix-ui/react-dialog';
import { useGetCatImageById } from '../hooks/useGetCatImageById';
import './CatDetailModal.css';

// ─── Component Props ──────────────────────────────────────────────────────────

interface CatDetailModalProps {
  catId: string | null;
  onClose: () => void;
}

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

// ─── Component ───────────────────────────────────────────────────────────────

const CatDetailModal = ({ catId, onClose }: CatDetailModalProps) => {
  const { data, isLoading, isError, error } = useGetCatImageById(catId);

  const breed = data?.breeds?.[0] ?? null;

  return (
    <Dialog.Root open={!!catId} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="cat-modal__overlay" />
        <Dialog.Content className="cat-modal__content">

          {/* Close button */}
          <Dialog.Close className="cat-modal__close" aria-label="Close">
            ✕
          </Dialog.Close>

          {/* Cat image */}
          {data?.url && (
            <div className="cat-modal__image-wrapper">
              <img
                src={data.url}
                alt={breed?.name ?? 'Cat'}
                className="cat-modal__image"
              />
            </div>
          )}

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

