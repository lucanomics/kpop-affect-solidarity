# Video Analysis — Primary Design Reference

> This file is the evidence record for the research gate. Every claim is tagged
> **[OBSERVED]** (retrieved directly from a first-party source) or **[INFERRED]**
> (my reconstruction from observed evidence). Access limitations are stated in full.

---

## 1. Identification of the reference video

| Field | Value | Provenance |
|---|---|---|
| URL | `https://www.youtube.com/watch?v=X3Wh-l7V8oA&t=40s` | supplied in brief |
| Canonical URL | `https://www.youtube.com/watch?v=X3Wh-l7V8oA` | — |
| Video ID | `X3Wh-l7V8oA` | — |
| Title | 만점을 위한 셀프엑셀표 만들기 I 디테일을 잡아야 만점이 나온다!!! | **[OBSERVED]** |
| Title (translated) | "Making a self-Excel-table for a perfect score — you have to nail the details to get full marks!!!" | translation |
| Channel | 문사탐 (Moonsatam), handle `@moonsatam` | **[OBSERVED]** |
| Instructor | 문서연 (Moon Seo-yeon), 사회탐구 instructor, SKY Edu | **[OBSERVED]** (secondary) |
| Subscribers | 44,400 (구독자 4.44만명) at time of retrieval | **[OBSERVED]** |
| Published | **2020-01-30** (`dateText: "2020. 1. 30."`) | **[OBSERVED]** |
| Duration | **8:48** (528 s) | **[OBSERVED]** |
| Views | 4,347 (조회수 4,347회) | **[OBSERVED]** |
| Likes | 94 | **[OBSERVED]** |
| Captions | Auto-generated Korean exist (`kind: "asr"`, `languageCode: "ko"`) | **[OBSERVED]** |

**Verification status: the exact video exists and was retrieved.** Title, channel,
publish date, duration, view/like counts, the complete description, the pinned
author comment, and the public comment thread were all pulled from YouTube's own
InnerTube API (`youtubei.googleapis.com/youtubei/v1/next`, `/search`), not from
a third-party summary.

### Correction to a premise in the brief

The brief refers to this as an "isolated 57-second clip". **It is not.** The video
is **8 minutes 48 seconds** long. The `&t=40s` in the supplied URL is a start
offset at 00:40, not a clip boundary. The design below is therefore based on a
full-length method explainer, not a fragment.

---

## 2. Access limitations (stated honestly)

This session's network egress policy blocks `www.youtube.com`, `m.youtube.com`,
`youtu.be`, `i.ytimg.com`, all Invidious/Piped front-ends, all third-party
transcript services, and `web.archive.org`. Only `*.googleapis.com` is reachable.

Consequences, stated plainly:

1. **I did not watch the video.** No video frames, no thumbnails, no screenshots.
   Any statement about what the on-screen Excel table *looks like* is
   **[INFERRED]**, never observed. I have not reproduced its visual design,
   because I have not seen it.
2. **I could not retrieve the caption text.** The captions provably exist — the
   transcript panel parameters decode to a protobuf carrying
   `{1:"asr", 2:"ko"}` — but `youtubei/v1/get_transcript` is not exposed on the
   one reachable host (`youtubei.googleapis.com` returns
   `400 FAILED_PRECONDITION` for that method, while `/next` and `/search`
   succeed). The `player` endpoint, which carries the caption `baseUrl`, is
   bot-gated (`playabilityStatus: LOGIN_REQUIRED`) for every client I tried
   (WEB, MWEB, IOS, ANDROID, ANDROID_CREATOR, TVHTML5_SIMPLY_EMBEDDED_PLAYER).
3. **Therefore there are no spoken-word quotes and no spoken-word timestamps in
   this document.** I have fabricated neither. Every timestamp-like reference
   below is to a *published text field*, not to speech.

What I do have is substantial and first-party: the creator's own written
description of this video, his own pinned comment, his own descriptions of the
sibling videos that ship the same artefact, and his own 2026 video description
that names the complete system. For a method explainer, the creator's own prose
about the method is strong evidence.

---

## 3. Primary evidence — the video's own text

### 3.1 Full description (verbatim)

```
셀프엑셀표 파일 다운 받으실 수 있는 링크입니다.
https://skyedu.conects.com/teachers/board_data_list/?t_id=mst01&document_srl=25176909&cat1=1

이 세상에 수천, 수만개의 공부법이 존재하듯 오답 정리법도 다양합니다.
이 방법은 쌤의 방법인 것이지요!!! ㅎㅎㅎ

그런데 이 오답노트의 효과는 정말 최고입니다!
디테일 잡는데 짱이거든요^^

암기가 필요한 과목의 경우 이 방식으로 오답을 정리해서 디테일을 잡으면!!!
후후후 만점은 따라옵니다!!
```

