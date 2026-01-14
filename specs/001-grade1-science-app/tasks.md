# Tasks: Grade-1 Science Learning Web Application

**Input**: Design documents from `/specs/001-grade1-science-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only included if explicitly requested in feature specification. Not included in this task list.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `docs/` (Docusaurus content), `src/` (React components, API routes, lib)
- **Database**: `prisma/` (schema, migrations, seed)
- **Paths shown below use absolute clarity - adjust if structure differs**

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Docusaurus project with TypeScript in repository root
- [ ] T002 [P] Install dependencies: pnpm add @prisma/client @clerk/nextjs openai zod
- [ ] T003 [P] Install dev dependencies: pnpm add -D prisma typescript @types/node @types/react jest @testing-library/react playwright
- [ ] T004 [P] Create `.env.example` file with required environment variables template
- [ ] T005 [P] Configure TypeScript in `tsconfig.json` with strict mode and path aliases
- [ ] T006 [P] Configure Docusaurus in `docusaurus.config.js` with i18n (en, ur) and base settings
- [ ] T007 [P] Create `vercel.json` configuration file for deployment settings
- [ ] T008 [P] Configure Jest in `jest.config.js` for unit testing
- [ ] T009 [P] Configure Playwright in `playwright.config.ts` for E2E testing
- [ ] T010 Create `.gitignore` file (include .env.local, node_modules, build, .vercel)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Initialize Prisma with `prisma init` command in repository root
- [ ] T012 Copy Prisma schema from `specs/001-grade1-science-app/data-model.md` to `prisma/schema.prisma`
- [ ] T013 Create database migration with `pnpm prisma migrate dev --name init`
- [ ] T014 Create Prisma client singleton in `src/lib/prisma.ts` for connection pooling
- [ ] T015 [P] Create seed data script in `prisma/seed.ts` for 5 topics and 17 lessons
- [ ] T016 [P] Create OpenAI client singleton in `src/lib/openai.ts` with API key configuration
- [ ] T017 [P] Create constants file in `src/lib/constants.ts` for app-wide configuration (rate limits, timeouts)
- [ ] T018 Run seed data with `pnpm prisma db seed` to populate database
- [ ] T019 [P] Configure Clerk authentication in `src/lib/auth.ts` with helper functions
- [ ] T020 [P] Create base middleware for authentication in `src/middleware/auth.ts`
- [ ] T021 [P] Register custom MDX components in `src/theme/MDXComponents.js` file
- [ ] T022 [P] Create child-friendly theme CSS in `src/css/custom.css` with large fonts and bright colors
- [ ] T023 [P] Configure sidebar navigation in `sidebars.js` for 5 topics structure

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Student Learns About Living Things (Priority: P1) 🎯 MVP

**Goal**: Enable Grade-1 students to complete full learning flow (read lesson, watch video, ask chatbot, complete quiz, save progress)

**Independent Test**: Student completes one full topic: reads "What Makes Something Alive?" lesson, watches verified-safe video, asks chatbot "What makes a dog alive?", completes quiz with 70%+ score, progress is saved and persists across sessions

### Content Creation for User Story 1

- [ ] T024 [P] [US1] Create topic folder structure `docs/topics/01-living-nonliving/`
- [ ] T025 [P] [US1] Create topic index page `docs/topics/01-living-nonliving/index.md` with topic overview
- [ ] T026 [P] [US1] Write lesson MDX file `docs/topics/01-living-nonliving/what-is-alive.mdx` with Grade-1 content
- [ ] T027 [P] [US1] Write lesson MDX file `docs/topics/01-living-nonliving/nonliving-things.mdx` with simple examples
- [ ] T028 [P] [US1] Write lesson MDX file `docs/topics/01-living-nonliving/sorting-activity.mdx` with interactive content
- [ ] T029 [P] [US1] Add placeholder images (2-3 per lesson) in `docs/topics/01-living-nonliving/images/`

### Components for User Story 1

- [ ] T030 [P] [US1] Create VideoEmbed component in `src/components/VideoEmbed.tsx` with YouTube iframe and verified_safe check
- [ ] T031 [P] [US1] Create Quiz component in `src/components/Quiz.tsx` with JSON question format and scoring logic
- [ ] T032 [P] [US1] Create ChatBot UI component in `src/components/ChatBot.tsx` with collapsible panel and input field
- [ ] T033 [P] [US1] Create ProgressTracker component in `src/components/ProgressTracker.tsx` with visual progress indicator

### Safety Filters for User Story 1

- [ ] T034 [P] [US1] Create pre-filter function in `src/lib/safety-filters.ts` for profanity detection (regex + keyword list)
- [ ] T035 [P] [US1] Create PII detection function in `src/lib/safety-filters.ts` for names, addresses, phone patterns
- [ ] T036 [P] [US1] Create post-filter function in `src/lib/safety-filters.ts` for link removal and reading level validation
- [ ] T037 [P] [US1] Create rate limiting utility in `src/lib/safety-filters.ts` for 10 queries per session tracking

### API Routes for User Story 1

- [ ] T038 [US1] Create streaming chatbot endpoint in `src/api/chat/message.ts` with OpenAI integration
- [ ] T039 [US1] Integrate pre-filter in `src/api/chat/message.ts` to block inappropriate queries before OpenAI call
- [ ] T040 [US1] Integrate OpenAI Moderation API call in `src/api/chat/message.ts` concurrent with streaming
- [ ] T041 [US1] Integrate post-filter in `src/api/chat/message.ts` to remove links and validate response
- [ ] T042 [US1] Add rate limiting logic in `src/api/chat/message.ts` to enforce 10 queries per session
- [ ] T043 [US1] Create anonymized chat log storage in `src/api/chat/message.ts` using SHA-256 hash
- [ ] T044 [P] [US1] Create content API endpoint in `src/api/content/topics.ts` to list all 5 topics
- [ ] T045 [P] [US1] Create lesson detail endpoint in `src/api/content/lessons/[id].ts` with MDX path and verified videos
- [ ] T046 [P] [US1] Create progress update endpoint in `src/api/progress/update.ts` with upsert logic for completion
- [ ] T047 [P] [US1] Create progress retrieval endpoint in `src/api/progress/[studentId].ts` to get all student progress

### Database Operations for User Story 1

- [ ] T048 [P] [US1] Create video query functions in `src/lib/prisma-queries/videos.ts` to fetch verified_safe videos only
- [ ] T049 [P] [US1] Create progress upsert function in `src/lib/prisma-queries/progress.ts` for lesson completion
- [ ] T050 [P] [US1] Create topics query function in `src/lib/prisma-queries/topics.ts` to get all topics with lessons

### Integration for User Story 1

- [ ] T051 [US1] Connect ChatBot component to `/api/chat/message` endpoint with streaming SSE
- [ ] T052 [US1] Connect VideoEmbed component to database to fetch verified_safe videos for lesson
- [ ] T053 [US1] Connect Quiz component to `/api/progress/update` endpoint on completion (score ≥70%)
- [ ] T054 [US1] Add ProgressTracker to lesson pages showing "1 of 17 lessons complete"
- [ ] T055 [US1] Test end-to-end student flow: read lesson → watch video → ask chatbot → complete quiz → verify progress saved

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (MVP ready!)

---

## Phase 4: User Story 2 - Parent/Teacher Manages Student Accounts (Priority: P2)

**Goal**: Enable parents to create accounts, add child profiles, and view progress dashboard

**Independent Test**: Parent creates account with email verification, adds child profile (first name, grade 1), child completes lessons from US1, parent views dashboard showing completed lessons and quiz scores

### Authentication Pages for User Story 2

- [ ] T056 [P] [US2] Create sign-in page in `src/pages/sign-in.tsx` with Clerk sign-in component
- [ ] T057 [P] [US2] Create sign-up page in `src/pages/sign-up.tsx` with Clerk sign-up component and age verification
- [ ] T058 [P] [US2] Create parent dashboard page in `src/pages/dashboard.tsx` with child profiles list

### Student Management for User Story 2

- [ ] T059 [P] [US2] Create AddStudentForm component in `src/components/AddStudentForm.tsx` with first name and grade inputs
- [ ] T060 [P] [US2] Create StudentCard component in `src/components/StudentCard.tsx` to display child profile and progress
- [ ] T061 [P] [US2] Create ProgressDashboard component in `src/components/ProgressDashboard.tsx` with topics, lessons, scores table

### API Routes for User Story 2

- [ ] T062 [P] [US2] Create student creation endpoint in `src/api/students/create.ts` with parent_id linkage
- [ ] T063 [P] [US2] Create student list endpoint in `src/api/students/index.ts` to get all children for authenticated parent
- [ ] T064 [P] [US2] Create student deletion endpoint in `src/api/students/[id].ts` with cascade to progress records
- [ ] T065 [P] [US2] Add role-based access control middleware to student endpoints (parent can only access own children)

### Database Operations for User Story 2

- [ ] T066 [P] [US2] Create student CRUD functions in `src/lib/prisma-queries/students.ts` with parent_id validation
- [ ] T067 [P] [US2] Create progress aggregation query in `src/lib/prisma-queries/progress.ts` for dashboard (all topics, completion %)

### Integration for User Story 2

- [ ] T068 [US2] Connect AddStudentForm to `/api/students/create` endpoint
- [ ] T069 [US2] Connect dashboard page to `/api/students` and `/api/progress/[studentId]` endpoints
- [ ] T070 [US2] Implement session expiry: 24 hours for students, 7 days for adults (configure in Clerk)
- [ ] T071 [US2] Add parental consent checkbox during sign-up (COPPA compliance)
- [ ] T072 [US2] Test parent flow: create account → add child → child completes lessons → view dashboard with progress

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently (COPPA-compliant MVP)

---

## Phase 5: User Story 4 - Educator Curates Safe Content (Priority: P2)

**Goal**: Enable admin users to curate YouTube videos (submit, review, mark verified_safe)

**Independent Test**: Admin logs in, submits YouTube URL for "Animals" topic with educator notes, marks verified_safe: true, video appears in student lesson immediately. Admin removes video, it disappears from student view.

### Admin UI for User Story 4

- [ ] T073 [P] [US4] Create admin videos page in `src/pages/admin/videos.tsx` with video list and submission form
- [ ] T074 [P] [US4] Create VideoSubmissionForm component in `src/components/admin/VideoSubmissionForm.tsx` with URL input
- [ ] T075 [P] [US4] Create VideoListTable component in `src/components/admin/VideoListTable.tsx` with filter by verified_safe
- [ ] T076 [P] [US4] Create VideoReviewCard component in `src/components/admin/VideoReviewCard.tsx` with verify/remove actions

### API Routes for User Story 4

- [ ] T077 [P] [US4] Create video submission endpoint in `src/api/admin/videos.ts` POST with YouTube ID extraction
- [ ] T078 [P] [US4] Create video list endpoint in `src/api/admin/videos.ts` GET with verified_safe filter
- [ ] T079 [P] [US4] Create video update endpoint in `src/api/admin/videos/[id].ts` PATCH to mark verified_safe
- [ ] T080 [P] [US4] Create video removal endpoint in `src/api/admin/videos/[id].ts` PATCH to set verified_safe=false
- [ ] T081 [P] [US4] Add admin-only middleware to all admin routes (check role=admin in JWT)

### Database Operations for User Story 4

- [ ] T082 [P] [US4] Create video CRUD functions in `src/lib/prisma-queries/videos.ts` with verified_safe flag
- [ ] T083 [P] [US4] Create YouTube ID extraction utility in `src/lib/utils/youtube.ts` to parse video URLs

### Integration for User Story 4

- [ ] T084 [US4] Connect VideoSubmissionForm to `/api/admin/videos` POST endpoint
- [ ] T085 [US4] Connect VideoListTable to `/api/admin/videos` GET endpoint with real-time updates
- [ ] T086 [US4] Connect verify/remove actions to `/api/admin/videos/[id]` PATCH endpoint
- [ ] T087 [US4] Verify VideoEmbed component only shows verified_safe videos (integration with US1)
- [ ] T088 [US4] Test admin flow: submit video → review → mark verified → appears in lesson → remove → disappears

**Checkpoint**: Admin curation functional, all user stories 1, 2, 4 work independently

---

## Phase 6: User Story 3 - Bilingual Learning Experience (Priority: P3)

**Goal**: Add Urdu translations for all content, UI, and chatbot responses

**Independent Test**: Switch language selector to Urdu, navigate through "Living Things" lesson, verify all text is Urdu, ask chatbot question in Urdu, get Urdu response, switch back to English, verify content updates

### i18n Setup for User Story 3

- [ ] T089 [P] [US3] Create Urdu translations directory `i18n/ur/docusaurus-plugin-content-docs/current/`
- [ ] T090 [P] [US3] Create Urdu UI strings file in `i18n/ur/code.json` for navigation, buttons, errors
- [ ] T091 [P] [US3] Configure language selector in `docusaurus.config.js` navbar

### Content Translation for User Story 3

- [ ] T092 [P] [US3] Translate topic 01 index to Urdu in `i18n/ur/.../topics/01-living-nonliving/index.md`
- [ ] T093 [P] [US3] Translate what-is-alive lesson to Urdu in `i18n/ur/.../topics/01-living-nonliving/what-is-alive.mdx`
- [ ] T094 [P] [US3] Translate nonliving-things lesson to Urdu in `i18n/ur/.../topics/01-living-nonliving/nonliving-things.mdx`
- [ ] T095 [P] [US3] Translate sorting-activity lesson to Urdu in `i18n/ur/.../topics/01-living-nonliving/sorting-activity.mdx`
- [ ] T096 [P] [US3] Translate intro page to Urdu in `i18n/ur/.../intro.md`

### Chatbot i18n for User Story 3

- [ ] T097 [US3] Add locale detection in ChatBot component to pass locale parameter to API
- [ ] T098 [US3] Update chatbot endpoint `src/api/chat/message.ts` to accept locale parameter
- [ ] T099 [US3] Add Urdu system prompt in `src/api/chat/message.ts` when locale=ur
- [ ] T100 [US3] Add Urdu response validation in post-filter to check character set

### Component i18n for User Story 3

- [ ] T101 [P] [US3] Update Quiz component to support Urdu question text and options
- [ ] T102 [P] [US3] Update ProgressTracker component to show Urdu text for "completed lessons"
- [ ] T103 [P] [US3] Update error messages in all API routes to return Urdu when locale=ur

### Integration for User Story 3

- [ ] T104 [US3] Test language switching: English → Urdu → English (verify content updates)
- [ ] T105 [US3] Test chatbot in Urdu: ask "پودوں کو پانی کی ضرورت کیوں ہے؟" and verify Urdu response
- [ ] T106 [US3] Test quiz completion in Urdu and verify progress is saved
- [ ] T107 [US3] Verify progress persists when switching languages mid-lesson

**Checkpoint**: All user stories 1, 2, 3, 4 work independently with full bilingual support

---

## Phase 7: Additional Content (Remaining 4 Topics)

**Purpose**: Create content for remaining 4 topics (13 lessons total) following US1 pattern

**Note**: This phase can be parallelized - different developers can work on different topics

### Topic 02: Human Body and Senses

- [ ] T108 [P] Create topic folder `docs/topics/02-human-body-senses/` with index and 3 lessons
- [ ] T109 [P] Write five-senses.mdx, body-parts.mdx, using-senses.mdx with Grade-1 content
- [ ] T110 [P] Add placeholder images for Topic 02 lessons

### Topic 03: Animals

- [ ] T111 [P] Create topic folder `docs/topics/03-animals/` with index and 4 lessons
- [ ] T112 [P] Write animals-around-us.mdx, animal-homes.mdx, what-animals-eat.mdx, animal-sounds.mdx
- [ ] T113 [P] Add placeholder images for Topic 03 lessons

### Topic 04: Plants

- [ ] T114 [P] Create topic folder `docs/topics/04-plants/` with index and 4 lessons
- [ ] T115 [P] Write plant-parts.mdx, plants-need.mdx, types-of-plants.mdx, plants-help-us.mdx
- [ ] T116 [P] Add placeholder images for Topic 04 lessons

### Topic 05: Earth and Universe

- [ ] T117 [P] Create topic folder `docs/topics/05-earth-universe/` with index and 4 lessons
- [ ] T118 [P] Write day-and-night.mdx, sun-moon-stars.mdx, weather-seasons.mdx, our-planet-earth.mdx
- [ ] T119 [P] Add placeholder images for Topic 05 lessons

### Urdu Translations for Topics 02-05

- [ ] T120 [P] Translate all Topic 02 lessons to Urdu in `i18n/ur/.../topics/02-human-body-senses/`
- [ ] T121 [P] Translate all Topic 03 lessons to Urdu in `i18n/ur/.../topics/03-animals/`
- [ ] T122 [P] Translate all Topic 04 lessons to Urdu in `i18n/ur/.../topics/04-plants/`
- [ ] T123 [P] Translate all Topic 05 lessons to Urdu in `i18n/ur/.../topics/05-earth-universe/`

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T124 [P] Add unit tests for safety filters in `tests/unit/safety-filters.test.ts`
- [ ] T125 [P] Add unit tests for React components in `tests/unit/components/`
- [ ] T126 [P] Add integration tests for API routes in `tests/integration/api/`
- [ ] T127 [P] Add E2E test for student flow in `tests/e2e/student-flow.spec.ts`
- [ ] T128 [P] Add E2E test for parent flow in `tests/e2e/parent-flow.spec.ts`
- [ ] T129 [P] Add E2E test for admin flow in `tests/e2e/admin-flow.spec.ts`
- [ ] T130 [P] Run Lighthouse CI and fix issues to achieve >90 scores
- [ ] T131 [P] Run accessibility audit with screen reader and fix WCAG AA issues
- [ ] T132 [P] Optimize images (convert to WebP, add lazy loading)
- [ ] T133 [P] Add code splitting for ChatBot, Quiz components
- [ ] T134 [P] Configure Sentry error tracking in `src/lib/sentry.ts`
- [ ] T135 [P] Add performance monitoring for chatbot response time
- [ ] T136 [P] Create deployment checklist in `docs/deployment-checklist.md`
- [ ] T137 [P] Write developer documentation in `docs/developer-guide.md`
- [ ] T138 [P] Validate all 17 lessons render without errors with `pnpm docusaurus build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) - Uses progress data from US1 but independently testable
- **User Story 4 (Phase 5)**: Depends on Foundational (Phase 2) - Video curation affects US1 but independently testable
- **User Story 3 (Phase 6)**: Depends on US1 content existing - Adds translations
- **Additional Content (Phase 7)**: Can start after US1 pattern established - Parallel work on different topics
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

