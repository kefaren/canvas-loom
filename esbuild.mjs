import { build } from 'esbuild';
await build({entryPoints:['src/main.ts'],bundle:true,format:'cjs',platform:'node',target:'es2022',outfile:'main.js',external:['obsidian','electron','@codemirror/state','@codemirror/view'],sourcemap:false,banner:{js:'/* Canvas Loom — MIT. Source and installation instructions included in the release. */'}});
