// CORS proxy for adsb.lol military flights.
// GET /api/v2/mil -> https://api.adsb.lol/v2/mil
// Only this fixed upstream path is allowed; the proxy is not open.
const ALLOWED_ORIGIN = 'https://intoxicateddogwalker.github.io';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const upstream = await fetch('https://api.adsb.lol/v2/mil', {
      headers: { Accept: 'application/json' },
    });
    const body = await upstream.text();
    res.setHeader('Content-Type', 'application/json');
    return res.status(upstream.status).send(body);
  } catch (error) {
    return res.status(502).json({ error: 'Upstream fetch failed' });
  }
};