```
Foundational (Phase 2) - MUST COMPLETE FIRST
         ↓
    ┌────┴────┬────────┐
    ↓         ↓        ↓
   US1       US2      US4     ← Can proceed in parallel after Foundational
  (P1)      (P2)     (P2)
    ↓
   US3                        ← Depends on US1 content
  (P3)
```

**Critical Path**: Setup → Foundational → US1 → US3
**Parallel Opportunities**: US2, US4 can start simultaneously with US1

### Within Each User Story

**User Story 1 (P1 - MVP)**:
1. Content Creation (T024-T029) - Parallel execution
2. Components (T030-T033) - Parallel execution
3. Safety Filters (T034-T037) - Parallel execution
4. API Routes (T038-T047) - Sequential (T038-T043 for chatbot, T044-T047 parallel)
5. Database Operations (T048-T050) - Parallel execution
6. Integration (T051-T055) - Sequential (connects components to APIs)

**User Story 2 (P2)**:
1. Auth Pages (T056-T058) - Parallel execution
2. Student Management (T059-T061) - Parallel execution
3. API Routes (T062-T065) - Parallel execution
4. Database Operations (T066-T067) - Parallel execution
5. Integration (T068-T072) - Sequential

**User Story 4 (P2)**:
1. Admin UI (T073-T076) - Parallel execution
2. API Routes (T077-T081) - Parallel execution
3. Database Operations (T082-T083) - Parallel execution
4. Integration (T084-T088) - Sequential

