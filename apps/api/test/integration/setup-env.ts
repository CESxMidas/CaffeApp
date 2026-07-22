/**
 * Integration-test environment guard.
 *
 * Runs via Jest `setupFiles` BEFORE any test file (and before PrismaClient is
 * constructed), so PrismaService picks up the test database — never the
 * developer/staging/production `DATABASE_URL`.
 *
 * Safety rules:
 *  - `TEST_DATABASE_URL` MUST be set explicitly. There is NO silent fallback to
 *    `DATABASE_URL`.
 *  - The target database name MUST contain "test" so we can never truncate a
 *    real database by accident.
 *  - Refuse to run when `NODE_ENV=production`.
 *  - Never log the full connection string (it may contain credentials).
 */

function fail(message: string): never {
  throw new Error(`[integration-setup] ${message}`);
}

const rawUrl = process.env.TEST_DATABASE_URL;

if (!rawUrl) {
  fail(
    'TEST_DATABASE_URL is required to run integration tests. ' +
      'Set it to a dedicated PostgreSQL test database (its name must contain "test"). ' +
      'Integration tests never fall back to DATABASE_URL.',
  );
}

if (process.env.NODE_ENV === 'production') {
  fail('Refusing to run integration tests with NODE_ENV=production.');
}

let dbName: string;
try {
  const parsed = new URL(rawUrl);
  // pathname is "/<database>"
  dbName = decodeURIComponent(parsed.pathname.replace(/^\//, '')).split('?')[0];
} catch {
  fail('TEST_DATABASE_URL is not a valid connection URL.');
}

if (!dbName) {
  fail('TEST_DATABASE_URL has no database name.');
}

if (!/test/i.test(dbName)) {
  fail(
    `Refusing to use database "${dbName}": integration tests only run against a ` +
      'database whose name contains "test".',
  );
}

// Point Prisma at the verified test database for this worker.
process.env.DATABASE_URL = rawUrl;
process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';

// Log only the safe parts — never the full URL with credentials.
console.log(`[integration-setup] Using test database "${dbName}".`);
