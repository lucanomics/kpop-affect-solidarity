#!/usr/bin/env node
/**
 * Visual + structural QA on the generated PDFs.
 *
 * Deliberately inspects the *output*, not the HTML that produced it: page
 * geometry from pdfinfo, word bounding boxes from pdftotext -bbox-layout, and
 * page ink from a rasterised greyscale render. A build that succeeds tells you
 * nothing about whether the document is usable.
 *
 *   node scripts/visual-qa.js                 # check every PDF in output/
 *   node scripts/visual-qa.js --png           # also write page rasters to qa/
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'output');
const QA = path.join(ROOT, 'qa');
const writePng = process.argv.includes('--png');

const MM = 2.834645669; // pt per mm
const EDGE_MM = 6;      // nothing may sit closer than this to the trim edge
const MIN_GLYPH_PT = 7.0;
const A4 = { short: 595, long: 842, tol: 6 };

const findings = [];
const add = (sev, file, page, msg) => findings.push({ sev, file, page, msg });

const sh = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

function pageSizes(pdf) {
  const n = Number(/Pages:\s+(\d+)/.exec(sh('pdfinfo', [pdf]))[1]);
  return Array.from({ length: n }, (_, i) => {
    const m = /size:\s+([\d.]+) x ([\d.]+)/.exec(sh('pdfinfo', ['-f', i + 1, '-l', i + 1, pdf]));
    return { w: Number(m[1]), h: Number(m[2]) };
  });
}

/** Word boxes per page, from the PDF's own text layer. */
function words(pdf) {
  const xml = sh('pdftotext', ['-bbox-layout', pdf, '-']);
  const pages = [];
  const pageRe = /<page width="([\d.]+)" height="([\d.]+)">([\s\S]*?)<\/page>/g;
  const wordRe = /<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([\s\S]*?)<\/word>/g;
  let p;
  while ((p = pageRe.exec(xml))) {
    const list = [];
    let w;
    while ((w = wordRe.exec(p[3]))) {
      list.push({
        x0: +w[1], y0: +w[2], x1: +w[3], y1: +w[4],
        text: w[5].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'"),
      });
    }
    pages.push({ w: +p[1], h: +p[2], words: list });
  }
  return pages;
}

/** Mean luminance of a page, 0 = black, 1 = white. Used to find blank pages. */
function pageInk(pdf, pageNo) {
  const tmp = path.join(os.tmpdir(), `qa-${process.pid}-${pageNo}`);
  sh('pdftoppm', ['-gray', '-r', '18', '-f', String(pageNo), '-l', String(pageNo), pdf, tmp]);
  const file = fs.readdirSync(os.tmpdir())
    .filter((f) => f.startsWith(path.basename(tmp)))
    .map((f) => path.join(os.tmpdir(), f))[0];
  if (!file) return 1;
  const buf = fs.readFileSync(file);
  fs.unlinkSync(file);
  // Minimal PGM (P5) parse: magic, width, height, maxval, then raw bytes.
  let i = 0, fields = [];
  while (fields.length < 4) {
    while (i < buf.length && /\s/.test(String.fromCharCode(buf[i]))) i++;
    if (String.fromCharCode(buf[i]) === '#') { while (buf[i] !== 10) i++; continue; }
    let s = '';
    while (i < buf.length && !/\s/.test(String.fromCharCode(buf[i]))) s += String.fromCharCode(buf[i++]);
    fields.push(s);
  }
  i++;
  let sum = 0, n = 0;
  for (let j = i; j < buf.length; j++) { sum += buf[j]; n++; }
  return n ? sum / n / 255 : 1;
}

/**
 * Which source file produced a PDF, so the Hangul check only fires on documents
 * that are actually meant to contain Korean.
 */
const primary = (() => {
  const i = process.argv.indexOf('--primary');
  return i >= 0 ? process.argv[i + 1] : 'it';
})();
const LANGS = Object.fromEntries(
  fs.readdirSync(path.join(ROOT, 'examples'))
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => [
      path.basename(f, '.yaml'),
      yaml.load(fs.readFileSync(path.join(ROOT, 'examples', f), 'utf8')).exam.lang ?? 'en',
    ])
);
const isBlank = (pdf) => path.relative(OUT, pdf).split(path.sep)[0] === 'blank';

function langOf(pdf) {
  const base = path.basename(pdf);
  if (isBlank(pdf)) {
    // output/blank/<lang>/NN-name.pdf, or output/blank/exam-matrix-blank-<lang>.pdf
    const dir = path.basename(path.dirname(pdf));
    if (dir === 'ko' || dir === 'en') return dir;
    return base.endsWith('-ko.pdf') ? 'ko' : 'en';
  }
  const inExamples = path.dirname(pdf).endsWith('examples');
  const name = inExamples ? base.split('-universal-study-notes')[0] : primary;
  return LANGS[name] ?? 'en';
}

