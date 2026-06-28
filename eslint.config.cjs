const base = require('@caffeapp/eslint-config/base');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...base,
  {
    files: ['apps/api/**/*.ts'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
  {
    files: ['apps/mobile/**/*.{ts,tsx}'],
  },
  {
    files: ['packages/shared/**/*.ts'],
  },
];
