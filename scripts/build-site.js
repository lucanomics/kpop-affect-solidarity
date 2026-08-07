#!/usr/bin/env node
/**
 * Assembles the static site in public/ from artefacts that are already built.
 *
 * Deliberately dependency-free and browser-free: it only copies files and
 * writes one HTML page. The PDFs are generated locally (Chromium + CJK fonts
 * required) and committed, so the hosting build never has to install a browser
 * or a font package — which is what makes this deployable to Vercel at all.
 *
 *   node scripts/build-site.js
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public');
const FILES = path.join(OUT, 'files');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(FILES, { recursive: true });

function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    if (e.isDirectory()) copyTree(s, d);
    else fs.copyFileSync(s, d);
  }
}

copyTree(path.join(ROOT, 'output'), FILES);
fs.copyFileSync(path.join(ROOT, 'tools', 'editor.html'), path.join(OUT, 'editor.html'));

const kb = (p) => Math.round(fs.statSync(p).size / 1024);
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');

/** Files in a directory, as {name, href, kb}. */
function listDir(rel) {
  const abs = path.join(FILES, rel);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs)
    .filter((f) => f.endsWith('.pdf'))
    .sort()
    .map((f) => ({
      name: f.replace(/\.pdf$/, ''),
      href: `files/${enc(rel ? rel + '/' + f : f)}`,
      kb: kb(path.join(abs, f)),
    }));
}

const blankKo = listDir('blank/ko');
const blankEn = listDir('blank/en');
const workbooks = listDir('blank').filter((f) => f.name.startsWith('exam-matrix-blank'));
const notes = listDir('');
const examples = listDir('examples');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const dl = (items) => items.map((i) =>
  `<a class="dl" href="${i.href}" download><span class="n">${esc(i.name)}</span><span class="s">${i.kb} KB</span></a>`
).join('');

const page = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Exam Matrix — 변별과 인출을 위한 시험 노트 시스템</title>
<meta name="description" content="문사탐 셀프엑셀표 방법을 일반화한 자격증 시험용 A4 학습 노트 시스템. 필기용 빈 양식과 브라우저 입력기 포함.">
<style>
:root{
  --ink:#14171c; --ink-2:#3d434d; --muted:#6b727d; --rule:#c3c9d1; --hair:#e2e6ea;
  --accent:#1f4b73; --bg:#f6f7f9; --panel:#fff; --tint:#eceef2;
  --sans:"Noto Sans KR","Noto Sans CJK KR",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  --serif:"Noto Serif KR","Noto Serif CJK KR",Georgia,serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,monospace;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:var(--sans);color:var(--ink);background:var(--bg);line-height:1.6;
  word-break:keep-all;overflow-wrap:break-word;-webkit-text-size-adjust:100%}
.wrap{max-width:940px;margin:0 auto;padding:0 20px}
a{color:var(--accent)}

