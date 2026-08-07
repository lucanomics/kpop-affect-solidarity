# Method Synthesis — from 셀프엑셀표 to a portable learning architecture

Companion to [`video-analysis.md`](./video-analysis.md), which holds the raw
evidence and the observed/inferred tagging. This file does three things:

1. tests the hypothesis sentence supplied in the brief against that evidence;
2. states the corrected abstraction;
3. maps it to the design decisions in `src/`, and marks what is *my* addition.

---

## 1. The hypothesis under test

The brief proposed this summary and instructed me not to accept it blindly:

> *Convert a large body of material into explicit comparison axes, place easily
> confused concepts side by side, and repeatedly test whether the learner can
> reconstruct or discriminate the cells.*

**Verdict: confirmed in substance, but incomplete in three specific ways.** It
describes the finished object accurately and misses how the object is *fed*, what
one of its axes actually *contains*, and why it must *shrink*.

### 1.1 What the hypothesis gets right

| Clause | Status | Evidence |
|---|---|---|
| "explicit comparison axes" | **Confirmed** | The artefact given a full hour of teaching is 일탈이론 — a canonical several-theories-one-attribute-set comparison (O10). Purpose is stated as discriminating 디테일 (O2). |
| "easily confused concepts side by side" | **Confirmed** | Follows directly from the above; the whole claimed payoff is telling near-identical exam statements apart (O7). |
| "repeatedly test … reconstruct or discriminate" | **Confirmed, with a caveat** | 에센셜 엑셀표 is described by the author as a 매주 누적되는 복습 시스템 — a weekly cumulative review system (O12). A viewer independently calls it 아웃풋 연습, output practice (O16). But *the instructor never uses the word "test."* The retrieval framing is well-supported inference (I4), not a quotation. |

### 1.2 Correction 1 — the intake mechanism is missing

The hypothesis describes converting "a large body of material." That is how the
*teacher's* distributed file works. It is not how the **셀프** (self) table works.

The author categorises this artefact, four separate times across the description
and pinned comment, as an **오답노트 / 오답 정리법** — an *error notebook* (O1).
The operative sentence is:

> 이 방식으로 **오답을 정리해서** 디테일을 잡으면 만점은 따라옵니다
> — organise **your wrong answers** this way and pin down the details, and full
> marks follow.

So the table is not primarily a top-down compression of a syllabus. It is a
bottom-up **precipitate of the learner's own errors** (I3). The syllabus supplies
the *schema*; mistakes supply the *rows and cells that actually get written*.

This matters enormously for the design. A system built on the uncorrected
hypothesis produces a beautiful pre-filled reference table — which is exactly the
"downloaded table" the author says is only the starting point (O7 vs. O13). A
system built on the corrected one must make **error → matrix cell** a first-class,
structural link. It is why `error_log` in this project carries a mandatory
`matrix_update` field pointing at a specific cell, rather than being a decorative
"what I got wrong" page.

### 1.3 Correction 2 — one axis is linguistic, not conceptual

"Comparison axes" implies attributes of the concept: *nature, requirement,
effect, deadline*. Those exist. But the sibling videos are titled, verbatim,
**"3개년 기출 표현 익히기 엑셀표"** — an Excel table for learning **three years of
past-exam expressions** (O6). The payoff is stated as recognition:
"시험장에서 너무 비슷하게 나와서" — because it comes out *so similar* in the exam
hall (O7). Secondary sources record his emphasis on **평가원의 워딩**, the exam
board's wording (O15).

So a cell holds two different kinds of thing:

- **what is true** — the propositional content, and
- **how the exam says it** — the examiner's characteristic phrasing for that truth,
  and the phrasings that look like it but are wrong.

This is not a nuance. It is the difference between a learner who knows a
distinction and one who recognises it *at speed, in the examiner's words, under
time pressure*. Every archetype in this system therefore carries an explicit
wording/cue field (`tested_as`, `frequently tested wording`, trap `cue`), and
the trap matrix is keyed on **the statement as the exam phrases it**, not on the
underlying concept.

### 1.4 Correction 3 — the table is supposed to shrink

The hypothesis is silent on lifecycle. The author is not. He describes a
**graded series** — keyword skeleton → 스펙트럼 (detail-filling) → 에센셜
(cumulative review) → the learner's own note (O11) — and grounds it in an
anti-volume claim: a student who studied 1–2 hours beats one who studied 10,
because of *frame* (O14).

An architecture that only ever accumulates contradicts the source method. Hence
the **compression ladder** (L1 full → L2 exam-day → L3 last-ten-minutes) is not
productivity garnish; it is the part of the original method the hypothesis
dropped.

