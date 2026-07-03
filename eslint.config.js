import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'platforms/wordpress/js/**',
      'test-results/**',
      'playwright-report/**',
      'repomix-*.xml'
    ]
  },
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'tests/**/*.js', 'examples/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    }
  },
  {
    files: ['*.js', 'tests/unit/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    }
  }
];
