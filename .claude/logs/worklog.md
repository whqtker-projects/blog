## 2026-05-06 — Initial planning documentation created

Created foundational planning documents from confirmed decisions discussed in the first planning session.

**Files created:**
- `PLANNING.md` — main project overview with all sections
- `docs/open-questions.md` — 9 unresolved items across publishing, structure, post format, and audience
- `docs/decisions/ADR-001-project-foundations.md` — confirmed foundational decisions record

**Confirmed in this session:** content focus, audience range, post structure elements (definition → operational principle → examples → quiz), topic domains (CS, AI/ML/LLM, backend, software engineering), Obsidian-as-source-of-truth, direct conversion workflow, Obsidian Markdown format.

**Unresolved:** publishing platform, series/category structure, post template formalization, file naming conventions, quiz format, length guidelines.

## 2026-05-06 — GitHub issues created and docs #1–#7 implemented

### 완료한 작업

- `CLAUDE.md` 생성 (저장소 메타 정보, 플래닝 규칙, 역할 경계)
- `docs/github-issue-workflow.md` 작성 (공식 Claude Code 베스트 프랙티스 기반 이슈 워크플로 매뉴얼)
- GitHub 레이블 7개 생성 (planning, decision, structure, template, workflow, publishing, cleanup)
- `whqtker-projects/blog` 저장소에 이슈 12개 생성 (#1–#12)
- 이슈 #1: `docs/README.md` 생성 — 문서 인덱스
- 이슈 #2: `docs/project-overview.md` 생성 — 프로젝트 개요
- 이슈 #3: `docs/confirmed-decisions.md` 생성 + 리뷰 피드백 반영 (D-11 제거, D-13 축소)
- 이슈 #4: `docs/decision-log.md` 생성 (재사용 가능한 엔트리 템플릿 + DL-001 초기 항목)
- 이슈 #5: `docs/open-questions.md` 정규화 (status 필드 추가, 해결 절차 추가, 관련 문서 링크)
- 이슈 #6: `docs/documentation-workflow.md` 생성 (문서별 업데이트 기준, 모호성 처리 규칙, 에이전트 행동 규칙)
- 이슈 #7: `docs/post-template.md` 생성 (확정된 4단계 구조 기술, 미결 항목 open-questions 참조)

### 미완료

- 이슈 #8–#12 미구현
- 이슈 #4까지 push 완료, #5–#7은 로컬 커밋만 존재 (push 미실행)

### 주요 결정

- `/tmp` 클론 방식 → 로컬 저장소(`new_blog`) 직접 작업으로 전환
- `confirmed-decisions.md`에서 D-11 제거: "도메인 확장 가능" 문구는 확정 결정이 아닌 일반 노트로 판단
- D-13 축소: 에이전트의 역할 제한을 과도하게 명시하지 않도록 표현 완화

## 2026-05-06 — GitHub issue workflow manual written

Created `docs/github-issue-workflow.md` based on official Claude Code best practices docs.

**Sources consulted:** `code.claude.com/docs/en/best-practices`, `code.claude.com/docs/en/github-actions`, `code.claude.com/docs/en/common-workflows`

**Covers:** gh CLI setup, issue creation via Claude, issue structure convention, the explore→plan→implement→commit→PR flow, fix-issue skill definition, gh commands reference, GitHub Actions @claude integration, recommended label set for this project.

## 2026-05-07 — 이슈 #24~#27 구현 및 Astro 스켈레톤 구축

### 완료한 작업

**이슈 #24 — 콘텐츠 구조 및 시리즈 모델 확정**
- Q-3 해결: 도메인당 다수 시리즈 (D-19)
- Q-5 해결: 포스트당 하나의 시리즈만 허용 (D-20)
- 4개 도메인 × 12개 시리즈 확정 (D-21): database-internals, distributed-systems, network-protocols, backend-design, data-structures, algorithms, operating-systems, computer-architecture, computer-security, llm-internals, ml-fundamentals, design-principles
- 첫 시리즈: `database-internals` (D-22)
- `series-backlog.md` 후보 목록 → 확정 목록으로 전환

**이슈 #33, #34 — 시리즈 네이밍 정책 및 포스트 메타데이터**
- D-23: slug → Title Case 자동 변환 (llm→LLM 등 약어 처리)
- D-24: category = domain, 계층은 domain > series > post, 도메인 slug 4개 정의
- D-25: 필수 프론트매터 3개 — title, series, order (domain은 series에서 역추적)
- `docs/post-metadata.md` 신규 생성

**이슈 #25 — 포스트 포맷 및 저작 규칙 확정**
- Q-6 (D-26): 섹션 제목·순서 자유, Quiz는 마지막 고정
- Q-7 (D-27): 5문항 MCQ, 4지선다
- Q-8 (D-28): 분량 제한 없음, 주제 중심
- Q-9 (D-29): 전 시리즈 동일 독자층 (초심자→실무자)
- `docs/first-post-outline-template.md` 신규 생성

**이슈 #26 — 상태 라이프사이클 확정**
- D-30: 5단계 상태 어휘 (idea, outline, draft, review, published)
- D-31: published 수정 정책 (오탈자·사실오류→상태유지, 대폭재작성→draft 복귀)
- D-32: status는 선택 프론트매터 필드
- D-33: 프로덕션 빌드 포함 정책 (status 없음 or published → 포함, 나머지 → 제외)
- `docs/status-lifecycle.md` Proposed → Active 전환
- `docs/review-checklist.md` 신규 생성

**이슈 #27 — Astro 블로그 스켈레톤 구축**
- D-34: 패키지 매니저 pnpm, node >=22.12.0
- D-35: 저장소 루트에 Astro 프로젝트 초기화
- D-36: URL 구조 /posts/[slug]
- D-37: glob loader로 src/content/posts/ 로드
- 생성 파일: package.json, astro.config.mjs, tsconfig.json, src/content.config.ts, src/layouts/BaseLayout.astro, src/layouts/PostLayout.astro, src/pages/index.astro, src/pages/posts/[slug].astro, .gitignore
- 샘플 포스트 픽스처: `src/content/posts/what-is-a-database-index.md` (database-internals, order:1, status:published)
- 빌드 검증 완료: /posts/what-is-a-database-index 라우트 생성 확인
- `docs/astro-bootstrap.md` 신규 생성

### 미완료

- 이슈 #28 (Obsidian→Astro 변환 파이프라인) 미시작
- 이슈 #29 (렌더링 호환성 검증) 미시작
- 이슈 #30 (첫 콘텐츠 준비 패키지) 미시작
- 이슈 #31, #32, #35 — 내용은 이미 결정됐으나 이슈가 아직 Open 상태 (정리 필요)

### 주요 결정

- Astro 6.2.2에서 `type: 'content'` 대신 glob loader 명시 필요 (content-modules.mjs가 비어있는 현상)
- `category` 개념을 별도로 두지 않고 domain과 동일시 (D-24)
- 프로덕션 빌드에서 status 없는 파일은 포함 처리 (D-33: absent → included)