### 1.5 The corrected abstraction

> Convert what the exam *actually discriminates* into explicit comparison axes;
> place confusable items side by side with both the fact and the examiner's
> wording for it; **grow the table from your own wrong answers**; repeatedly
> **reconstruct** the cells from memory rather than re-reading them; and
> **progressively compress** the result so that what survives to exam day is a
> frame, not an archive.

Seven verbs, which become the system's cycle:

```
LEARN → STRUCTURE → COMPARE → RETRIEVE → APPLY → CORRECT → COMPRESS
                        ↑                            │
                        └────────────────────────────┘
                          errors rewrite the matrix
```

The feedback arrow is the load-bearing part. Without it this is a nice table.

---

## 2. Why this works — the learning-science reading

Marked clearly as **interpretation**. The instructor makes no citations; he
reports what worked in his classroom over ten years. What follows is my mapping
of his practice onto established findings, and a mapping is not a validation.

| Element of the method | Corresponding effect | Why the table form matters |
|---|---|---|
| Reconstructing blanked cells instead of re-reading | **Retrieval practice / testing effect** — retrieval is a memory *modifier*, not just a readout | A grid is unusually well-suited: row and column labels survive as retrieval *cues* while the answer is withheld, giving cued recall rather than free recall or recognition |
| Confusable items placed side by side | **Discrimination / contrast learning**; interleaving | Blocked study of A then B teaches each in isolation; a shared attribute row forces the *difference* to be encoded, which is what a multiple-choice distractor probes |
| Errors as the intake | **Error-driven learning; hypercorrection effect** — confidently-held errors, once corrected, are corrected unusually durably | Routing each error to a *named cell* converts "I got Q17 wrong" into "my *deadline* column for administrative appeal is wrong," which is a repairable representation |
| The examiner's wording stored with the fact | **Transfer-appropriate processing** — retrieval succeeds when study conditions match test conditions | The test presents *sentences*, not concepts; storing the sentence form narrows the gap |
| L1 → L2 → L3 compression | **Desirable difficulty**; progressive elaboration in reverse | Deciding what to *cut* is itself a discrimination judgement about what the exam rewards |
| Weekly cumulative table (에센셜) | **Spaced repetition / distributed practice** | Cumulative-by-week is a coarse but low-friction schedule that a learner will actually keep |

Two honest caveats:

1. The strongest claim in the source material — "만점은 따라옵니다" (full marks
   follow) — is promotional. Treat it as a description of intent.
2. Retrieval practice and interleaving are robust findings; *this particular
   packaging* of them has not been tested. What can be said is that the method's
   components are individually well-supported, which is a better position than
   most study-method content occupies.

---

## 3. What survives generalisation, and what does not

The source method is tuned for Korean CSAT social-studies: a fixed syllabus,
memorisation-heavy, five-choice items, a single annual exam, one exam board with
a stable house style.

### 3.1 Transfers unchanged

- **Discrimination as the unit of storage.** Every exam that uses distractors
  rewards it. This is the invariant.
- **Error → cell feedback.** Domain-independent.
- **Examiner-wording capture.** Any exam with a standing item-writing style —
  which is every professional certification body.
- **Compression before the exam.** Universal.

### 3.2 Transfers, but must be reshaped

- **The columns.** 사회문화's axes are useless for a networking exam. Hard-coding
  one universal column set would be the single worst design decision available —
  it would produce a template whose fields are either wrong or so generic as to be
  meaningless. Hence the three-level schema (§4).
- **"암기가 필요한 과목" (memorisation subjects).** The author scopes his claim
  there (O3), and he is right to. A calculation exam does not reward recalling a
  formula; it rewards *selecting* the right one under a trigger condition and not
  botching units. So for calculation archetypes the discrimination is
  **"which method, and when"** — `when_to_use`, `similar_formula`,
  `common_mistake` — rather than "what does it mean." Same structure, different
  question asked of it.
- **Volatility.** CSAT content is stable year to year. Law, tax, medical
  guidelines, and IT certification syllabi are not. A fact with no version date
  is a liability. This project adds `version`/`as_of`/`UPDATE` markers, which have
  no counterpart in the source method — see §5.

### 3.3 Does not transfer

- The specific subjects, the downloadable files, and 상황판단/영점찾기/큐브돌리기,
  which are CSAT item-attack techniques, not general principles.
- The assumption of a single high-stakes annual date.

---

## 4. The three-level schema (the central design decision)

