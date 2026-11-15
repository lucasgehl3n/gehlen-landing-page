// Contador permanente de cafés. Um clique por pessoa (cookie + IP com hash).
// Persistência: Vercel Blob (Hobby free). O Redis free do Marketplace não persiste dados.
import { createHash, randomUUID } from 'node:crypto';
import {
  get,
  put,
  BlobNotFoundError,
  BlobPreconditionFailedError,
} from '@vercel/blob';

const COUNT_PATH = 'cafe/count.json';
const visitorPath = (h) => `cafe/visitor/${h}.json`;
const ratePath = (h) => `cafe/rate/${h}.json`;
const COOKIE = 'lg_cafe';
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 8;
const ACCESS = 'private';

const mem = globalThis.__cafeMem ||= { count: 0, visitors: new Set(), rates: new Map() };
const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const salt = () => process.env.CAFE_IP_SALT || 'dev-only-salt-change-me';

function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.trim()) return xf.split(',')[0].trim();
  if (Array.isArray(xf) && xf[0]) return String(xf[0]).split(',')[0].trim();
  const real = req.headers['x-real-ip'];
  if (real) return String(real).trim();
  return req.socket?.remoteAddress || '0.0.0.0';
}

function hashIp(ip) {
  return createHash('sha256').update(`${salt()}|${ip}`).digest('hex');
}

function hasCookie(req) {
  const raw = req.headers.cookie || '';
  return raw.split(';').some((p) => p.trim().startsWith(`${COOKIE}=`));
}

function setOfferedCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=1; Max-Age=31536000; Path=/; SameSite=Lax; Secure`);
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readJson(pathname) {
  const r = await get(pathname, { access: ACCESS, useCache: false });
  if (!r || r.statusCode !== 200 || !r.stream) return null;
  const text = await new Response(r.stream).text();
  try {
    return { data: JSON.parse(text || '{}'), etag: r.blob.etag };
  } catch {
    return { data: {}, etag: r.blob.etag };
  }
}

async function putJson(pathname, data, { etag, overwrite } = {}) {
  const body = JSON.stringify(data);
  const opts = {
    access: ACCESS,
    contentType: 'application/json',
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
  };
  if (etag) return put(pathname, body, { ...opts, allowOverwrite: true, ifMatch: etag });
  return put(pathname, body, { ...opts, allowOverwrite: Boolean(overwrite) });
}

async function getCount() {
  if (!useBlob()) return mem.count;
  const cur = await readJson(COUNT_PATH);
  return Number(cur?.data?.count) || 0;
}

async function visitorExists(h) {
  if (!useBlob()) return mem.visitors.has(h);
  return Boolean(await readJson(visitorPath(h)));
}

async function alreadyOffered(req, h) {
  if (hasCookie(req)) return true;
  return visitorExists(h);
}

async function rateOk(h) {
  const now = Date.now();
  if (!useBlob()) {
    const rate = mem.rates.get(h) || { w: now, n: 0 };
    if (now - rate.w > RATE_WINDOW_MS) {
      rate.w = now;
      rate.n = 0;
    }
    if (rate.n >= RATE_MAX) return false;
    rate.n += 1;
    mem.rates.set(h, rate);
    return true;
  }
  const path = ratePath(h);
  const cur = await readJson(path);
  let data = cur?.data && cur.data.w ? cur.data : { w: now, n: 0 };
  if (now - data.w > RATE_WINDOW_MS) data = { w: now, n: 0 };
  if (data.n >= RATE_MAX) return false;
  data.n += 1;
  try {
    await putJson(path, data, { etag: cur?.etag });
  } catch (e) {
    if (!(e instanceof BlobPreconditionFailedError)) throw e;
  }
  return true;
}

async function claimVisitor(h) {
  if (!useBlob()) {
    if (mem.visitors.has(h)) return false;
    mem.visitors.add(h);
    return true;
  }
  try {
    await putJson(visitorPath(h), { at: new Date().toISOString(), id: randomUUID() });
    return true;
  } catch (e) {
    if (e instanceof BlobNotFoundError) throw e;
    // already exists or race
    if (await visitorExists(h)) return false;
    const msg = String(e?.message || e).toLowerCase();
    if (msg.includes('already') || msg.includes('overlap') || e?.status === 409) return false;
    throw e;
  }
}

async function incrCount() {
  if (!useBlob()) {
    mem.count += 1;
    return mem.count;
  }
  for (let i = 0; i < 6; i++) {
    const cur = await readJson(COUNT_PATH);
    const next = (Number(cur?.data?.count) || 0) + 1;
    try {
      if (cur?.etag) await putJson(COUNT_PATH, { count: next }, { etag: cur.etag });
      else await putJson(COUNT_PATH, { count: next });
      return next;
    } catch (e) {
      if (e instanceof BlobPreconditionFailedError) continue;
      const msg = String(e?.message || e).toLowerCase();
      if (msg.includes('already') || msg.includes('overlap')) continue;
      throw e;
    }
  }
  return getCount();
}

async function offer(req, h) {
  if (!(await rateOk(h))) return { ok: false, reason: 'rate' };
  const claimed = await claimVisitor(h);
  if (!claimed) return { ok: false, reason: 'dup', count: await getCount() };
  const count = await incrCount();
  return { ok: true, count };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const h = hashIp(clientIp(req));
  try {
    if (req.method === 'GET') {
      const [count, offered] = await Promise.all([getCount(), alreadyOffered(req, h)]);
      return json(res, 200, { count, offered });
    }
    if (req.method === 'POST') {
      if (await alreadyOffered(req, h)) {
        setOfferedCookie(res);
        return json(res, 200, { count: await getCount(), offered: true, duplicate: true });
      }
      const result = await offer(req, h);
      if (result.reason === 'rate') {
        return json(res, 429, { error: 'rate_limited', count: await getCount(), offered: false });
      }
      setOfferedCookie(res);
      return json(res, 200, {
        count: result.count ?? (await getCount()),
        offered: true,
        duplicate: result.reason === 'dup',
      });
    }
    return json(res, 405, { error: 'method_not_allowed' });
  } catch (e) {
    console.error('cafe api', e);
    return json(res, 500, { error: 'server_error' });
  }
}
