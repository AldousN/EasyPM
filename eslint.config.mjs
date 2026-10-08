import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '.astro/**',
      '.vercel/**',
      '.npm-cache/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // Existing Sanity projections and migration scripts use dynamic records.
      // TypeScript remains the source of truth for their static contracts.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
    },
  },
  {
    files: ['studio/**/*.cjs', 'studio/sanity.cli.js'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
];
