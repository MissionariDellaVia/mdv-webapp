// Configurazione a piatto: dalla versione 9 e' l'unica forma prevista da
// ESLint, e sostituisce eslintConfig dentro package.json.
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  {
    // Gli script e i loro test girano in Node, non nel browser.
    files: ['scripts/**/*.js', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
    },
  },
];
