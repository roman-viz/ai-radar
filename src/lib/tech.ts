/**
 * Maps FreeSERP's `ai_source` value (a platform id, or `gen:<meta generator>`) to a display name.
 * Only platforms that have an icon in TechIcon are recognised; everything else is ignored
 * (e.g. `not_ai`, or generators that are just plugins such as "Site Kit by Google").
 */
const PLATFORMS: Record<string, string> = {
  nextjs: 'Next.js',
  wordpress: 'WordPress',
  drupal: 'Drupal',
  elementor: 'Elementor',
  docusaurus: 'Docusaurus',
  lovable: 'Lovable',
  v0: 'v0',
  bolt: 'Bolt',
  base44: 'Base44',
  ai_likely: 'Likely AI-built',
}

const GENERATORS: [RegExp, string][] = [
  [/^astro\b/, 'Astro'],
  [/^jekyll\b/, 'Jekyll'],
  [/^hubspot\b/, 'HubSpot'],
  [/^wordpress\b/, 'WordPress'],
  [/^drupal\b/, 'Drupal'],
]

export function resolveTech(source: string | null): string | null {
  if (!source) return null
  if (source.startsWith('gen:')) {
    const generator = source.slice(4).trim().toLowerCase()
    return GENERATORS.find(([re]) => re.test(generator))?.[1] ?? null
  }
  return PLATFORMS[source] ?? null
}