**User Story 3 (P3)**:
1. i18n Setup (T089-T091) - Parallel execution
2. Content Translation (T092-T096) - Parallel execution
3. Chatbot i18n (T097-T100) - Sequential
4. Component i18n (T101-T103) - Parallel execution
5. Integration (T104-T107) - Sequential

### Parallel Opportunities

**Within Foundational Phase (After T011-T014 complete)**:
```bash
# Launch together:
Task T015: Create seed data script
Task T016: Create OpenAI client
Task T017: Create constants file
Task T019: Configure Clerk auth
Task T020: Create base middleware
Task T021: Register MDX components
Task T022: Create custom CSS
Task T023: Configure sidebar
```

**Within User Story 1 Content Creation**:
```bash
# Launch all lesson files together:
Task T026: what-is-alive.mdx
Task T027: nonliving-things.mdx
Task T028: sorting-activity.mdx
```

**Within User Story 1 Components**:
```bash
# Launch all components together:
Task T030: VideoEmbed component
Task T031: Quiz component
Task T032: ChatBot component
Task T033: ProgressTracker component
```

**Across User Stories (After Foundational)**:
```bash
# US1, US2, US4 can all be worked on by different developers simultaneously
Developer A: Works on US1 (Phase 3)
Developer B: Works on US2 (Phase 4)
Developer C: Works on US4 (Phase 5)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Timeline**: ~2-3 weeks

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T023) - CRITICAL, blocks everything
3. Complete Phase 3: User Story 1 (T024-T055)
4. **STOP and VALIDATE**: Test US1 independently
   - Student can read lesson
   - Student can watch verified video
   - Student can ask chatbot and get safe response <2s
   - Student can complete quiz
   - Progress saves and persists
5. Deploy/demo MVP

**MVP Deliverables**:
- 1 topic (Living Things) with 3 lessons
- Working chatbot with multi-layer safety
- Quiz system with progress tracking
- Verified video embedding
- English-only (Urdu in Phase 6)

### Incremental Delivery (Recommended)

**Week 1-2**: Setup + Foundational + US1 (MVP)
- Deploy to staging, validate with educators
- Deliverable: Students can learn about living things

**Week 3**: US2 (Parent Management)
- Deploy update
- Deliverable: Parents can create accounts, track progress

**Week 4**: US4 (Admin Curation)
- Deploy update
- Deliverable: Educators can curate safe videos

**Week 5**: US3 (Bilingual) + Additional Content (Phase 7)
- Deploy update
- Deliverable: Full 5 topics in English and Urdu

**Week 6-7**: Polish (Phase 8)
- Testing, accessibility, performance optimization
- Deploy production-ready version

### Parallel Team Strategy

With 3 developers after Foundational phase complete:

**Developer A (Lead)**: User Story 1 (T024-T055)
- Most complex (chatbot safety, components)
- Establishes patterns for others

**Developer B**: User Story 2 (T056-T072)
- Parallel work on auth and parent dashboard
- Uses US1's progress data once available

**Developer C**: User Story 4 (T073-T088)
- Parallel work on admin panel
- Integrates with US1's VideoEmbed once available

**All Developers**: Polish phase together (Phase 8)

---

## Notes

- **[P] tasks**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story] label**: Maps task to specific user story for traceability (US1, US2, US3, US4)
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently
- Tests are OPTIONAL (not included in this task list per specification)
- Commit after each task or logical group
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Count Summary

- **Total Tasks**: 138
- **Setup Phase**: 10 tasks
- **Foundational Phase**: 13 tasks (CRITICAL - blocks all stories)
- **User Story 1 (P1 - MVP)**: 32 tasks
- **User Story 2 (P2)**: 17 tasks
- **User Story 4 (P2)**: 16 tasks
- **User Story 3 (P3)**: 19 tasks
- **Additional Content (Phase 7)**: 16 tasks
- **Polish (Phase 8)**: 15 tasks

**Parallel Opportunities**: ~60% of tasks can run in parallel within their phase
**MVP Scope**: Phases 1-3 (55 tasks, ~2-3 weeks)
**Full Feature**: All phases (138 tasks, ~5-7 weeks)

**Independent Test Criteria Met**:
- ✅ US1: Student completes full learning flow independently
- ✅ US2: Parent manages account and views progress independently
- ✅ US4: Admin curates videos independently
- ✅ US3: Bilingual experience works independently (depends on US1 content)

---

**Tasks Version**: 1.0
**Generated**: 2026-01-14
**Status**: Ready for implementation
**Next Step**: Begin Phase 1 (Setup) with tasks T001-T010
