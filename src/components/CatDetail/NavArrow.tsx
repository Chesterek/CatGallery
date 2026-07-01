export interface NavArrowProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
}

export const NavArrow = ({ direction, onClick, disabled }: NavArrowProps) => (
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