Translation:

> Here's the link to download the self-Excel-table file. […]
> Just as there are thousands and tens of thousands of study methods in this
> world, there are many ways of organising wrong answers. This one is *my* way!!!
> But the effect of this error-notebook is truly the best! It's unbeatable for
> pinning down the details.
> For subjects that require memorisation, if you organise your wrong answers this
> way and pin down the details — heh heh — a perfect score follows!!

### 3.2 Pinned author comment (verbatim, by `@moonsatam`)

```
셀프엑셀표 파일 다운 받으실 수 있는 링크입니다.
https://skyedu.conects.com/teachers/board_data_list/?t_id=mst01&document_srl=25176909&cat1=1

이 세상에 수천, 수만개의 공부법이 존재하듯 오답 정리법도 다양합니다.
이 방법은 쌤의 방법인 것이지요!!! ㅎㅎㅎ

하지만 분명 효과가 있어요!
디테일 잡는데 이만한 오답노트는 없다고 생각하거든요^^

암기가 필요한 과목의 경우 이 방식으로 오답을 정리해서 디테일을 잡으면!!!
후후후 만점은 따라옵니다!!
```

Note the variant line: **"디테일 잡는데 이만한 오답노트는 없다"** — "I don't think
there's an error-notebook to match this one for pinning down details."

### 3.3 What the video's own text establishes

- **[OBSERVED] O1.** The 셀프엑셀표 ("self-Excel-table") is explicitly and
  repeatedly categorised by its author as an **오답노트 / 오답 정리법** — an
  *error notebook* / *a way of organising wrong answers*. It is not presented as
  a summary note.
- **[OBSERVED] O2.** Its stated purpose is **디테일** (detail): the title says
  "디테일을 잡아야 만점이 나온다" (you must pin down the details to get full
  marks) and the body says it is "짱" / unmatched *for pinning down details*.
- **[OBSERVED] O3.** The author scopes it: **"암기가 필요한 과목의 경우"** — for
  subjects that require memorisation. He does not claim universality here.
- **[OBSERVED] O4.** There is a **teacher-provided downloadable file**
  (skyedu.conects.com) *and* the artefact is named **"셀프"** (self) — the prefix
  marks the student-built version as distinct from the distributed one.
- **[OBSERVED] O5.** The author frames the method as personal and non-exclusive
  ("이 방법은 쌤의 방법인 것이지요") — an invitation to adapt rather than a
  doctrine.

---

## 4. Corroborating evidence — the same artefact in sibling videos

These are other videos by the **same channel** shipping the **same artefact**.
Their descriptions are far more explicit about the table's internal structure
than the target video's description is.

### 4.1 `wAM_tkP-ch8` — 사회문화 엑셀표 (2020-02-19, 5:50)

Title: **"3월 학력평가 대비 - 사회문화 엑셀표 [3개년 기출 표현 익히기 엑셀표 첨부 링크]"**
— "March mock-exam prep — Social & Cultural Studies Excel table
[**Excel table for learning 3 years of past-exam expressions**, link attached]"

Description (verbatim excerpt):

```
기출에서 답을 찾는 3개년 기출 단원별 엑셀표입니다!

3월 학평의 3개년 기출을 통해 모의고사 표현을 익히는 시간!!!
이 엑셀표만 익히고 가도 깜짝 놀랄거에요 ㅎㅎㅎ
시험장에서 너무 비슷하게 나와서 말이지요!!

ps.
제 채널에 공무원시험 준비하시는 분들이 많이 계신걸 알고 있어요!
이 엑셀표로 공부하시면 도움이 되실거에요!
문쌤이 모든 수험생을 응원합니다!
```

Translation:

> It's a **unit-by-unit Excel table of 3 years of past questions**, which finds
> the answers *in the past questions themselves*.
> Time to learn the **phrasing** of the mock exams through 3 years of past
> questions! Just learning this Excel table will surprise you — because what
> comes up in the exam hall is *so* similar!!
> PS. I know a lot of people preparing for the **civil-service exam** are on my
> channel! **Studying with this Excel table will help you too!** Teacher Moon
> cheers on every exam candidate!

- **[OBSERVED] O6.** The table's organising content is **기출 표현** — the
  *wording/expressions used in past exam questions* — indexed **단원별** (by
  syllabus unit), across **3 years**.
- **[OBSERVED] O7.** The stated payoff is *recognition of recurring phrasing*
  ("시험장에서 너무 비슷하게 나와서" — because it comes out so similar in the exam
  hall). The unit of value is the examiner's sentence, not the textbook's.
