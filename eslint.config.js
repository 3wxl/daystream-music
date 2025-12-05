import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import { defineConfig } from 'eslint/config'
import autoImportGlobals from './eslintrc-auto-import.json' assert { type: 'json' }

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      pluginVue.configs['flat/essential'],
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...autoImportGlobals.globals,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    ignores: ['node_modules/**', 'dist/**', 'auto-imports.d.ts', 'eslintrc-auto-import.json'],
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: pluginVue.parser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
])
