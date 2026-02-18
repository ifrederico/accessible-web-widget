import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { string } from 'rollup-plugin-string';

const banner = `/*!\n * AccessibleWeb Widget v1.1.0\n * https://github.com/ifrederico/accessible-web-widget\n *\n * Copyright (c) 2025 ifrederico\n * Released under the MIT License\n *\n * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.\n * See DISCLAIMER.md for important legal information.\n * This widget does not guarantee accessibility compliance.\n */`;

export default {
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
    }
  ],
  plugins: [
    string({ include: '**/*.css' }),
    nodeResolve()
  ]
};