- **[OBSERVED] O8 — the single most important finding for this project.** The
  creator himself states, unprompted, that the same Excel table is useful to
  **공무원시험 (civil-service examination)** candidates. Generalising this method
  beyond Korean CSAT subjects is not my extrapolation; it is the author's own
  claim about his own artefact.

### 4.2 `-784Xp01qS0` — 생활과 윤리 엑셀표 (2020-02-25, 10:07)

Same title pattern, same description body, different subject (Ethics). The
artefact is **subject-independent within his teaching** — the same table schema
is re-applied to a completely different syllabus.

### 4.3 `p28rwGRbRnc` — 일탈이론 총정리 (2022-01-18, 1:03:13)

Title: **"일탈이론 총정리 - 개념, 엑셀표, 문제풀이"**
— "Deviance theory, complete review — **concept, Excel table, problem-solving**"

- **[OBSERVED] O9.** The title states the pipeline explicitly and in order:
  **개념 → 엑셀표 → 문제풀이** (concept → Excel table → problem practice). The
  Excel table sits *between* learning and application. It is a processing stage,
  not a destination.
- **[OBSERVED] O10.** The chosen topic, **일탈이론** (deviance theory), is a
  canonical *multi-theory comparison* topic — Merton's strain theory vs.
  differential association vs. labelling theory vs. conflict theory. A one-hour
  lesson devoted to it, structured around an Excel table, indicates the table's
  natural shape is *several comparable items × several shared attributes*.

### 4.4 `xvERJmKRXQg` — 만점 프레임 (2026-02-11, 23:03)

The most recent and most complete first-party statement of the system.
Description (verbatim excerpt):

```
사회탐구에서 만점은 시간 싸움이 아닙니다. 10시간 공부한 학생보다 1~2시간 공부한
학생이 더 잘 나오는 이유, 그건 '프레임'이 있느냐 없느냐의 차이입니다.

✅ 만점 키워드 — 시험에 나오는 모든 것의 뼈대
✅ 스펙트럼 엑셀표 — 개념의 디테일을 채우는 핵심
✅ 에센셜 엑셀표 — 매주 누적되는 복습 시스템
✅ 엑셀표 노트 — 본인만의 최종 무기 (10년간 검증)
✅ 문제풀이 훈련 — 상황판단, 영점찾기, 큐브돌리기까지
```

Translation:

> A perfect score in social studies is not a fight about time. The reason a
> student who studied 1–2 hours outscores one who studied 10 is the difference
> between having a **frame** and not having one.
> ✅ **Perfect-score keywords** — the skeleton of everything that appears on the exam
> ✅ **Spectrum Excel table** — the core that fills in conceptual detail
> ✅ **Essential Excel table** — a **weekly cumulative review system**
> ✅ **Excel-table note** — your own final weapon (10 years validated)
> ✅ **Problem-solving drill** — situation judgment, zeroing-in, cube-turning

- **[OBSERVED] O11.** There is not one Excel table but a **graded series**:
  a keyword skeleton → a detail-filling table (스펙트럼) → a cumulative-review
  table (에센셜) → the learner's own note (엑셀표 노트) → problem drills.
  This is a **compression / progression ladder**, stated by the author.
- **[OBSERVED] O12.** 에센셜 엑셀표 is described as a **매주 누적되는 복습 시스템**
  — an explicitly *cumulative, scheduled review* system. Spaced review is part
  of the original method, not an add-on I invented.
- **[OBSERVED] O13.** The 엑셀표 노트 is "**본인만의** 최종 무기" — *your own*
  final weapon. This re-states O4: the terminal artefact is learner-built.
- **[OBSERVED] O14.** "10시간 공부한 학생보다 1~2시간 공부한 학생이 더 잘 나온다"
  — the claim is that *structure beats volume*. This is an anti-bloat principle
  and it is the author's, not mine.

### 4.5 Secondary source — instructor profile

Public reference material on 문서연 states that he teaches every course, from
스펙트럼 through the final course, **using Excel tables**, and that he emphasises
**평가원의 워딩** — the *wording of the KICE exam board*.

- **[OBSERVED, secondary] O15.** Emphasis on the **examiner's wording** rather
  than the textbook's is characteristic of the method. This independently
  corroborates O6/O7.

---

## 5. Reader-side evidence — how learners actually read the method

Public comments on the target video (retrieved verbatim):

