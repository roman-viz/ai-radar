<?php
/**
 * Minimal, non-open proxy for the FreeSERP API.
 *
 * Why it exists: FreeSERP sends a duplicated `Access-Control-Allow-Origin: *, *` header,
 * which browsers reject, so the API cannot be called directly from client-side JavaScript.
 *
 * It only ever queries `index=sites&ai_startups=1` on freeserp.ai, accepts a strict
 * allow-list of parameters and validates every value.
 */

declare(strict_types=1);

const UPSTREAM = 'https://freeserp.ai/api.php';
const CATEGORIES = [
    'AI Agents & Autonomous', 'Code & Dev Tools', 'AI Infrastructure & API', 'AI Automation & Workflows',
    'LLM & Prompt Tools', 'AI Search & Answers', 'AI Website Builder', 'No-code / App Builder',
    'Image Generation', 'Video Generation', 'Voice & Text-to-Speech', 'Data & Analytics',
    'Research & Science', 'Design & UI', 'Chatbot & Assistant',
];
const SORTS = ['relevance', 'dr', 'went_live', 'domain'];

function respond(int $status, array $body, ?string $cache = null): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: ' . ($cache ?? 'no-store'));
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function intParam(string $name, int $default, int $min, int $max): int
{
    if (!isset($_GET[$name])) {
        return $default;
    }
    $raw = $_GET[$name];
    if (!is_string($raw) || !preg_match('/^\d{1,6}$/', $raw)) {
        respond(400, ['ok' => false, 'error' => "Invalid '$name'"]);
    }
    $value = (int) $raw;
    if ($value < $min || $value > $max) {
        respond(400, ['ok' => false, 'error' => "'$name' out of range"]);
    }
    return $value;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET');
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

// Fixed by the application: FreeSERP Main, genuine AI products only.
$params = ['index' => 'sites', 'ai_startups' => '1'];

$params['size'] = (string) intParam('size', 24, 1, 100);
$params['from'] = (string) intParam('from', 0, 0, 10000);

if (isset($_GET['q'])) {
    $q = $_GET['q'];
    if (!is_string($q) || mb_strlen($q) > 100) {
        respond(400, ['ok' => false, 'error' => "Invalid 'q'"]);
    }
    $q = trim($q);
    if ($q !== '') {
        $params['q'] = $q;
    }
}

if (isset($_GET['ai_categories'])) {
    if (!is_string($_GET['ai_categories']) || !in_array($_GET['ai_categories'], CATEGORIES, true)) {
        respond(400, ['ok' => false, 'error' => "Invalid 'ai_categories'"]);
    }
    $params['ai_categories'] = $_GET['ai_categories'];
}

$drMin = intParam('dr_min', 0, 0, 100);
if ($drMin > 0) {
    $params['dr_min'] = (string) $drMin;
}

$sort = $_GET['sort'] ?? 'relevance';
if (!is_string($sort) || !in_array($sort, SORTS, true)) {
    respond(400, ['ok' => false, 'error' => "Invalid 'sort'"]);
}
$params['sort'] = $sort;

if ($sort !== 'relevance') {
    $order = $_GET['order'] ?? 'desc';
    if (!is_string($order) || !in_array($order, ['asc', 'desc'], true)) {
        respond(400, ['ok' => false, 'error' => "Invalid 'order'"]);
    }
    $params['order'] = $order;
}

// Identify the application to FreeSERP, as their docs ask.
$params['agent'] = 'AI-Radar-demo';
$params['website'] = 'https://ws-99.ws.semalt.dev';

$ch = curl_init(UPSTREAM . '?' . http_build_query($params, '', '&', PHP_QUERY_RFC3986));
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 12,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
    CURLOPT_HTTPHEADER => ['Accept: application/json'],
    CURLOPT_USERAGENT => 'AI-Radar-demo/1.0 (+https://ws-99.ws.semalt.dev)',
]);
$body = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($body === false || $status !== 200) {
    error_log("[ai-radar] FreeSERP upstream failure: status=$status error=$error");
    respond(502, ['ok' => false, 'error' => 'Upstream request failed']);
}

$decoded = json_decode($body, true);
if (!is_array($decoded) || !isset($decoded['results']) || !is_array($decoded['results'])) {
    error_log('[ai-radar] FreeSERP returned an unexpected payload');
    respond(502, ['ok' => false, 'error' => 'Upstream returned an unexpected response']);
}

http_response_code(200);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=30');
echo $body;
