#!/usr/bin/env node
/**
 * Inlines js-yaml into tools/editor.template.html and writes tools/editor.html.
 *
 * The editor has to work when opened straight from the filesystem — no server,
 * no npm, no network — which rules out both a CDN and ES-module imports (file://
 * blocks those). So the one dependency it needs, a YAML *parser* for the Load
 * button, is vendored into the file. The emitter is hand-written in the editor
 * itself, because it needs to produce the same block-scalar and flow-map style
 * the examples use.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const tpl = fs.readFileSync(path.join(ROOT, 'tools', 'editor.template.html'), 'utf8');
const libPath = path.join(ROOT, 'node_modules', 'js-yaml', 'dist', 'js-yaml.min.js');

if (!fs.existsSync(libPath)) {
  console.error('js-yaml not found — run `npm install` first.');
  process.exit(1);
}
const lib = fs.readFileSync(libPath, 'utf8');
const version = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'node_modules', 'js-yaml', 'package.json'), 'utf8')
).version;

const banner = `/*! js-yaml ${version} — MIT License — https://github.com/nodeca/js-yaml
 * Vendored so this file works offline from file://. Do not edit by hand;
 * regenerate with: node scripts/build-editor.js */\n`;

const out = tpl.replace('/*JSYAML*/', () => banner + lib);
if (out === tpl) {
  console.error('Placeholder /*JSYAML*/ not found in the template.');
  process.exit(1);
}

const dest = path.join(ROOT, 'tools', 'editor.html');
fs.writeFileSync(dest, out);
console.log(`  tools/editor.html   ${(out.length / 1024).toFixed(0)} KB  (js-yaml ${version} inlined)`);
