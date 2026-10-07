export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>AI Radar — a small demo of API-powered AI website discovery.</p>
        <p>
          Data from{' '}
          <a href="https://freeserp.ai/docs.php" target="_blank" rel="noopener noreferrer">
            FreeSERP
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          . Listings are automatically discovered and not endorsements.
        </p>
      </div>
    </footer>
  )
}