header.hero{background:var(--ink);color:#fff;padding:54px 0 46px;border-bottom:4px solid var(--accent)}
header.hero .eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  color:#8fb0cc;margin-bottom:14px}
header.hero h1{font-family:var(--serif);font-size:38px;line-height:1.15;margin:0 0 14px;font-weight:700;
  letter-spacing:-.01em}
header.hero p{margin:0;max-width:62ch;color:#c8cfd8;font-size:15.5px}
header.hero p strong{color:#fff;font-weight:600}
.src{margin-top:22px;font-size:12.5px;color:#8a94a0;border-top:1px solid #2c333c;padding-top:16px}
.src a{color:#a8c4dc}

section{padding:46px 0;border-bottom:1px solid var(--hair)}
section:last-of-type{border-bottom:none}
h2{font-family:var(--serif);font-size:24px;margin:0 0 6px;font-weight:700;letter-spacing:-.01em}
h2 .en{font-family:var(--sans);font-size:13px;font-weight:400;color:var(--muted);margin-left:9px;letter-spacing:0}
.lede{color:var(--ink-2);max-width:68ch;margin:0 0 22px;font-size:15px}

.cta{display:inline-flex;align-items:center;gap:10px;background:var(--accent);color:#fff;
  text-decoration:none;padding:13px 22px;border-radius:7px;font-weight:700;font-size:15px}
.cta:hover{filter:brightness(1.12)}
.cta .sub{font-weight:400;opacity:.82;font-size:12.5px}

.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-top:20px}
@media(max-width:760px){.cards{grid-template-columns:1fr}}
.card{background:var(--panel);border:1px solid var(--hair);border-radius:8px;padding:16px}
.card h3{font-size:13.5px;margin:0 0 6px}
.card p{font-size:13px;color:var(--muted);margin:0;line-height:1.5}

.dlgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px;margin-top:12px}
a.dl{display:flex;justify-content:space-between;align-items:center;gap:10px;background:var(--panel);
  border:1px solid var(--hair);border-radius:6px;padding:10px 13px;text-decoration:none;color:var(--ink);
  font-size:13.5px}
a.dl:hover{border-color:var(--accent);background:#fbfcfd}
a.dl .n{font-family:var(--mono);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
a.dl .s{color:var(--muted);font-size:11px;flex:0 0 auto;font-family:var(--mono)}
h3.sub{font-size:13px;margin:22px 0 0;letter-spacing:.03em;color:var(--ink-2);
  text-transform:uppercase;font-weight:700}
h3.sub:first-of-type{margin-top:14px}

.note{background:#fdf9ee;border:1px solid #e9dcb8;border-radius:7px;padding:14px 16px;font-size:13.5px;
  color:#5a4c2c;margin-top:22px}
.note b{color:#3d3418}
ol.flow{counter-reset:s;list-style:none;padding:0;margin:18px 0 0;max-width:74ch}
ol.flow li{counter-increment:s;position:relative;padding:8px 0 8px 38px;border-bottom:1px dotted var(--hair);font-size:14.5px}
ol.flow li::before{content:counter(s);position:absolute;left:0;top:9px;font-family:var(--mono);font-size:11px;
  font-weight:700;color:#fff;background:var(--ink-2);width:21px;height:21px;border-radius:50%;
  display:grid;place-items:center}
ol.flow li b{color:var(--ink)}
footer{padding:34px 0 60px;font-size:12.5px;color:var(--muted)}
footer p{margin:0 0 7px;max-width:74ch}
code{font-family:var(--mono);font-size:12.5px;background:var(--tint);padding:1px 5px;border-radius:4px}
</style>
</head>
<body>

<header class="hero"><div class="wrap">
  <div class="eyebrow">Exam Matrix</div>
  <h1>요약이 아니라 <em style="font-style:normal;color:#9fc4e4">변별</em>과 <em style="font-style:normal;color:#9fc4e4">인출</em>로<br>만드는 시험 노트</h1>
  <p>시험 문제는 <strong>변별 과제</strong>입니다. 그럴듯한 선지 넷 중 하나가 특정 축에서 다릅니다.
  줄글 요약은 <strong>“그것이 무엇인지”</strong>는 적지만 <strong>“무엇과 헷갈리며 어디서 갈리는지”</strong>는 적지 않습니다.
  그래서 이 시스템의 저장 단위는 사실이 아니라 <strong>셀</strong> — 한 항목, 한 축, 한 값 — 이고,
  헷갈리는 것들 바로 옆에 놓입니다.</p>
  <div class="src">
    문사탐 / 문서연의 <b style="color:#c8d6e2">셀프엑셀표</b> 방법을 자격증 시험용으로 일반화했습니다.
    원 영상은 이 방법을 <b style="color:#c8d6e2">오답노트</b>라고 부릅니다 — 채워 넣을 그릇이 아니라 틀린 문제에서 걸러져 나오는 침전물입니다.
  </div>
</div></header>

<section><div class="wrap">
  <h2>1. 타이핑해서 만들기<span class="en">Type it</span></h2>
  <p class="lede">브라우저에서 바로 열리는 입력기입니다. 서버도 설치도 필요 없고, 태블릿에서도 됩니다.
  매트릭스는 표 편집기로 행·열을 추가하고 셀마다 표기(변별·예외·함정)를 지정합니다.
  입력 내용은 브라우저에 자동 저장되고, <code>.yaml</code>로 내려받거나 다시 불러올 수 있습니다.</p>
  <a class="cta" href="editor.html">입력기 열기 <span class="sub">Open the editor</span></a>
  <div class="cards">
    <div class="card"><h3>매트릭스 표 편집</h3><p>행·열 추가/삭제, 열과 셀마다 표기 지정, 음영 즉시 반영.</p></div>
    <div class="card"><h3>자동 저장 · 불러오기</h3><p>브라우저에 자동 저장. 기존 YAML을 불러와 이어서 편집.</p></div>
    <div class="card"><h3>한국어 · English</h3><p>인터페이스와 문서 언어를 각각 선택.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <h2>2. 인쇄해서 손으로 쓰기<span class="en">Print it blank</span></h2>
  <p class="lede">굿노트·노타빌리티·노트쉘프용 빈 양식입니다.
  <b>매트릭스의 열 머리말은 일부러 비워뒀습니다</b> — 비교축은 주제마다 달라야 하는 게 이 방법의 핵심이라,
  열을 미리 인쇄해두면 방법 자체가 망가집니다. 행 높이는 19–21mm로 타이핑판의 약 두 배입니다.</p>

  <div class="note"><b>낱장 PDF를 쓰세요.</b> 굿노트·노타빌리티는 <b>1쪽짜리 PDF를 속지 템플릿으로 등록</b>해
  노트 안에서 원하는 만큼 계속 추가하는 방식입니다. 12쪽 통합본은 그렇게 쓸 수 없어서 두 형태를 모두 넣었습니다.</div>

  <h3 class="sub">통합본 (12쪽, 북마크 포함)</h3>
  <div class="dlgrid">${dl(workbooks)}</div>

  <h3 class="sub">낱장 양식 — 한국어</h3>
  <div class="dlgrid">${dl(blankKo)}</div>

  <h3 class="sub">낱장 양식 — English</h3>
  <div class="dlgrid">${dl(blankEn)}</div>
</div></section>

<section><div class="wrap">
  <h2>3. 이렇게 돌아갑니다<span class="en">The cycle</span></h2>
  <p class="lede">엑셀표는 목적지가 아니라 <b>개념 → 엑셀표 → 문제풀이</b>의 중간 단계입니다.
  원 방법의 채널이 강의 제목에 그대로 써 둔 순서입니다.</p>
  <ol class="flow">
    <li><b>배운다.</b> 이 시스템이 대체하지 않는 부분입니다.</li>
    <li><b>시험이 무엇을 가르는지 찾는다.</b> 교재가 다루는 것이 아니라, 문제가 구분하라고 요구하는 것.</li>
    <li><b>비교축을 정한다.</b> 이게 열이 됩니다. 기본 열은 출발점일 뿐이니 바꾸세요.</li>
    <li><b>매트릭스를 채운다.</b> 행은 헷갈리는 항목들, 셀에는 사실과 <b>출제자의 표현</b>을 함께.</li>
    <li><b>예외와 함정을 더한다.</b> 답을 바꿀 수 있는 것만. 잡지식은 문서를 나쁘게 만듭니다.</li>
    <li><b>인출 훈련판을 쓴다.</b> 빈칸을 손으로 채웁니다. 먼저 보지 않습니다.</li>
    <li><b>문제를 푼다.</b></li>
    <li><b>오답으로 매트릭스를 고친다.</b> 틀린 문제는 <b>특정 셀</b>을 지목합니다. 주제가 아니라 셀입니다.</li>
    <li><b>압축한다.</b> L1 전체 → L2 시험 당일 → L3 마지막 10분.</li>
  </ol>
</div></section>

<section><div class="wrap">
  <h2>4. 예시 노트<span class="en">Worked examples</span></h2>
  <p class="lede">서로 무관한 네 시험, 여섯 유형 중 네 가지, 두 언어로 만든 예시입니다.
  같은 시스템이 시험 종류에 따라 열 구성과 지면 방향을 바꾸는 것을 보여줍니다.
  <b>모두 템플릿 시연용 샘플 데이터</b>이며 검증된 학습 자료가 아닙니다 — 특히 법령 예시는 법률 자문이 아닙니다.</p>

  <h3 class="sub">정보처리기사 (한국어) — 전체 · 인출 훈련판 · 정답지</h3>
  <div class="dlgrid">${dl(notes)}</div>

  <h3 class="sub">행정법 · 재무 · 조직심리 예시</h3>
  <div class="dlgrid">${dl(examples)}</div>
</div></section>

<footer><div class="wrap">
  <p><b>표기법.</b> CORE · DISTINCTION · EXCEPTION · TRAP · UPDATE · EVIDENCE 여섯 가지를
  라벨 · 테두리 · 음영 세 방식으로 중복 인코딩했습니다. 흑백 복사해도 정보가 사라지지 않습니다.</p>
  <p><b>샘플 데이터 고지.</b> 이 사이트의 모든 예시 내용은 템플릿을 시험하려고 작성한 것입니다.
  실제 수험 준비 전에 반드시 원문으로 검증하십시오.</p>
  <p style="margin-top:16px">생성 시각 ${new Date().toISOString().slice(0, 10)} · Exam Matrix</p>
</div></footer>

</body>
</html>
`;

fs.writeFileSync(path.join(OUT, 'index.html'), page);

let n = 0;
(function count(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) count(path.join(d, e.name)); else n++;
  }
})(OUT);

console.log(`  public/index.html   +  ${n - 1} files`);
console.log(`  downloads: ${workbooks.length} workbooks, ${blankKo.length + blankEn.length} blank templates, ${notes.length + examples.length} sample notes`);
