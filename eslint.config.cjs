const base = require('@caffeapp/eslint-config/base');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...base,
  {
    files: ['apps/api/**/*.ts'],
  },
  {
    files: ['apps/mobile/**/*.{ts,tsx}'],
  },
  {
    files: ['packages/shared/**/*.ts'],
  },
];
