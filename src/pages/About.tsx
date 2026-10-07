export function About() {
  return (
    <div className="container about">
      <p className="eyebrow">About</p>
      <h1>A radar for the AI web.</h1>
      <p className="lead">
        AI Radar is a small discovery catalog for AI websites and tools. It turns a very large, constantly changing
        index of the web into something you can actually browse.
      </p>

      <section aria-labelledby="what">
        <h2 id="what">What you can do</h2>
        <ul className="about-list">
          <li>
            <strong>Search</strong> by name, topic or domain across AI sites. Results load 24 at a time with “Load more”.
          </li>
          <li>
            <strong>Filter</strong> by AI category and minimum Domain Rating, and <strong>sort</strong> by best match,
            authority, recency or domain name.
          </li>
          <li>
            <strong>Share a search.</strong> The address bar updates as you search, filter and sort, so a refresh, the
            Back and Forward buttons, or a copied link all bring back the same view.
          </li>
          <li>
            <strong>Inspect</strong> a site’s summary and facts, then <strong>visit</strong> the original website. When
            FreeSERP detects the platform behind a site (such as Next.js or WordPress) a small icon shows it.
          </li>
          <li>
            <strong>Save favorites</strong> with the star on any card. They are kept locally in your browser and listed
            on the Favorites page.
          </li>
          <li>
            <strong>Search, filter and sort your favorites</strong> with the same controls as Explore, by saved
            category, Domain Rating, recency or domain name. This works locally and needs no FreeSERP request.
          </li>
          <li>
            <strong>Export favorites</strong> as a JSON or CSV file. The export always includes every saved site, even
            while a filter is active.
          </li>
          <li>
            <strong>Switch theme</strong> between light and dark. By default AI Radar follows your system setting.
          </li>
        </ul>
      </section>

      <section aria-labelledby="data">
        <h2 id="data">Where the data comes from</h2>
        <p>
          Every listing is discovered live through the public{' '}
          <a href="https://freeserp.ai/docs.php" target="_blank" rel="noopener noreferrer">
            FreeSERP API
            <span className="sr-only"> (opens in a new tab)</span>
          </a>{' '}
          — no API key, no sign-up, and no local database. AI Radar queries the <code>sites</code> index restricted to AI
          products, so on Explore, search, filters and sorting are all answered by FreeSERP itself. Requests pass through a
          same-origin API relay because FreeSERP’s duplicated CORS header stops browsers from calling it directly; the
          relay only forwards validated search parameters.
        </p>
        <p>
          Summaries are written automatically from each homepage. “Domain Rating” is FreeSERP’s 0–100 authority
          estimate, and “Recently live” reflects when FreeSERP first confirmed a site reachable — not necessarily its
          launch date.
        </p>
      </section>

      <section aria-labelledby="privacy">
        <h2 id="privacy">Your data stays in your browser</h2>
        <p>
          There are no accounts. Favorites and your theme choice are stored only in this browser’s local storage and
          are never sent to a server, and exports are generated in your browser too. A favorite keeps a copy of the site’s details, so it still appears when you are
          offline from FreeSERP, and that copy is refreshed whenever newer data for the same site loads. Site icons are
          loaded from Google’s favicon service.
        </p>
      </section>

      <section aria-labelledby="about-ai-radar">
        <h2 id="about-ai-radar">About AI Radar</h2>
        <p>
          AI Radar helps you discover AI websites and tools. Listings are automatically generated and are not
          endorsements, so check any tool before relying on it.
        </p>
        <a className="btn btn-primary" href="#/">
          Start exploring
        </a>
      </section>
    </div>
  )
}
