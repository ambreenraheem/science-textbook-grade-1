# Research: Grade-1 Science Learning Web Application

**Feature**: 001-grade1-science-app
**Date**: 2026-01-14
**Purpose**: Resolve technical unknowns and establish architectural decisions

## Research Questions

### 1. Docusaurus + MDX Integration Strategy

**Question**: How to integrate custom React components (ChatBot, VideoEmbed, Quiz) into Docusaurus MDX pages while maintaining static site generation benefits?

**Research Findings**:
- **Docusaurus Version**: v3.x (latest stable) supports React 18 and modern MDX
- **MDX Components**: Can import and use custom React components directly in .mdx files
- **Custom Component Registration**: Use `@theme/MDXComponents` to register global components
- **Client-Side Interactivity**: Use `@docusaurus/BrowserOnly` for components requiring browser APIs
- **Static Generation**: Static content renders at build time, interactive components hydrate on client

**Decision**: Use Docusaurus v3 with custom React components registered globally via MDXComponents

**Rationale**:
- Native MDX support in Docusaurus
- Static site performance for content
- Client-side hydration for interactive features
- Built-in i18n and versioning

**Alternatives Considered**:
- Next.js with MDX: More complex setup, no built-in documentation features
- Gatsby: Less active development, more plugin dependencies

---

### 2. AI Chatbot Safety Architecture

**Question**: How to implement pre-filtering and post-filtering for child safety while maintaining <2 second response time?

**Research Findings**:
- **Pre-filtering**: Use regex + keyword lists for profanity, PII patterns before API call
- **OpenAI Moderation API**: Built-in content moderation endpoint (concurrent with generation)
- **Streaming Responses**: Use OpenAI streaming to show partial responses while validating
- **Rate Limiting**: Implement session-based rate limiting with Redis or in-memory store
- **Response Caching**: Cache common questions to reduce API calls and improve speed

**Decision**: Implement multi-layer safety system:
1. Pre-filter: Regex + keyword blocklist (< 10ms overhead)
2. OpenAI Chat Completion with system prompt constraints
3. Concurrent moderation: Call Moderation API while streaming response
4. Post-filter: Remove links, validate reading level
5. Session rate limit: 10 queries per student session

**Rationale**:
- Defense-in-depth approach
- Streaming maintains perceived speed
- System prompts reduce hallucinations
- Moderation API catches edge cases

**Alternatives Considered**:
- Only system prompts: Insufficient safety guarantees
- Synchronous moderation: Adds 200-300ms latency
- Custom ML model: Excessive complexity, maintenance burden

---

### 3. Neon PostgreSQL + Prisma Setup

**Question**: What database schema patterns best support multi-tenancy (parent/student), progress tracking, and COPPA compliance?

**Research Findings**:
- **Neon Features**: Serverless PostgreSQL, branching, auto-scaling, connection pooling
- **Prisma Schema**: Type-safe ORM, migrations, seed data support
- **Multi-tenancy**: Row-level security (RLS) vs application-level filtering
- **COPPA Compliance**: Minimal data model, explicit consent fields, data retention policies
- **Performance**: Indexes on foreign keys, composite primary keys for junction tables

**Decision**: Use Prisma with application-level multi-tenancy and minimal data model

**Database Design Principles**:
- No PII beyond parent email and child first name
- Composite keys for progress (student_id, lesson_id)
- Soft deletes for audit trail (deleted_at column)
- Timestamps for data retention policy enforcement

**Rationale**:
- Prisma provides type safety and migrations
- Application-level filtering simpler than RLS for this scale
- Minimal data aligns with constitution privacy principles

**Alternatives Considered**:
- Row-level security: More complex, unnecessary for expected scale (<10k users initially)
- NoSQL (MongoDB): Poor fit for relational data (users, students, progress)

---

### 4. Authentication + COPPA Compliance

**Question**: How to implement parental consent workflow while maintaining simple UX?

