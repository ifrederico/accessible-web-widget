import { readFileSync } from 'node:fs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { string } from 'rollup-plugin-string';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const banner = `/*!\n * AccessibleWeb Widget v${version}\n * https://github.com/ifrederico/accessible-web-widget\n *\n * Copyright (c) 2025 ifrederico\n * Released under the MIT License\n *\n * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.\n * See DISCLAIMER.md for important legal information.\n * This widget does not guarantee accessibility compliance.\n */`;

// The wordpress.org directory forbids shipping code that references remote
// executables, even as unreachable fallbacks. The WordPress build replaces
// the remote-defaults module with empty values, so that build requires
// axeCoreUrl/dyslexiaFontUrl to be configured (the plugin always sets both).
const stripRemoteDefaults = {
  name: 'strip-remote-defaults',
  transform(code, id) {
    if (!id.endsWith('/src/constants/remote-defaults.js')) return null;
    return {
      code: [
        "export const AXE_CORE_VERSION = '4.11.1';",
        "export const AXE_CORE_SRC = '';",
        "export const AXE_CORE_INTEGRITY = '';",
        "export const DYSLEXIA_FONT_SRC = '';",
        "export const READABLE_FONT_FACES = {",
        "  dyslexic: { family: 'OpenDyslexic3', src: '' },",
        "  legible: { family: 'Atkinson Hyperlegible', src: '' },",
        "  lexend: { family: 'Lexend', src: '' }",
        "};"
      ].join('\n'),
      map: null
    };
  }
};

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/accessible-web-widget.js',
        format: 'iife',
        name: 'AccessibleWebWidget',
        banner
      },
      {
        file: 'dist/accessible-web-widget.min.js',
        format: 'iife',
        name: 'AccessibleWebWidget',
        sourcemap: true,
        banner,
        plugins: [terser()]
      },
      {
        // Real module build for npm consumers (import / bundlers); the IIFE
        // builds above exist for script-tag and CDN use.
        file: 'dist/accessible-web-widget.esm.js',
        format: 'es',
        banner
      }
    ],
    plugins: [
      string({ include: '**/*.css' }),
      nodeResolve()
    ]
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/accessible-web-widget.wp.min.js',
        format: 'iife',
        name: 'AccessibleWebWidget',
        banner,
        plugins: [terser()]
      }
    ],
    plugins: [
      string({ include: '**/*.css' }),
      nodeResolve(),
      stripRemoteDefaults
    ]
  }
];