Trying to satisfy "works for any exam" with one giant optional-field table
produces the failure mode the brief names explicitly: *a "universal" template made
universal by making every field optional and meaningless*. The evidence points the
other way — his tables are **tight and subject-specific**, and that tightness is
what makes them useful.

Resolution: fix what is genuinely universal, template what is
archetype-specific, and let the learner own what is topic-specific.

| Level | Scope | Who decides | Example |
|---|---|---|---|
| **L1 — Universal** | Exam metadata, blueprint, error log, review state, compression ladder, evidence links | Fixed by the system | `exam.name`, `error_log[].error_type` |
| **L2 — Archetype** | Default column sets per exam type: `concept`, `law`, `calculation`, `it`, `language`, `procedure` | Chosen by the learner from six presets | `law` → 법적 근거 / 요건 / 효과 / 기간 / 예외 |
| **L3 — Topic** | The actual comparison axes for *this* topic | Written by the learner, overriding L2 | TCP vs UDP → 연결성 / 신뢰성 / 순서보장 / 헤더 |

L2 exists so a learner starting a new certification is not facing a blank page.
L3 exists because **the axes must match what the exam actually distinguishes**,
and only the learner knows that after seeing real questions. Every example in
`examples/` overrides at least some L2 defaults at L3 — that is the intended
usage, not an exception to it.

---

## 5. Additions that are mine, not his

Stated separately so the lineage stays honest. These solve problems a Korean
CSAT instructor did not have to solve.

| Addition | Why certification exams need it |
|---|---|
| **Version / `as_of` tracking, `UPDATE` marker** | Law, tax, and IT syllabi change between sittings. A correct-in-2023 cell is a wrong answer in 2026. CSAT does not have this problem. |
| **Six archetypes with distinct column sets** | He taught two subjects of one type. A general system meets six. |
| **Formal `DECISIVE DISTINCTION` prompt** | His side-by-side layout implies it; forcing it into a single written sentence ("if an examiner made you use *one* criterion…") makes the implicit explicit and is the thing most likely to be actually recalled. |
| **Generated Recall Edition + answer key** | He reviews the same sheet weekly. Mechanically generating a blanked twin removes the discipline problem — you cannot accidentally read the answer. This is the most substantive functional addition. |
| **Structured evidence links** (`exam/year/question/tested_as/risk`) | "기출에서 답을 찾는" as a data structure rather than a habit. |
| **Blueprint page with weights** | Certifications publish domain weightings; CSAT's are fixed and known. Weighting drives what deserves a matrix at all. |
| **Grayscale-redundant semantic markers** | His artefact is a colour spreadsheet on a screen. A printed, annotated, photocopied PDF cannot rely on hue. |

And two things deliberately **not** added, per the brief's warning against
productivity decoration: no streaks, no scores, no motivational furniture, and no
review scheduler beyond six checkboxes. The review tracker is intentionally the
least prominent element on its page.

---

## 6. Design consequences, traced

| Principle (from video-analysis §7) | Where it lives in the build |
|---|---|
| P1 discrimination is the unit | `matrix` is mandatory per topic; `decisive.question` + `decisive.answer`; `confusion_pairs` |
| P2 examiner's wording is content | `tested_as`, trap `cue`, `evidence[]`; `EVIDENCE` marker |
| P3 error-driven intake | `error_log[].matrix_update` → cell reference; Error Log page |
| P4 detail is the win condition | `EXCEPTION`/`TRAP` markers rendered with heaviest visual weight |
| P5 pipeline stage, not endpoint | topic page order: essentials → matrix → distinction → traps → evidence |
| P6 cumulative scheduled review | `review` row: learned / R1 / R2 / R3 / mastered / revisit |
| P7 learner-built | Recall Edition; generous cell height for handwriting; `init-exam` scaffolds an *empty* schema |
| P8 structure beats volume | **max 5** essentials, enforced by the schema; L2/L3 compression pages |
| P9 transfers to certification | six archetypes; four unrelated worked examples |

---

## 7. Sources

- Primary: video `X3Wh-l7V8oA` description, pinned comment, and comment thread;
  sibling videos `wAM_tkP-ch8`, `-784Xp01qS0`, `p28rwGRbRnc`, `xvERJmKRXQg`
  (all 문사탐 / `@moonsatam`), retrieved via YouTube InnerTube API 2026-08-07.
  Full extraction method and limitations in `video-analysis.md` §2 and §9.
- Secondary: public reference material on instructor 문서연 (SKY Edu), used only
  for O15 (emphasis on 평가원 wording).
- Learning-science mappings in §2 are my interpretation and are not claimed by
  the source.
