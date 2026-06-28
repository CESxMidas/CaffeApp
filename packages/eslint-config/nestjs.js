const base = require('./base');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...base,
  {
    files: ['apps/api/**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      // NestJS constructor DI requires runtime class references (emitDecoratorMetadata)
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
];
