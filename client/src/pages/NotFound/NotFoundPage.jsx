import Button from '../../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="page-shell">
      <div className="container not-found">
        <span className="eyebrow">404</span>
        <h1>Page not found.</h1>
        <p>The page you are looking for may have moved or no longer exists.</p>
        <Button to="/">Back to home</Button>
      </div>
    </div>
  );
}