| Commenter | Comment | What it evidences |
|---|---|---|
| `@greyflex9513` | "오.. 이걸로 법공부 아웃풋 연습하면 효율 좋겠는데요 감사합니다" | Sees it as an **output/retrieval** device, and transfers it to **law study** unprompted |
| `@홍예림고대가자` | "사탐 이외에 비문학이나 다른 과목도 이 방법을 쓰는게 좋을까요?" | Asks about transfer beyond social studies |
| `@공부가머니` | "선생님 공무원 준비중인데 샘 강의 들어도 될까요? 공무원 사회" | Civil-service candidate, matching O8 |

- **[OBSERVED] O16.** The word a viewer reaches for is **아웃풋 연습**
  (*output practice*) — i.e. retrieval, not review. And the domain he reaches for
  is **law**. Both the retrieval framing and the cross-domain transfer that this
  project is built on were volunteered by the audience.

---

## 6. Inferred structure of the table

Nothing in this section is observed. It is my reconstruction, and it drives the
design.

- **[INFERRED] I1 — The table is two-dimensional and comparative.** Rows are the
  *confusable items* inside one syllabus unit (the deviance theories of O10);
  columns are the *attributes on which the exam forces you to tell them apart*.
  Basis: 단원별 organisation (O6) + a comparison-heavy topic given a table (O10)
  + the stated purpose being *discrimination of detail* (O2).
- **[INFERRED] I2 — At least one column axis is the examiner's language, not the
  concept.** Basis: 기출 **표현** 익히기 (O6), "시험장에서 너무 비슷하게" (O7),
  평가원의 워딩 (O15). A cell holds not only *what is true* but *how the exam says
  it*.
- **[INFERRED] I3 — The "self" table is populated from the learner's own errors.**
  Basis: the artefact is categorised as an 오답노트 (O1), the prefix 셀프 (O4),
  and "본인만의" (O13). The teacher's file is a starting schema; wrong answers are
  what fill it in. The table therefore *grows from mistakes*.
- **[INFERRED] I4 — It is used for testing, not only reading.** Basis: 에센셜
  엑셀표 as a weekly cumulative review system (O12), the 개념→엑셀표→문제풀이
  pipeline placing the table before application (O9), and O16. A table you merely
  re-read cannot be a "cumulative review system"; a table you re-derive can.
- **[INFERRED] I5 — Compression is deliberate.** Basis: the graded series in O11
  and the structure-beats-volume claim in O14.

---

## 7. Learning principles extracted

Stated as the abstraction this project implements. Each is traced to its evidence.

| # | Principle | Traces to |
|---|---|---|
| P1 | Knowledge is stored as **discriminations**, not summaries: what separates A from B on a named axis. | O2, O10, I1 |
| P2 | The **examiner's wording** is first-class content, stored alongside the fact. | O6, O7, O15, I2 |
| P3 | The store is **error-driven**: wrong answers are the intake mechanism. | O1, O4, O13, I3 |
| P4 | **Detail is the win condition.** Full marks are lost in exceptions and edge cases, not in main ideas. | O2, title |
| P5 | The table is a **stage in a pipeline** (learn → tabulate → drill), never the end product. | O9 |
| P6 | Review is **cumulative and scheduled**, not ad-hoc re-reading. | O12 |
| P7 | The artefact must be **learner-built** to work; a downloaded table is only a schema. | O4, O5, O13 |
| P8 | **Structure beats volume** — resist accumulation. | O14, O11 |
| P9 | The method **transfers to certification exams**, per the author. | O8, O16 |

---

## 8. What is deliberately *not* claimed

- I do not claim to know the column headers of his actual spreadsheet.
- I do not claim to know what happens at 00:40 or any other second of speech.
- I do not claim the method is original to him, or that it is empirically
  validated beyond his own "10년간 검증" assertion (O11), which is a marketing
  claim in a video description, not a study.
- I have not seen, copied, or reproduced any of the video's visual design.

---

## 9. Retrieval method (reproducible)

All first-party data above was obtained by POSTing to YouTube's InnerTube API on
the one reachable host:

```
POST https://youtubei.googleapis.com/youtubei/v1/next?key=<public WEB key>
     {"context":{"client":{"clientName":"WEB","clientVersion":"2.20240726.00.00",
      "hl":"ko","gl":"KR"}},"videoId":"X3Wh-l7V8oA"}
POST .../youtubei/v1/next     {"continuation":"<comments token>"}
POST .../youtubei/v1/search   {"query":"<title>"}
```

Fields used: `videoPrimaryInfoRenderer.title/dateText/viewCount`,
`videoSecondaryInfoRenderer.attributedDescription.content`,
`commentEntityPayload.properties.content`, `videoRenderer.lengthText`,
`engagementPanelSectionListRenderer[transcript].getTranscriptEndpoint.params`.

Retrieved 2026-08-07.
