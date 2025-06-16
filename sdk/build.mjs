import {build} from 'esbuild';

await build({
  entryPoints: ['src/game_hosting.ts'],
  outfile: 'build/game_hosting.mjs',
  bundle: true,
  format: 'esm',
  target: 'ES2024',
  platform: 'browser',
  sourcemap: true,
});
