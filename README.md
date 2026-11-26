# adsb-lol-proxy

Free Vercel serverless CORS proxy for adsb.lol, used by God's Eye View live
flights. It forwards exactly two fixed upstream paths and nothing else — it
is not an open proxy.

## Endpoints

When deployed on Vercel, the rewrites in `vercel.json` map `/v2/:path*` to
the functions under `api/`:

- `GET /v2/mil` — military flights.
  Forwards to `https://api.adsb.lol/v2/mil`.
- `GET /v2/lat/{lat}/lon/{lon}/dist/{dist}` — flights around a point.
  Forwards to the same path on `https://api.adsb.lol`. `lat`, `lon` and
  `dist` must be numeric; latitude must be within −90…90, longitude within
  −180…180, and distance greater than 0 and no more than 250. Anything
  else gets a `400`.

## Rules

- `GET` and `OPTIONS` only. Other methods get `405`.
- Responses are `no-store` with `Content-Type: application/json`.
- `Access-Control-Allow-Origin` is fixed to
  `https://intoxicateddogwalker.github.io` (the God's Eye View site). No
  other origin is allowed.
- Upstream failures get `502` with `{"error": "Upstream fetch failed"}`.

## Deploy

A plain Vercel project: no build step, no environment variables. Import
the repo in Vercel and deploy. The endpoints are plain Node.js serverless
functions under `api/`.

## Files

- `api/v2/mil.js` — the military-flights endpoint.
- `api/v2/lat/[lat]/lon/[lon]/dist/[dist].js` — the around-a-point endpoint.
- `vercel.json` — rewrites `/v2/:path*` to `/api/v2/:path*`.
