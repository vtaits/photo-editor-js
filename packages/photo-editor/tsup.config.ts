import { defineConfig } from 'tsup';

export default defineConfig({
  dts: true,

  entry: [
    'src/index.ts',
    'src/tools/index.ts',
  ],

  format: [
    'esm',
  ],

  sourcemap: true,
  splitting: true,
});