**Research Findings**:
- **Clerk**: Modern auth with built-in age-gating, social providers, session management
- **NextAuth**: Open-source, flexible, requires more custom implementation
- **COPPA Requirements**: Verifiable parental consent, opt-in not opt-out, data deletion rights
- **Age Verification**: Date of birth for parent, no verification for children

**Decision**: Use Clerk for authentication with custom parent/child relationship

**Implementation Strategy**:
1. Parent signs up with email + password (DOB required for age verification)
2. Parent creates child profiles (first name + grade only)
3. Student sessions linked to parent account via student_id
4. 24-hour session expiry for students, 7-day for adults
5. Parent dashboard for managing child profiles and consent

**Rationale**:
- Clerk handles complex auth flows (email verification, password reset)
- Built-in session management and security
- Custom metadata for storing parent_id relationship
- Reduces implementation time vs NextAuth

**Alternatives Considered**:
- NextAuth: More code to maintain, similar features
- Auth0: More expensive, over-engineered for needs
- Custom auth: Security risk, not constitution-compliant

---

### 5. Vercel Deployment + Serverless Functions

**Question**: How to structure API routes for chatbot, progress tracking, and admin functions within Vercel's serverless constraints?

**Research Findings**:
- **Vercel Functions**: 10-second timeout (Hobby), 60-second (Pro), edge functions for low latency
- **API Routes**: Use `/api` directory, each file is a serverless function
- **Cold Start**: ~100-300ms, mitigated with warm-up requests
- **Environment Variables**: Secure secrets via Vercel dashboard
- **Database Connections**: Use connection pooling (Neon's built-in pooler or Prisma Data Proxy)

**Decision**: Structure API routes by domain:

```
api/
├── auth/
│   ├── login.ts       # Authentication
│   └── logout.ts
├── chat/
│   └── message.ts     # AI chatbot with streaming
├── progress/
│   ├── [studentId].ts # Get progress
│   └── update.ts      # Update progress
├── admin/
│   ├── videos.ts      # CRUD for videos
│   └── chat-logs.ts   # Review anonymized logs
└── content/
    ├── topics.ts      # List topics
    └── lessons/[id].ts # Get lesson content
```

**Rationale**:
- Clear separation of concerns
- Follows RESTful patterns
- Admin routes can have separate auth middleware
- Chatbot streaming works within 10-second timeout

**Alternatives Considered**:
- Edge functions: Limited runtime, no database access from edge
- Monolithic API: Poor cold-start performance, violates serverless best practices

---

### 6. Bilingual Content (English/Urdu) Strategy

**Question**: How to structure i18n content and ensure chatbot responds in correct language?

**Research Findings**:
- **Docusaurus i18n**: Built-in support, locale-specific directories
- **Content Structure**: `docs/` for English, `i18n/ur/docusaurus-plugin-content-docs/current/` for Urdu
- **Translation Workflow**: Manually translate MDX files, maintain parallel structure
- **Chatbot Language Detection**: User's selected locale passed to API, system prompt includes language
- **UI Translations**: JSON files for UI strings (`locales/en.json`, `locales/ur.json`)

**Decision**: Use Docusaurus built-in i18n with manual translations

**Implementation**:
```
docs/                           # English content
├── intro.md
└── topics/
    └── 01-living-nonliving/
        └── what-is-alive.mdx

i18n/ur/                        # Urdu translations
└── docusaurus-plugin-content-docs/
    └── current/
        ├── intro.md
        └── topics/
            └── 01-living-nonliving/
                └── what-is-alive.mdx
```

**Chatbot Language Handling**:
- Client sends `locale` parameter with chat request
- API uses locale-specific system prompt: "Respond in [English/Urdu] only..."
- Response validated for language match (basic character set check)

**Rationale**:
- Docusaurus i18n is zero-configuration
- Parallel structure easy to maintain
- Manual translation ensures quality (Grade-1 appropriate)

**Alternatives Considered**:
- Machine translation: Poor quality for child content, loses pedagogical nuance
- Single bilingual files: Complex, harder to maintain

---

### 7. Video Embedding + Safety

**Question**: How to embed YouTube videos safely and handle educator curation workflow?

**Research Findings**:
- **YouTube Embed API**: `<iframe>` with restricted mode, no related videos
- **Curated Video Storage**: Store youtube_id in database, not full URL
- **Educator Workflow**: Admin panel submits video → manual review → mark verified_safe → appears in lesson
- **Removal Strategy**: Soft delete (verified_safe = false) to maintain audit trail

**Decision**: Custom `<VideoEmbed>` component with database-backed verification

**Component Interface**:
```tsx
<VideoEmbed
  videoId="xyz123"         // YouTube video ID from database
  title="Animals in Nature"
  lessonId="lesson-001"    // For tracking
/>
```

**Component Behavior**:
- Fetches verification status from `/api/content/videos/[videoId]`
- Only renders if `verified_safe: true` in database
- Shows placeholder if video not verified or removed
- Uses YouTube's `enablejsapi` for playback tracking (optional)

**Admin Curation Panel**:
- Form: YouTube URL → Extract video ID → Preview → Add notes → Submit
- Admin reviews video → Marks verified_safe
- Video appears in assigned lesson automatically

**Rationale**:
- Database-driven ensures only reviewed content shown
- Soft deletes preserve history
- YouTube embed API provides safety controls (restricted mode)

**Alternatives Considered**:
- Direct URL embedding: No verification control
- Video hosting (Vimeo, self-hosted): Expensive, complex
- Pre-downloaded videos: Storage costs, copyright concerns

---

### 8. Quiz System Design

**Question**: What quiz engine provides multiple choice + picture matching with immediate feedback?

**Research Findings**:
- **Quiz Types Needed**: Multiple choice (text), picture matching (drag-drop or click)
- **State Management**: React state for quiz progress, no backend persistence until completion
- **Immediate Feedback**: Show correct/incorrect with encouraging messages
- **Scoring**: Calculate percentage, submit to backend on completion

**Decision**: Custom `<Quiz>` React component with JSON-based question format

**Question Format**:
```json
{
  "id": "q1",
  "type": "multiple-choice",
  "question": "Which one is alive?",
  "options": [
    { "id": "a", "text": "Dog", "image": "/img/dog.jpg", "correct": true },
    { "id": "b", "text": "Rock", "image": "/img/rock.jpg", "correct": false }
  ],
  "feedback": {
    "correct": "Great job! Dogs are living things!",
    "incorrect": "Let's try again! Think about what grows and moves."
  }
}
```

**Component Features**:
- Progress indicator (Question 1 of 5)
- Immediate visual feedback (green checkmark, encouraging message)
- No penalty for wrong answers (can retry)
- Final score shown after all questions
- Submit to `/api/progress/update` on completion (score ≥ 70% marks lesson complete)

**Rationale**:
- JSON format easy for educators to create
- React component provides rich interactivity
- No external dependencies, full control over UX

**Alternatives Considered**:
- Quiz libraries (react-quiz-component): Limited customization, not child-friendly
- Backend-driven quizzes: Slower, unnecessary server round-trips

---

### 9. Performance Budget + Monitoring

**Question**: How to ensure Lighthouse score >90 and <2 second chatbot response?

**Research Findings**:
- **Lighthouse Goals**: Performance, Accessibility, Best Practices, SEO all >90
- **Key Metrics**: First Contentful Paint (FCP) <1.8s, Time to Interactive (TTI) <3.5s
- **Optimization Strategies**: Image optimization, code splitting, lazy loading, CDN
- **Monitoring**: Vercel Analytics, Sentry for errors

**Decision**: Implement performance best practices from start

**Optimization Checklist**:
- [ ] Images: WebP format, responsive sizes, lazy loading (`loading="lazy"`)
- [ ] Code Splitting: Dynamic imports for Quiz, ChatBot components
- [ ] Fonts: Self-host fonts, `font-display: swap`
- [ ] Chatbot: Streaming responses, perceived latency <500ms (start showing response)
- [ ] Database: Indexed queries, connection pooling, query optimization
- [ ] Caching: Static content via Vercel CDN, API responses cached where appropriate

**Monitoring Setup**:
- Vercel Analytics for page load times
- Sentry for error tracking (sanitize PII before sending)
- Custom metrics: Chatbot response time, quiz completion rate

**Rationale**:
- Proactive optimization easier than retrofitting
- Child users have low patience for slow apps
- Lighthouse score impacts SEO and accessibility

**Alternatives Considered**:
- Post-launch optimization: Harder to fix architectural issues
- No monitoring: Flying blind, can't identify issues

---

## Technology Stack Summary

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| **Frontend Framework** | Docusaurus | v3.x | Static site generation, built-in i18n, MDX support |
| **UI Library** | React | 18.x | Required by Docusaurus, component-based |
| **Database** | Neon PostgreSQL | Latest | Serverless, auto-scaling, branching for dev/prod |
| **ORM** | Prisma | v5.x | Type-safe queries, migrations, schema management |
| **Authentication** | Clerk | Latest | Modern auth, age-gating, session management |
| **AI** | OpenAI API | GPT-4-mini | Best safety features, streaming, function calling |
| **Deployment** | Vercel | N/A | Native Docusaurus support, serverless functions |
| **Language** | TypeScript | 5.x | Type safety, better DX, fewer runtime errors |
| **Testing** | Jest + React Testing Library | Latest | Unit tests for components and utilities |
| **E2E Testing** | Playwright | Latest | Integration tests for user flows |
| **Monitoring** | Sentry | Latest | Error tracking, performance monitoring |

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Page Load Time** | <2 seconds | Lighthouse FCP |
| **Chatbot Response Time** | <2 seconds (95th percentile) | Custom API monitoring |
| **Lighthouse Performance** | >90 | Vercel Analytics |
| **Lighthouse Accessibility** | >90 | Manual testing + automated checks |
| **Quiz Interaction** | <100ms latency | React performance profiling |
| **Database Query Time** | <100ms (p95) | Prisma query logging |
| **API Cold Start** | <300ms | Vercel function logs |

---

## Security Considerations

### Data Protection
- All PII encrypted at rest (Neon PostgreSQL)
- TLS for data in transit
- No client-side storage of sensitive data
- CORS restricted to application domain

### Authentication
- bcrypt for password hashing (via Clerk)
- JWT for session tokens (Clerk-managed)
- CSRF protection on state-changing endpoints
- Rate limiting on auth endpoints (10 attempts per hour)

### Content Safety
- Pre-filter: Regex + keyword blocklist
- OpenAI Moderation API
- Post-filter: Link removal, reading level validation
- Admin-only video curation
- Anonymized chat logs (no raw transcripts)

### COPPA Compliance
- Parental consent required before child profile creation
- Minimal data collection (first name, grade only)
- Data retention policy (2 years)
- Parent-initiated data deletion within 7 days
- No third-party tracking (Google Analytics disabled)

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|-----------|
| **OpenAI API outage** | High (chatbot unavailable) | Low | Graceful degradation message, suggest reviewing lesson content |
| **Inappropriate content reaches student** | Critical (safety violation) | Low | Multi-layer filtering, educator review, immediate removal capability |
| **Performance degrades with scale** | Medium (poor UX) | Medium | Connection pooling, caching, CDN, load testing before launch |
| **Translation quality issues** | Medium (learning impact) | Medium | Professional translator for Urdu content, educator review |
| **Data breach** | Critical (COPPA violation) | Low | Encryption, minimal data, security audit before launch |
| **Vercel cost overruns** | Low (budget impact) | Low | Monitor usage, optimize cold starts, cache aggressively |

---

## Open Questions

None remaining. All technical unknowns resolved through research.

---

## Next Steps

1. Proceed to Phase 1: Design data model (`data-model.md`)
2. Generate API contracts (`contracts/`)
3. Create quickstart guide (`quickstart.md`)
4. Update agent context with technology stack
5. Fill out complete implementation plan (`plan.md`)
