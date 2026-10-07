const UPSTREAM = 'https://freeserp.ai/api.php'

const CATEGORIES = [
  'AI Agents & Autonomous',
  'Code & Dev Tools',
  'AI Infrastructure & API',
  'AI Automation & Workflows',
  'LLM & Prompt Tools',
  'AI Search & Answers',
  'AI Website Builder',
  'No-code / App Builder',
  'Image Generation',
  'Video Generation',
  'Voice & Text-to-Speech',
  'Data & Analytics',
  'Research & Science',
  'Design & UI',
  'Chatbot & Assistant',
]

const SORTS = ['relevance', 'dr', 'went_live', 'domain']

function json(status: number, body: Record<string, unknown>, cache = 'no-store'): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Cache-Control': cache,
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

function intParam(params: URLSearchParams, name: string, fallback: number, min: number, max: number): number {
  const raw = params.get(name)
  if (raw === null) return fallback
  if (!/^\d{1,6}$/.test(raw)) throw new Error(`Invalid '${name}'`)

  const value = Number(raw)
  if (value < min || value > max) throw new Error(`'${name}' out of range`)
  return value
}

export const config = { runtime: 'edge' }

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { Allow: 'GET', 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  const incoming = new URL(request.url).searchParams
  const params = new URLSearchParams({
    index: 'sites',
    ai_startups: '1',
    agent: 'AI-Radar',
  })

  try {
    params.set('size', String(intParam(incoming, 'size', 24, 1, 100)))
    params.set('from', String(intParam(incoming, 'from', 0, 0, 10000)))

    const query = incoming.get('q')
    if (query !== null) {
      if ([...query].length > 100) return json(400, { ok: false, error: "Invalid 'q'" })
      if (query.trim()) params.set('q', query.trim())
    }

    const category = incoming.get('ai_categories')
    if (category !== null) {
      if (!CATEGORIES.includes(category)) return json(400, { ok: false, error: "Invalid 'ai_categories'" })
      params.set('ai_categories', category)
    }

    const drMin = intParam(incoming, 'dr_min', 0, 0, 100)
    if (drMin > 0) params.set('dr_min', String(drMin))

    const sort = incoming.get('sort') ?? 'relevance'
    if (!SORTS.includes(sort)) return json(400, { ok: false, error: "Invalid 'sort'" })
    params.set('sort', sort)

    if (sort !== 'relevance') {
      const order = incoming.get('order') ?? 'desc'
      if (order !== 'asc' && order !== 'desc') return json(400, { ok: false, error: "Invalid 'order'" })
      params.set('order', order)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request parameters'
    return json(400, { ok: false, error: message })
  }

  let upstream: Response
  try {
    upstream = await fetch(`${UPSTREAM}?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'AI-Radar/1.0',
      },
      signal: AbortSignal.timeout(12_000),
    })
  } catch (error) {
    console.error('[ai-radar] FreeSERP upstream request failed', error)
    return json(502, { ok: false, error: 'Upstream request failed' })
  }

  if (!upstream.ok) {
    console.error(`[ai-radar] FreeSERP upstream failure: status=${upstream.status}`)
    return json(502, { ok: false, error: 'Upstream request failed' })
  }

  let body: unknown
  try {
    body = await upstream.json()
  } catch (error) {
    console.error('[ai-radar] FreeSERP returned invalid JSON', error)
    return json(502, { ok: false, error: 'Upstream returned an unexpected response' })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('results' in body) ||
    !Array.isArray(body.results)
  ) {
    console.error('[ai-radar] FreeSERP returned an unexpected payload')
    return json(502, { ok: false, error: 'Upstream returned an unexpected response' })
  }

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=30',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
