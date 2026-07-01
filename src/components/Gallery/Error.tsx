interface ErrorPageProps {
	error: Error;
}

export const ErrorPage = ({ error }: ErrorPageProps) => {
	return (
		<div className="home-status home-status--error">
			<p>Failed to load images: {error.message}</p>
		</div>
	);
}