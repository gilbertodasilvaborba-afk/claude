// API de Conversões do Meta (lado do servidor).
// O token NÃO fica no código: configure na Vercel em Settings → Environment Variables:
//   META_CAPI_TOKEN = token gerado no Gerenciador de Eventos
// Opcionais: META_PIXEL_ID (padrão abaixo), META_TEST_EVENT_CODE (para a aba "Testar eventos").
const PIXEL_ID = process.env.META_PIXEL_ID || '1137389055898462';
const API_VERSION = process.env.META_API_VERSION || 'v23.0';
const PERMITIDOS = new Set(['PageView', 'ViewContent', 'InitiateCheckout']);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Use POST' });
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return res.status(500).json({ erro: 'META_CAPI_TOKEN não configurado na Vercel' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const { event_name, event_id, event_source_url, fbp, fbc, custom_data } = body || {};
  if (!PERMITIDOS.has(event_name) || !event_id) return res.status(400).json({ erro: 'Evento inválido' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress;
  const evento = {
    event_name,
    event_id: String(event_id).slice(0, 64),
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: typeof event_source_url === 'string' ? event_source_url.slice(0, 500) : undefined,
    user_data: { client_ip_address: ip, client_user_agent: req.headers['user-agent'], fbp: fbp || undefined, fbc: fbc || undefined },
    custom_data: custom_data && typeof custom_data === 'object'
      ? { value: Number(custom_data.value) || undefined, currency: 'BRL', content_name: String(custom_data.content_name || '').slice(0, 100) || undefined }
      : undefined,
  };
  const payload = { data: [evento] };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const r = await fetch(`https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    const j = await r.json();
    return res.status(r.ok ? 200 : 502).json(r.ok ? { ok: true, recebidos: j.events_received } : { erro: j.error?.message || 'Falha no Meta' });
  } catch (e) {
    return res.status(502).json({ erro: 'Não foi possível falar com o Meta' });
  }
}
