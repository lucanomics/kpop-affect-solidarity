# Exam Matrix

**A printable study-note system built on discrimination and retrieval, not summarisation.**
Give it a YAML file describing what your exam actually distinguishes; it gives you
an A4 workbook, a retrieval-practice twin with the important cells withheld, and
an answer key.

Generalised from the 셀프엑셀표 ("self Excel table") method taught by 문사탐 /
문서연 — see [Design lineage](#design-lineage-from-the-reference-video).

```bash
npm install
npm run build        # every example → output/
npm run qa           # inspect the generated PDFs
npm run init         # scaffold a YAML for your own exam
```

Output for the primary example:

| File | What it is |
|---|---|
| `output/universal-study-notes.pdf` | **L1** — the full matrix, everything visible |
| `output/universal-study-notes-recall.pdf` | The same document with ~45% of the discriminating cells withheld, ruled for handwriting |
| `output/universal-study-notes-answer-key.pdf` | Numbered answers for the recall edition |

---

## Philosophy

Most study templates are containers for summaries. This one is not, because
summaries are not what exams test.

An exam question is a **discrimination task**. You are shown four or five
statements that are all plausible, and one differs from the others on a specific
axis. Nothing in a linear summary prepares you for that, because a summary
records *what a thing is* and never records *what separates it from the thing it
will be confused with*. Candidates who "know the material" and still lose marks
almost always lose them in the same place: the boundary between two adjacent
concepts, or the exception to a rule they learned as absolute.

So the unit of storage here is not the fact. It is the **cell** — one item, one
axis, one value — sitting in a grid next to the items it is confused with.

Three consequences follow, and they are the whole design:

**1. The grid is a retrieval instrument, not a reference.**
Re-reading a table feels like studying and is nearly worthless. The same table
with cells withheld is a cued-recall test: the row and column labels stay as
cues, the answer is gone, and you have to reconstruct it. That is why the Recall
Edition is generated from the same data rather than maintained separately —
there is no version of this system in which you *only* read.

**2. Errors are the intake mechanism.**
Every entry in the error log names the matrix cell it invalidates. Not the topic
— the cell. "I got question 17 wrong" is not actionable; "my *deadline* column
for administrative appeal is wrong" is. Dangling references fail the build, so
the link cannot rot.

**3. The notes are supposed to shrink.**
L1 is complete. L2 is what you review on exam morning. L3 is one page you read in
the last ten minutes. Deciding what to cut is itself a judgement about what the
exam rewards, which is why the compression ladder is part of the system and not
an afterthought. The schema caps "essential facts" at five and the build warns
when the L3 sheet stops being a sheet.

What this system deliberately does **not** have: streaks, scores, progress
percentages, motivational quotes, or a review scheduler with opinions. The review
tracker is six checkboxes and is the least prominent element on its page.

---

## Workflow

1. **Learn** the topic from whatever source you normally use. This system does
   not replace that.
2. **Identify what the exam distinguishes.** Not what the textbook covers — what
   the questions force you to tell apart. This usually requires seeing real
   questions first.
3. **Define the comparison axes.** These become your columns. Steal the
   archetype defaults to start, then replace them.
4. **Populate the matrix.** Rows are the confusable items; cells hold both the
   fact and, where it matters, the examiner's phrasing for it.
5. **Add traps and exceptions.** Only things that can change an answer choice.
   Trivia makes the document worse.
6. **Link evidence.** Which past question tested this cell, and in what wording.
7. **Use the Recall Edition.** Write in the blanks. Do not look first.
8. **Solve questions.** The matrix is a stage, not a destination.
9. **Update the matrix from your errors.** Each wrong answer edits a named cell.
   Rebuild; the recall edition now tests the corrected cell.
10. **Compress.** L1 → L2 → L3 as the date approaches.

---

## The data model

Content lives in YAML; presentation lives in `src/`. You can replace the data
without touching a template.

Three levels, which is how the system stays usable across unrelated exams
without collapsing into a bag of optional fields:

| Level | Scope | Who decides |
|---|---|---|
| **L1 — Universal** | Exam metadata, blueprint, error log, review, compression ladder, evidence links | Fixed by the system |
| **L2 — Archetype** | Default column sets for `concept`, `law`, `calculation`, `it`, `language`, `procedure` | You pick one of six |
| **L3 — Topic** | The actual comparison axes for *this* topic | You write them |

L2 exists so you never face a blank page. **L3 is where the value is** — the axes
must match what your exam actually tests, and only you know that. Every example
in `examples/` overrides L2 at L3; that is the intended usage.

```yaml
topics:
  - id: tcp-udp
    title: TCP vs UDP
    archetype: it
    one_sentence: >-            # withheld in the Recall Edition
      TCP는 연결을 먼저 맺고 …
    essentials: [ … ]           # five maximum, enforced

    matrix:
      row_label: 프로토콜
      columns:                  # L3 — override the archetype freely
        - { key: header, label_ko: 헤더 크기, mark: trap }
      rows:
        - label: TCP
          cells:
            header: { v: 20바이트 (옵션 제외), mark: trap }

    decisive:                   # "if you had ONE criterion, what would it be?"
      answer: …
      pairs: [{ a: …, b: …, why: …, clue: … }]

    traps:                      # keyed on the statement as the exam phrases it
      - { cue: …, usually: …, exception: …, why: …, source: … }

error_log:
  - matrix_update: { topic: tcp-udp, row: TCP, column: header }   # structural
```

Full schema with field-by-field notes: [`schema/exam.schema.json`](schema/exam.schema.json).

### Semantic markers

`CORE` · `DISTINCTION` · `EXCEPTION` · `TRAP` · `UPDATE` · `EVIDENCE`

Each is encoded three ways — a text label, a border treatment, and a tint —
because the PDF will be photocopied in black and white and colour alone would not
survive. `UPDATE` exists because law, tax and IT syllabi change between sittings
and a correct-in-2023 cell is a wrong answer today.

---

## Adapting it to a new certification

```bash
npm run init
```

It asks the handful of questions whose answers change the document's structure —
language, awarding body, date, which of the six archetypes fits, whether the
content is version-sensitive — and writes a commented starter YAML with the
matching column set and one skeleton topic. It builds immediately, so you can see
the shape before you fill it in.

Then, in order of importance:

1. **Replace the columns.** The generated ones are a guess. After one past paper
   you will know what the exam actually separates; rewrite the axes to match and
   delete any column you are keeping out of politeness.
2. **Choose rows that get confused.** A matrix with one row is a summary. Put the
   thing next to the thing it is mistaken for.
3. **Mark the cells.** `distinction`, `exception` and `trap` cells are withheld
   preferentially in the Recall Edition, so marking is what tunes your practice.
4. **Fill the error log as you go**, always naming a cell.

Building:

```bash
node scripts/build.js examples/law.yaml          # one file → output/examples/
node scripts/build.js --primary law              # law owns the top-level filenames
node scripts/build.js --html                     # keep the intermediate HTML
node scripts/visual-qa.js --png                  # write page rasters to qa/
```

---

## Technical choices

**HTML + CSS → Chromium print-to-PDF** (`playwright-core`), rather than Typst or
LaTeX. The decision was made against what this document actually needs:

| Requirement | Why this stack |
|---|---|
| Korean and Latin in one document | System Noto Sans/Serif CJK KR; Chromium shapes Hangul correctly and subsets the fonts into the PDF. `word-break: keep-all` stops Korean breaking mid-word — the single most visible difference between typeset and machine-set Hangul. |
| Repeated header on page breaks | `thead { display: table-header-group }` is native and verified in QA. |
| Portrait and landscape in one file | CSS named pages (`@page land`) — verified working before any of the design was written. |
| Automatic pagination | Free. |
| Print reliability | It is a browser print path, which is the most-tested PDF pipeline in existence. |

Typst and LaTeX were not installed and would have needed CJK font plumbing;
neither offered anything this document needs that Chromium does not. The real
reason, though, is that the matrix layout requires *measuring content to choose a
page orientation*, and doing that in JS next to the renderer is far simpler than
in a macro language.

**Adaptive layout.** `src/lib/layout.js` chooses portrait or landscape from
column count and content density, and splits wide matrices across pages with the
row-label column repeated. Font size is never the variable — a table that does
not fit gets more page, or gets split. `src/render.js` then stretches row heights
so a short matrix uses its page, and sizes the "detail I added myself" block to
absorb whatever is left.

**QA inspects the output, not the source.** `scripts/visual-qa.js` reads page
geometry from `pdfinfo`, word bounding boxes from `pdftotext -bbox-layout`, and
page ink from a greyscale raster, then fails the build on: non-A4 pages, any
glyph within 6mm of a trim edge, text below 7pt, blank pages, replacement
characters, a Korean document with no Hangul in its text layer, and matrix
continuation pages missing their repeated header.

### Requirements

Node 18+, and two system packages:

```bash
apt-get install fonts-noto-cjk poppler-utils   # fonts + QA tooling
npm install
```

Without `fonts-noto-cjk` Korean will not render. `poppler-utils` is only needed
for `npm run qa`.

---

## Repository layout

```
├── research/
│   ├── video-analysis.md      evidence record for the reference video
│   └── method-synthesis.md    the abstraction, and what is mine vs. his
├── schema/exam.schema.json    the contract
├── examples/                  four unrelated exams, four archetypes, two languages
│   ├── law.yaml               행정심판/행정소송/이의신청 — 10 columns, splits across pages
│   ├── it.yaml                TCP/UDP, CPU scheduling (primary)
│   ├── calculation.yaml       NPV/IRR/Payback/PI, depreciation methods
│   └── conceptual.yaml        motivation theories, reliability vs validity
├── src/
│   ├── lib/archetypes.js      L2 column sets + marker definitions
│   ├── lib/model.js           load, validate, resolve cell references
│   ├── lib/layout.js          orientation and column-splitting
│   ├── lib/recall.js          deterministic cell withholding
│   ├── render.js              every page template
│   └── styles.css             the print design system
├── scripts/{build,init-exam,visual-qa}.js
└── output/
```

---

## Design lineage from the reference video

The primary reference is
**[youtube.com/watch?v=X3Wh-l7V8oA](https://www.youtube.com/watch?v=X3Wh-l7V8oA)**
— 문사탐, *만점을 위한 셀프엑셀표 만들기 I 디테일을 잡아야 만점이 나온다!!!*,
published 2020-01-30, 8:48.

**Access, stated honestly.** This session's network policy blocked
`youtube.com` and every video front-end. **I did not watch the video and have not
seen its Excel table**, so nothing here imitates its visual design, and there are
no quotations from speech and no spoken-word timestamps — the auto-generated
Korean captions provably exist but were not retrievable. What I did retrieve,
first-party via YouTube's own API, was the video's full description, the pinned
author comment, the public comment thread, and the descriptions of four sibling
videos shipping the same artefact. For a method explainer, the creator's own
prose about the method is strong evidence. Full record and limitations:
[`research/video-analysis.md`](research/video-analysis.md).

*(The brief described this as a "57-second clip". It is 8 minutes 48 seconds; the
`&t=40s` in the supplied URL is a start offset, not a clip boundary.)*

### What the evidence showed

- The 셀프엑셀표 is categorised by its author, repeatedly, as an **오답노트** — an
  *error notebook*. It is not a summary device. *"이 방식으로 오답을 정리해서
  디테일을 잡으면 만점은 따라옵니다."*
- Its purpose is **디테일** — detail. The title is literally "you have to nail
  the details to get full marks".
- The sibling videos are titled **"3개년 기출 표현 익히기 엑셀표"** — an Excel
  table for learning **three years of past-exam *expressions***, organised by
  syllabus unit. The payoff is stated as recognition: *"시험장에서 너무 비슷하게
  나와서"* — because it comes out so similarly in the exam hall.
- Another is titled **"일탈이론 총정리 — 개념, 엑셀표, 문제풀이"**: concept →
  Excel table → problem practice. The table is a stage in a pipeline.
- A 2026 video names the whole system: keyword skeleton → 스펙트럼 엑셀표
  (detail) → **에센셜 엑셀표 — 매주 누적되는 복습 시스템** (weekly cumulative
  review) → 엑셀표 노트 ("**본인만의** 최종 무기") → problem drills. And:
  *"10시간 공부한 학생보다 1~2시간 공부한 학생이 더 잘 나온다"* — structure beats
  volume.
- Decisively for this project, the creator writes, unprompted: *"제 채널에
  **공무원시험** 준비하시는 분들이 많이 계신걸 알고 있어요! 이 엑셀표로
  공부하시면 도움이 되실거에요!"* — **generalising the method to
  certification/civil-service exams is his claim about his own artefact, not my
  extrapolation.** A commenter independently reaches for it as *"법공부 아웃풋
  연습"* — output practice for law study.

### Preserved

- **Discrimination as the unit of storage.** Confusable items side by side on
  shared axes. This is the invariant.
- **The examiner's wording as first-class content**, not metadata — hence
  `tested_as`, trap `cue`, and the evidence table.
- **Error-driven intake.** The matrix grows from wrong answers.
- **Detail as the win condition** — `EXCEPTION` and `TRAP` carry the heaviest
  visual weight on the page.
- **Table as a stage, not a destination** — the topic page order is essentials →
  matrix → distinction → traps → evidence, and the compression ladder ends it.
- **Cumulative, scheduled review**, kept deliberately minimal.
- **The artefact must be learner-built.** `npm run init` scaffolds an *empty*
  schema, and every matrix page carries a "detail I added myself" block. A
  downloaded table is only a starting schema — that is his position, not a
  disclaimer.

### Generalised

- **One subject-specific spreadsheet → six archetypes.** His two subjects were
  both memorisation-heavy humanities. A calculation exam does not reward
  recalling a formula, it rewards *selecting* one under a trigger condition — so
  for that archetype the axes became `when_to_use` / `common_mistake` /
  `similar_formula`. Same structure, different question asked of it.
- **A fixed sheet → a three-level schema**, so the axes can change per topic
  without redesigning pages.
- **A screen spreadsheet → a print document**: A4, duplex, grayscale-redundant
  markers, safe trim margins, handwriting space.

### Added, and not his

Stated separately so the lineage stays honest. These solve problems a Korean CSAT
instructor did not have.

- **A generated Recall Edition and answer key.** He reviews the same sheet
  weekly; mechanically withholding cells removes the discipline problem, because
  you cannot accidentally read the answer. This is the most substantive addition.
- **Version tracking** (`syllabus_version`, `as_of`, the `UPDATE` marker). CSAT
  content is stable year to year; law and IT syllabi are not.
- **A formal decisive-distinction prompt.** His side-by-side layout implies it;
  forcing it into one written sentence makes it explicit.
- **Structural error → cell references**, validated at build time.
- **A blueprint page with domain weights.** Certifications publish weightings;
  CSAT's are fixed and known.

### Not claimed

I do not know the column headers of his actual spreadsheet, or what is said at
any second of the video. The method's components — retrieval practice,
interleaved comparison, error-driven correction, spacing — are individually
well-supported in the learning-science literature; *this packaging* of them has
not been tested, and the source's "만점은 따라옵니다" is promotional. Reasoning in
[`research/method-synthesis.md`](research/method-synthesis.md) §2.

---

## Sample data

Everything in `examples/` is **illustrative sample data written to exercise the
template**, not verified study material. The law example in particular is not
legal advice. Verify against primary sources before relying on any of it.