function checkPdf(pdf) {
  const rel = path.relative(ROOT, pdf);
  const sizes = pageSizes(pdf);
  const pages = words(pdf);
  const isKo = langOf(pdf) === 'ko';
  const blank = isBlank(pdf);

  // --- geometry ----------------------------------------------------------
  sizes.forEach((s, i) => {
    const [a, b] = [Math.min(s.w, s.h), Math.max(s.w, s.h)];
    if (Math.abs(a - A4.short) > A4.tol || Math.abs(b - A4.long) > A4.tol) {
      add('ERROR', rel, i + 1, `page is ${s.w.toFixed(0)}×${s.h.toFixed(0)}pt, not A4`);
    }
  });

  let hangul = 0;
  pages.forEach((pg, i) => {
    const n = i + 1;
    const edge = EDGE_MM * MM;

    for (const w of pg.words) {
      if (!w.text.trim()) continue;
      if (/�/.test(w.text)) add('ERROR', rel, n, `replacement character in "${w.text}"`);
      if (/[가-힣]/.test(w.text)) hangul++;

      if (w.x0 < edge || w.x1 > pg.w - edge) {
        add('ERROR', rel, n, `text crosses the horizontal trim margin: "${w.text.slice(0, 30)}"`);
      }
      if (w.y0 < edge || w.y1 > pg.h - edge) {
        add('ERROR', rel, n, `text crosses the vertical trim margin: "${w.text.slice(0, 30)}"`);
      }
      const h = w.y1 - w.y0;
      if (h > 0 && h < MIN_GLYPH_PT) {
        add('WARN', rel, n, `glyph height ${h.toFixed(1)}pt below ${MIN_GLYPH_PT}pt: "${w.text.slice(0, 24)}"`);
      }
    }

    // A page carrying only the running footer is an accident, not a design —
    // except on the handwriting templates, where empty is the entire point.
    if (!blank) {
      const body = pg.words.filter((w) => w.y1 < pg.h - 30 && w.text.trim()).length;
      if (body < 3) {
        const ink = pageInk(pdf, n);
        if (ink > 0.995) add('ERROR', rel, n, `page is blank (mean luminance ${ink.toFixed(4)})`);
        else add('WARN', rel, n, `page carries almost no text (${body} words)`);
      }
    }
  });

  if (isKo && hangul === 0) {
    add('ERROR', rel, 0, 'Korean document contains no Hangul in its text layer — font or encoding failure');
  }

  // --- repeated table headers across page breaks -------------------------
  // The matrix title row lives in <thead>, so if a table spans pages the title
  // must reappear. Absence means the header did not repeat.
  const titleRe = /(Exam Matrix|엑셀표 매트릭스)/;
  const runs = [];
  pages.forEach((pg, i) => {
    const line = pg.words.map((w) => w.text).join(' ');
    if (titleRe.test(line)) runs.push(i + 1);
  });
  const contRe = /(columns \d+ of \d+|열 \d+ \/ \d+)/;
  pages.forEach((pg, i) => {
    const line = pg.words.map((w) => w.text).join(' ');
    if (contRe.test(line) && !titleRe.test(line)) {
      add('ERROR', rel, i + 1, 'matrix continuation page is missing the repeated header');
    }
  });

  if (writePng) {
    fs.mkdirSync(QA, { recursive: true });
    const base = path.basename(pdf, '.pdf');
    sh('pdftoppm', ['-png', '-r', '80', pdf, path.join(QA, base)]);
  }

  return { pages: sizes.length, hangul };
}

// ---------------------------------------------------------------------------

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return walk(full);
    return e.name.endsWith('.pdf') ? [full] : [];
  });
}
const pdfs = walk(OUT).sort();

console.log(`Checking ${pdfs.length} PDFs\n`);
for (const pdf of pdfs) {
  const r = checkPdf(pdf);
  console.log(`  ${path.relative(ROOT, pdf).padEnd(60)} ${String(r.pages).padStart(3)} pages`);
}

const errors = findings.filter((f) => f.sev === 'ERROR');
const warns = findings.filter((f) => f.sev === 'WARN');

console.log('');
for (const f of [...errors, ...warns]) {
  console.log(`  ${f.sev.padEnd(5)} ${f.file}${f.page ? ` p${f.page}` : ''}: ${f.msg}`);
}
console.log(`\n${errors.length} errors, ${warns.length} warnings`);
process.exit(errors.length ? 1 : 0);
