import { useEffect } from "react";
import { Link } from "react-router-dom";

/** Not-found page for unknown routes, languages and slugs. */
function NotFoundPage() {
  useEffect(() => {
    document.title = "Page not found — Latvian Association of Darwin";
  }, []);

  return (
    <main id="main" className="notfound">
      <p className="code" aria-hidden="true">
        404
      </p>
      <h1>Page not found</h1>
      <p>
        The page you are looking for does not exist or has been moved. Check the address or head
        back to the homepage.
      </p>
      <Link to="/en" className="btn btn-gold">
        Back to homepage
      </Link>
    </main>
  );
}

export default NotFoundPage;
