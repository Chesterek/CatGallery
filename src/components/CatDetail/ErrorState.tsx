interface ErrorStateProps {
  message: string;
}

export const ErrorState = ({ message }: ErrorStateProps) => (
  <p className="cat-modal__status cat-modal__status--error">
    Failed to load details: {message}
  </p>
);

