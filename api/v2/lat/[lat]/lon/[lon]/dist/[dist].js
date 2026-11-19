// CORS proxy for adsb.lol flights around a point.
// GET /api/v2/lat/{lat}/lon/{lon}/dist/{dist} -> https://api.adsb.lol/v2/lat/{lat}/lon/{lon}/dist/{dist}
// Only numeric lat/lon/dist values are allowed; the proxy is not open.
const ALLOWED_ORIGIN = 'https://intoxicateddogwalker.github.io';
const NUMERIC = /^-?\d+(\.\d+)?$/;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { lat, lon, dist } = req.query || {};
  if (!NUMERIC.test(String(lat)) || !NUMERIC.test(String(lon)) || !NUMERIC.test(String(dist))) {
    return res.status(400).json({ error: 'lat, lon and dist must be numeric' });
  }
  const latNum = Number(lat);
  const lonNum = Number(lon);
  const distNum = Number(dist);
  if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180 || distNum <= 0 || distNum > 250) {
    return res.status(400).json({ error: 'lat, lon or dist out of range' });
  }
  try {
    const upstream = await fetch(
      `https://api.adsb.lol/v2/lat/${lat}/lon/${lon}/dist/${dist}`,
      { headers: { Accept: 'application/json' } },
    );
    const body = await upstream.text();
    res.setHeader('Content-Type', 'application/json');
    return res.status(upstream.status).send(body);
  } catch (error) {
    return res.status(502).json({ error: 'Upstream fetch failed' });
  }
};
