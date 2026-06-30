#!/usr/bin/env node
/**
 * Phase 3 static staging-data check.
 *
 * This validates the repo seed inputs before DevOps runs db:seed:staging
 * against the real staging database.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const dataDir = join(rootDir, 'apps', 'api', 'prisma', 'data');

const EXPECTED_BRANCHES = 3;
const EXPECTED_TABLES_PER_BRANCH = 50;
const EXPECTED_STAFF_PER_BRANCH = 4;
const MIN_EXPECTED_CATEGORIES = 6;
const MIN_EXPECTED_PRODUCTS = 38;

const checks = [];

function readJson(filename) {
  const raw = readFileSync(join(dataDir, filename), 'utf8');
  return JSON.parse(raw);
}

function addCheck(name, pass, details) {
  checks.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    details,
  });
}

function findDuplicates(rows, selector) {
  const seen = new Set();
  const duplicates = new Set();
  for (const row of rows) {
    const key = selector(row);
    if (seen.has(key)) {
      duplicates.add(key);
    }
    seen.add(key);
  }
  return [...duplicates];
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

const branchesFile = readJson('staging-branches.json');
const menuFile = readJson('staging-menu.json');

const branches = Array.isArray(branchesFile.branches) ? branchesFile.branches : [];
const categories = Array.isArray(menuFile.categories) ? menuFile.categories : [];
const products = Array.isArray(menuFile.products) ? menuFile.products : [];

addCheck(
  'Branch seed count',
  branches.length >= EXPECTED_BRANCHES,
  `${branches.length} branch(es), expected >= ${EXPECTED_BRANCHES}`,
);

const branchSlugs = branches.map((branch) => branch.slug).filter(Boolean);
const duplicateBranchSlugs = findDuplicates(branches, (branch) => branch.slug);
addCheck(
  'Branch slugs unique',
  duplicateBranchSlugs.length === 0,
  duplicateBranchSlugs.length ? duplicateBranchSlugs.join(', ') : branchSlugs.join(', '),
);

const branchesWithMissingFields = branches.filter((branch) => {
  return !branch.id || !branch.slug || !branch.name || !branch.address || !branch.phone;
});
addCheck(
  'Branch required fields',
  branchesWithMissingFields.length === 0,
  branchesWithMissingFields.length
    ? branchesWithMissingFields.map((branch) => branch.slug ?? branch.id ?? 'unknown').join(', ')
    : 'id, slug, name, address, phone present',
);

const branchesWithMissingBankInfo = branches.filter((branch) => {
  const bankInfo = branch.bankInfo;
  return (
    !bankInfo ||
    typeof bankInfo.bank !== 'string' ||
    typeof bankInfo.bankCode !== 'string' ||
    typeof bankInfo.account !== 'string' ||
    typeof bankInfo.holder !== 'string'
  );
});
addCheck(
  'VietQR bank info per branch',
  branchesWithMissingBankInfo.length === 0,
  branchesWithMissingBankInfo.length
    ? branchesWithMissingBankInfo.map((branch) => branch.slug ?? branch.id ?? 'unknown').join(', ')
    : 'bank, bankCode, account, holder present',
);

addCheck(
  'Menu category count',
  categories.length >= MIN_EXPECTED_CATEGORIES,
  `${categories.length} category/categories, expected >= ${MIN_EXPECTED_CATEGORIES}`,
);

const duplicateCategorySlugs = findDuplicates(categories, (category) => category.slug);
addCheck(
  'Menu category slugs unique',
  duplicateCategorySlugs.length === 0,
  duplicateCategorySlugs.length ? duplicateCategorySlugs.join(', ') : 'unique',
);

addCheck(
  'Menu product count',
  products.length >= MIN_EXPECTED_PRODUCTS,
  `${products.length} product(s), expected >= ${MIN_EXPECTED_PRODUCTS}`,
);

const categorySlugs = new Set(categories.map((category) => category.slug));
const productsWithUnknownCategory = products.filter((product) => !categorySlugs.has(product.cat));
addCheck(
  'Product category references',
  productsWithUnknownCategory.length === 0,
  productsWithUnknownCategory.length
    ? productsWithUnknownCategory.map((product) => `${product.name} -> ${product.cat}`).join(', ')
    : 'all products map to a category',
);

const invalidPriceProducts = products.filter((product) => !isPositiveInteger(product.price));
addCheck(
  'Product prices',
  invalidPriceProducts.length === 0,
  invalidPriceProducts.length
    ? invalidPriceProducts.map((product) => product.name ?? 'unknown').join(', ')
    : 'all product prices are positive integers',
);

const duplicateProducts = findDuplicates(products, (product) => `${product.cat}|${product.name}`);
addCheck(
  'Product names unique within category',
  duplicateProducts.length === 0,
  duplicateProducts.length ? duplicateProducts.join(', ') : 'unique',
);

const expectedTables = branches.length * EXPECTED_TABLES_PER_BRANCH;
const expectedStaff = branches.length * EXPECTED_STAFF_PER_BRANCH;
const expectedProductsAfterSeed = branches.length * products.length;
const expectedCategoriesAfterSeed = branches.length * categories.length;

console.log('Phase 3 staging data static verification');
console.log(`Data directory: ${dataDir}`);
console.log('');
console.table(checks);
console.log('');
console.log('Expected database counts after npm run db:seed:staging:');
console.log(`- Active branches: >= ${EXPECTED_BRANCHES}`);
console.log(
  `- Tables: ${expectedTables} (${branches.length} branches x ${EXPECTED_TABLES_PER_BRANCH})`,
);
console.log(
  `- Active branch staff: ${expectedStaff} (${branches.length} branches x ${EXPECTED_STAFF_PER_BRANCH})`,
);
console.log(
  `- Categories: ${expectedCategoriesAfterSeed} (${branches.length} branches x ${categories.length})`,
);
console.log(
  `- Available products: ${expectedProductsAfterSeed} (${branches.length} branches x ${products.length})`,
);
console.log('');
console.log('Seed demo accounts:');
console.log('- owner@caffe.app');
for (const slug of branchSlugs) {
  console.log(`- manager.${slug}@caffe.app`);
  console.log(`- cashier.${slug}@caffe.app`);
  console.log(`- barista.${slug}@caffe.app`);
  console.log(`- station.${slug}@caffe.app`);
}

const failed = checks.filter((check) => check.status === 'FAIL');
if (failed.length > 0) {
  console.error('');
  console.error(`FAILED: ${failed.length} check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('');
  console.log('PASS: repo seed inputs are ready for Phase 3 staging verification.');
}
