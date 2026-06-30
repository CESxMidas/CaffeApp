#!/usr/bin/env node
/**
 * Phase 4/8 release readiness checks.
 *
 * This intentionally validates local repo/config + required build env only.
 * It does not deploy, tag, or call EAS.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const args = new Map();
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg.startsWith('--')) {
    const [key, inlineValue] = arg.slice(2).split('=');
    const nextValue = process.argv[i + 1];
    if (inlineValue !== undefined) {
      args.set(key, inlineValue);
    } else if (nextValue && !nextValue.startsWith('--')) {
      args.set(key, nextValue);
      i++;
    } else {
      args.set(key, 'true');
    }
  }
}

const profile = args.get('profile') ?? process.env.RELEASE_PROFILE ?? 'preview';
const checks = [];

function readJson(pathFromRoot) {
  return JSON.parse(readFileSync(join(rootDir, pathFromRoot), 'utf8'));
}

function addCheck(name, pass, details) {
  checks.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    details,
  });
}

function appVersionFromMobileConfig(appJson) {
  return appJson?.expo?.version ?? '';
}

function isLocalOrPrivateUrl(value) {
  return (
    /^https?:\/\/localhost(?::|\/|$)/.test(value) ||
    /^https?:\/\/127\./.test(value) ||
    /^https?:\/\/10\./.test(value) ||
    /^https?:\/\/192\.168\./.test(value) ||
    /^https?:\/\/172\.(1[6-9]|2\d|3[01])\./.test(value) ||
    value.includes('10.0.2.2')
  );
}

function parseApiUrl(value) {
  try {
    return value ? new URL(value) : null;
  } catch {
    return null;
  }
}

function isPlaceholderUrl(value) {
  const parsed = parseApiUrl(value);
  const host = parsed?.hostname ?? '';
  return (
    !parsed ||
    value.includes('<') ||
    value.includes('>') ||
    host.endsWith('.example.com') ||
    host === 'example.com' ||
    host.includes('your-domain') ||
    host.includes('staging-api-domain') ||
    host.includes('prod-api-domain')
  );
}

function apiUrlForProfile(easProfile) {
  return (process.env.EXPO_PUBLIC_API_URL ?? easProfile?.env?.EXPO_PUBLIC_API_URL ?? '').trim();
}

const rootPackage = readJson('package.json');
const mobilePackage = readJson('apps/mobile/package.json');
const apiPackage = readJson('apps/api/package.json');
const appJson = readJson('apps/mobile/app.json');
const easJson = readJson('apps/mobile/eas.json');
const selectedProfile = easJson.build?.[profile];
const apiUrl = apiUrlForProfile(selectedProfile);

addCheck('EAS profile exists', Boolean(selectedProfile), `profile=${profile}`);
addCheck(
  'Mobile package id configured',
  Boolean(appJson.expo?.android?.package && appJson.expo?.ios?.bundleIdentifier),
  `${appJson.expo?.android?.package ?? '(missing)'} / ${
    appJson.expo?.ios?.bundleIdentifier ?? '(missing)'
  }`,
);
addCheck(
  'Version aligned',
  rootPackage.version === mobilePackage.version &&
    rootPackage.version === apiPackage.version &&
    rootPackage.version === appVersionFromMobileConfig(appJson),
  `root=${rootPackage.version}, mobile=${mobilePackage.version}, api=${apiPackage.version}, app=${appVersionFromMobileConfig(appJson)}`,
);
addCheck(
  'EAS app env configured',
  Boolean(selectedProfile?.env?.EXPO_PUBLIC_APP_ENV),
  selectedProfile?.env?.EXPO_PUBLIC_APP_ENV ?? '(missing)',
);
addCheck(
  'EXPO_PUBLIC_API_URL provided',
  Boolean(apiUrl),
  apiUrl ? 'provided via shell env or eas profile env' : 'set EXPO_PUBLIC_API_URL before EAS build',
);
addCheck(
  'EXPO_PUBLIC_API_URL is real URL',
  Boolean(apiUrl) && !isPlaceholderUrl(apiUrl),
  apiUrl || '(missing)',
);

if (profile === 'production') {
  addCheck(
    'Production API URL is public HTTPS',
    Boolean(apiUrl) &&
      !isPlaceholderUrl(apiUrl) &&
      apiUrl.startsWith('https://') &&
      !isLocalOrPrivateUrl(apiUrl),
    apiUrl || '(missing)',
  );
} else if (profile === 'preview') {
  addCheck(
    'Preview API URL is not localhost',
    Boolean(apiUrl) && !isPlaceholderUrl(apiUrl) && !/^https?:\/\/localhost(?::|\/|$)/.test(apiUrl),
    apiUrl || '(missing)',
  );
}

if (process.env.CHECK_API_ENV === 'true') {
  const requiredApiEnv = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'JWT_REFRESH_EXPIRES_IN',
    'CORS_ORIGINS',
    'NODE_ENV',
  ];
  for (const key of requiredApiEnv) {
    addCheck(`API env ${key}`, Boolean(process.env[key]), process.env[key] ? 'set' : 'missing');
  }

  addCheck(
    'JWT_SECRET not dev default',
    Boolean(process.env.JWT_SECRET) && process.env.JWT_SECRET !== 'change-me-in-production',
    process.env.JWT_SECRET ? 'set' : 'missing',
  );
}

console.log('Phase 4/8 release readiness verification');
console.log(`Profile: ${profile}`);
console.table(checks);

const failed = checks.filter((check) => check.status === 'FAIL');
if (failed.length > 0) {
  console.error('');
  console.error(`FAILED: ${failed.length} release readiness check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('');
  console.log('PASS: release/build config is ready for the selected profile.');
}
