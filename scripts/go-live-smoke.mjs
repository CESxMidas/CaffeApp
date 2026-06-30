#!/usr/bin/env node
/**
 * Phase 8 production/staging smoke test.
 *
 * Defaults to read-only checks. Set SMOKE_CREATE_ORDER=true to create and
 * cancel a test order. Set SMOKE_PAY_ORDER=true only when the Owner accepts a
 * real paid smoke order, because the current MVP has no payment void endpoint.
 */
import { performance } from 'node:perf_hooks';

const env = process.env;
const timeoutMs = positiveInt(env.SMOKE_TIMEOUT_MS, 15000);
const baseUrl = (env.API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const createOrder = env.SMOKE_CREATE_ORDER === 'true';
const payOrder = env.SMOKE_PAY_ORDER === 'true';

let accessToken = env.API_TOKEN ?? '';
let loginData = null;

function positiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const prefix = baseUrl.endsWith('/api/v1') ? '' : '/api/v1';
  return `${baseUrl}${prefix}${normalizedPath}`;
}

function withQuery(path, params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

async function request(path, options = {}) {
  const started = performance.now();
  const response = await fetch(apiUrl(path), {
    ...options,
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return {
    ok: response.ok,
    status: response.status,
    ms: performance.now() - started,
    json,
    text,
  };
}

async function step(name, fn) {
  try {
    const result = await fn();
    return {
      name,
      status: result.ok ? 'PASS' : 'FAIL',
      http: result.status ?? '',
      ms: result.ms ? `${Math.round(result.ms)}ms` : '',
      details: result.details ?? '',
      data: result.data,
    };
  } catch (error) {
    return {
      name,
      status: 'FAIL',
      http: '',
      ms: '',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

async function loginIfNeeded() {
  if (accessToken) {
    return null;
  }

  const email = env.API_EMAIL;
  const password = env.API_PASSWORD;
  if (!email || !password) {
    throw new Error('Set API_TOKEN, or set API_EMAIL and API_PASSWORD.');
  }

  const response = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok || !response.json?.data?.accessToken) {
    throw new Error(`login failed: HTTP ${response.status} ${response.text}`);
  }
  loginData = response.json.data;
  accessToken = loginData.accessToken;
  return loginData;
}

function actedByStaffId() {
  return env.ACTED_BY_STAFF_ID || loginData?.staff?.id || undefined;
}

await loginIfNeeded();

const results = [];

results.push(
  await step('GET /health', async () => {
    const response = await request('/health');
    return {
      ...response,
      details: response.json?.status ?? response.text.slice(0, 80),
    };
  }),
);

results.push(
  await step('GET /auth/me', async () => {
    const response = await request('/auth/me');
    if (response.ok) loginData = { ...(loginData ?? {}), ...response.json.data };
    return {
      ...response,
      details: response.json?.data?.staff?.role ?? '',
    };
  }),
);

let branchId = env.BRANCH_ID || loginData?.branch?.id || '';
let product = null;
let orderId = '';

results.push(
  await step('GET /branches', async () => {
    const response = await request('/branches');
    const branches = response.json?.data ?? [];
    branchId = branchId || branches[0]?.id || '';
    return {
      ...response,
      details: `${branches.length} branch(es); selected=${branchId || '(none)'}`,
    };
  }),
);

results.push(
  await step('GET /tables', async () => {
    const response = await request(withQuery('/tables', { branchId }));
    return {
      ...response,
      details: `${response.json?.data?.length ?? 0} table(s)`,
    };
  }),
);

results.push(
  await step('GET /products', async () => {
    const response = await request(withQuery('/products', { branchId }));
    const products = response.json?.data ?? [];
    product = products.find((item) => item.isAvailable !== false) ?? null;
    return {
      ...response,
      details: `${products.length} product(s)`,
    };
  }),
);

if (createOrder) {
  results.push(
    await step('POST /orders', async () => {
      if (!branchId || !product) {
        throw new Error('branch and product are required before creating a smoke order');
      }
      const response = await request('/orders', {
        method: 'POST',
        body: JSON.stringify({
          branchId,
          orderType: 'TAKE_AWAY',
          notes: `Go-live smoke ${new Date().toISOString()}`,
          ...(actedByStaffId() ? { actedByStaffId: actedByStaffId() } : {}),
          items: [{ productId: product.id, quantity: 1, unitPrice: product.price }],
        }),
      });
      orderId = response.json?.data?.id ?? '';
      return {
        ...response,
        details: orderId ? `order=${orderId}` : response.text.slice(0, 80),
      };
    }),
  );

  for (const status of ['MAKING', 'READY']) {
    results.push(
      await step(`PATCH /orders/:id/status ${status}`, async () => {
        if (!orderId) throw new Error('order was not created');
        const response = await request(`/orders/${orderId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({
            status,
            ...(actedByStaffId() ? { actedByStaffId: actedByStaffId() } : {}),
          }),
        });
        return { ...response, details: response.json?.data?.status ?? response.text.slice(0, 80) };
      }),
    );
  }

  results.push(
    await step('POST /orders/:id/deliver', async () => {
      if (!orderId) throw new Error('order was not created');
      const response = await request(`/orders/${orderId}/deliver`, {
        method: 'POST',
        body: JSON.stringify({
          ...(actedByStaffId() ? { actedByStaffId: actedByStaffId() } : {}),
        }),
      });
      return {
        ...response,
        details: response.json?.data?.deliveredAt ? 'delivered' : response.text.slice(0, 80),
        data: response.json?.data,
      };
    }),
  );

  if (payOrder) {
    results.push(
      await step('POST /payments CASH', async () => {
        if (!orderId) throw new Error('order was not created');
        const order = results.at(-1)?.data;
        const amount = order?.total ?? product.price;
        const response = await request('/payments', {
          method: 'POST',
          body: JSON.stringify({
            orderId,
            method: 'CASH',
            amount,
            changeAmount: 0,
            reference: 'go-live-smoke',
            ...(actedByStaffId() ? { actedByStaffId: actedByStaffId() } : {}),
          }),
        });
        return {
          ...response,
          details: response.json?.data?.id ? 'paid' : response.text.slice(0, 80),
        };
      }),
    );
  } else {
    results.push(
      await step('POST /orders/:id/cancel cleanup', async () => {
        if (!orderId) throw new Error('order was not created');
        const response = await request(`/orders/${orderId}/cancel`, {
          method: 'POST',
          body: JSON.stringify({
            reason: 'Go-live smoke cleanup',
            ...(actedByStaffId() ? { actedByStaffId: actedByStaffId() } : {}),
          }),
        });
        return {
          ...response,
          details: response.json?.data?.status ?? response.text.slice(0, 80),
        };
      }),
    );
  }
} else {
  results.push({
    name: 'POST smoke order',
    status: 'SKIP',
    http: '',
    ms: '',
    details: 'Set SMOKE_CREATE_ORDER=true to run write-path smoke.',
  });
}

console.log('Phase 8 go-live smoke');
console.log(`API base: ${baseUrl}`);
console.log(`Branch: ${branchId || '(JWT/default)'}`);
console.table(results.map(({ data: _data, ...row }) => row));

const failed = results.filter((row) => row.status === 'FAIL');
if (failed.length > 0) {
  console.error('');
  console.error(`FAILED: ${failed.length} smoke step(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('');
  console.log('PASS: smoke steps completed without failures.');
}
