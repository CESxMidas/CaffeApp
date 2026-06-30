#!/usr/bin/env node
/**
 * Phase 3 NFR spot-check for staging API latency.
 *
 * Requires Node 20+ global fetch. Defaults to read-only GET checks; POST /orders
 * is opt-in because it creates real staging data.
 */
import { performance } from 'node:perf_hooks';

const DEFAULT_ITERATIONS = 100;
const DEFAULT_THRESHOLD_MS = 500;
const DEFAULT_TIMEOUT_MS = 15000;

const env = process.env;
const iterations = positiveInt(env.NFR_ITERATIONS, DEFAULT_ITERATIONS);
const thresholdMs = positiveInt(env.NFR_THRESHOLD_MS, DEFAULT_THRESHOLD_MS);
const timeoutMs = positiveInt(env.NFR_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
const baseUrl = (env.API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const createOrders = env.NFR_CREATE_ORDER === 'true';
const cleanupOrders = env.NFR_CLEANUP_ORDERS === 'true';
const postIterations = positiveInt(env.NFR_POST_ITERATIONS, iterations);

let accessToken = env.API_TOKEN ?? '';
let inferredBranchId = env.BRANCH_ID ?? '';
let loginStaffId = '';

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
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value);
    }
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

function percentile(samples, percentileValue) {
  if (samples.length === 0) return 0;
  const sorted = [...samples].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil((percentileValue / 100) * sorted.length) - 1);
  return sorted[index];
}

function formatMs(value) {
  return `${Math.round(value)}ms`;
}

async function timedRequest(path, options = {}) {
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
  const ms = performance.now() - started;
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return {
    ok: response.ok,
    status: response.status,
    ms,
    json,
    text,
  };
}

async function loginIfNeeded() {
  if (accessToken) return;

  const email = env.API_EMAIL;
  const password = env.API_PASSWORD;
  if (!email || !password) {
    throw new Error(
      'Set API_TOKEN, or set API_EMAIL and API_PASSWORD to login before running NFR.',
    );
  }

  const response = await timedRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok || !response.json?.data?.accessToken) {
    throw new Error(`Login failed with HTTP ${response.status}: ${response.text}`);
  }

  const data = response.json.data;
  accessToken = data.accessToken;
  inferredBranchId = inferredBranchId || data.branch?.id || '';
  loginStaffId = data.staff?.id || '';
}

async function runEndpoint(label, count, requestFactory, onSuccess) {
  const samples = [];
  const failures = [];

  for (let i = 0; i < count; i++) {
    try {
      const response = await requestFactory(i);
      samples.push(response.ms);
      if (response.ok) {
        onSuccess?.(response, i);
      } else {
        failures.push(`HTTP ${response.status}`);
      }
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }

  const p50 = percentile(samples, 50);
  const p95 = percentile(samples, 95);
  return {
    endpoint: label,
    requests: count,
    ok: count - failures.length,
    failed: failures.length,
    p50,
    p95,
    result: failures.length === 0 && p95 <= thresholdMs ? 'PASS' : 'FAIL',
    firstError: failures[0] ?? '',
  };
}

async function resolveProductForPost() {
  if (!inferredBranchId) {
    return null;
  }

  if (env.PRODUCT_ID && env.PRODUCT_UNIT_PRICE) {
    return {
      id: env.PRODUCT_ID,
      price: positiveInt(env.PRODUCT_UNIT_PRICE, 0),
    };
  }

  const response = await timedRequest(withQuery('/products', { branchId: inferredBranchId }));
  if (!response.ok || !Array.isArray(response.json?.data)) {
    throw new Error(
      `Cannot resolve PRODUCT_ID from /products. HTTP ${response.status}: ${response.text}`,
    );
  }

  const product = response.json.data.find((item) => item.isAvailable !== false);
  if (!product?.id || !product?.price) {
    return null;
  }

  return { id: product.id, price: product.price };
}

async function cleanupCreatedOrders(orderIds) {
  if (!cleanupOrders || orderIds.length === 0) return;

  let cleaned = 0;
  for (const orderId of orderIds) {
    const response = await timedRequest(`/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({
        reason: 'Phase 3 NFR cleanup',
        ...(env.ACTED_BY_STAFF_ID || loginStaffId
          ? { actedByStaffId: env.ACTED_BY_STAFF_ID || loginStaffId }
          : {}),
      }),
    });
    if (response.ok) cleaned++;
  }
  console.log(`Cleaned up ${cleaned}/${orderIds.length} NFR order(s).`);
}

await loginIfNeeded();

const branchId = inferredBranchId;
const commonQuery = { ...(branchId ? { branchId } : {}) };
const results = [];
const createdOrderIds = [];

console.log('Phase 3 NFR spot-check');
console.log(`API base: ${baseUrl}`);
console.log(`Iterations: ${iterations}`);
console.log(`Threshold: p95 < ${thresholdMs}ms`);
console.log(`Branch: ${branchId || '(JWT scope)'}`);
console.log('');

results.push(
  await runEndpoint('GET /tables', iterations, () =>
    timedRequest(withQuery('/tables', commonQuery)),
  ),
);

results.push(
  await runEndpoint('GET /orders queue', iterations, () =>
    timedRequest(
      withQuery('/orders', {
        ...commonQuery,
        status: 'PENDING,MAKING,READY',
      }),
    ),
  ),
);

if (createOrders) {
  const product = await resolveProductForPost();
  if (!branchId || !product) {
    results.push({
      endpoint: 'POST /orders',
      requests: 0,
      ok: 0,
      failed: 1,
      p50: 0,
      p95: 0,
      result: 'FAIL',
      firstError: 'BRANCH_ID and a product are required for POST /orders.',
    });
  } else {
    results.push(
      await runEndpoint(
        'POST /orders',
        postIterations,
        (index) =>
          timedRequest('/orders', {
            method: 'POST',
            body: JSON.stringify({
              branchId,
              orderType: 'TAKE_AWAY',
              notes: `Phase 3 NFR ${new Date().toISOString()} #${index + 1}`,
              ...(env.ACTED_BY_STAFF_ID || loginStaffId
                ? { actedByStaffId: env.ACTED_BY_STAFF_ID || loginStaffId }
                : {}),
              items: [
                {
                  productId: product.id,
                  quantity: 1,
                  unitPrice: product.price,
                },
              ],
            }),
          }),
        (response) => {
          const orderId = response.json?.data?.id;
          if (orderId) createdOrderIds.push(orderId);
        },
      ),
    );
  }
} else {
  console.log('Skipped POST /orders. Set NFR_CREATE_ORDER=true to enable write load.');
  console.log('');
}

const printableResults = results.map((row) => ({
  endpoint: row.endpoint,
  requests: row.requests,
  ok: row.ok,
  failed: row.failed,
  p50: formatMs(row.p50),
  p95: formatMs(row.p95),
  result: row.result,
  firstError: row.firstError,
}));

console.table(printableResults);

await cleanupCreatedOrders(createdOrderIds);

const failed = results.filter((row) => row.result !== 'PASS');
if (failed.length > 0) {
  console.error('');
  console.error(
    'NFR spot-check failed. Create an optimize ticket for any endpoint over threshold.',
  );
  process.exitCode = 1;
} else {
  console.log('');
  console.log('PASS: all measured endpoints are under the configured p95 threshold.');
}
