<!--
Sync Impact Report - Constitution Update
═══════════════════════════════════════════════════════════════
Version Change: 0.0.0 → 1.0.0
Change Type: MAJOR (Initial constitution creation)
Date: 2026-01-14

Modified Principles:
  - ALL PRINCIPLES (Initial creation)

Added Sections:
  - Core Principles (8 principles)
  - Child Safety & Privacy Requirements
  - Technical Standards
  - Content Development Workflow
  - Governance

Templates Requiring Updates:
  ✅ spec-template.md - Aligned with child-safe requirements
  ✅ plan-template.md - Constitution check configured
  ✅ tasks-template.md - Safety testing tasks included

Follow-up TODOs:
  - None (all placeholders filled)

Rationale:
  This is the initial constitution for Science Textbook Grade-1, an educational
  web application for 6-7 year old students. The constitution prioritizes child
  safety, pedagogical soundness, and technical excellence in equal measure.
═══════════════════════════════════════════════════════════════
-->

# Science Textbook Grade-1 Constitution

## Core Principles

### I. Child Safety First (NON-NEGOTIABLE)

Child safety is the highest priority and supersedes all other concerns including
features, performance, or technical elegance.

**Rules:**
- NO collection of personal identifiable information (PII) from children without
  explicit parental consent and COPPA compliance
- NO unfiltered AI responses - all chatbot outputs MUST pass safety validation
- NO external links without educator verification and safe browsing enforcement
- NO storage of raw child inputs - only anonymized, sanitized data for safety review
- NO social features, public profiles, or child-to-child communication
- ALL user-facing errors must use child-friendly language with no technical exposure

**Rationale:** Children aged 6-7 are vulnerable users who require protection from
inappropriate content, data harvesting, and unsafe interactions. Legal compliance
(COPPA, GDPR) and ethical responsibility demand the highest safety standards.

### II. Pedagogically Sound Content

All content must follow Grade-1 educational standards and child development principles.

**Rules:**
- Concepts MUST be concrete, not abstract (use daily life examples)
- Vocabulary MUST match Grade-1 reading level (simple words, short sentences)
- One concept per screen - no cognitive overload
- Visual support MUST accompany text (images, diagrams, videos)
- Repetition and reinforcement are beneficial, not redundant
- Content MUST be reviewed by educators before deployment
- NO assumptions of prior knowledge beyond kindergarten basics

**Rationale:** Effective learning for 6-7 year olds requires developmentally
appropriate pedagogy. Content that is too advanced, abstract, or text-heavy will
fail to engage and educate this age group.

### III. AI Behavior Constraints (NON-NEGOTIABLE)

The AI chatbot must behave as a supportive learning companion, not a knowledge oracle.

**Rules:**
- Responses MUST be 1-3 sentences maximum
- Tone MUST be friendly, encouraging, and non-judgmental
- NO guessing facts - redirect to lesson content when uncertain
- NO personal questions to the child
- NO external references, links, or suggestions beyond curated content
- System prompts MUST enforce Grade-1 language and safety filters
- Pre-filter user input for profanity, personal info, and unsafe queries
- Post-filter AI output to validate against content policy
- Rate limiting MUST prevent abuse (max 10 queries per session)

**Rationale:** Uncontrolled AI can hallucinate, provide inappropriate content, or
collect sensitive data. Strict behavioral constraints ensure the AI remains a safe,
helpful learning tool.

### IV. Privacy by Design

Data minimization and privacy protection must be architected into every feature.

**Rules:**
- Collect ONLY the minimum data required for functionality
- Parent/teacher creates account - child profile is linked, not independent
- Role-based access control (admin, teacher, parent, student) MUST be enforced
- Age verification required before creating student profiles
- Encryption at rest for all user data
- NO tracking of children's behavior for marketing or analytics beyond aggregate usage
- Chat logs stored ONLY in anonymized form (session_id, timestamp, query_hash, response_length)
- Data retention policy: delete inactive student data after 2 years with parental notification

**Rationale:** Privacy is a fundamental right. Children cannot consent to data
collection, so we must minimize data gathering and enforce parental control.

### V. Technology Stack Constraints

The architecture must support educational requirements while remaining maintainable.

**Technology Choices:**
- **Frontend:** Docusaurus (React-based static site generator)
  - Rationale: Built-in i18n, versioning, search, and MDX for interactive components
- **Database:** Neon (Serverless PostgreSQL)
  - Rationale: Auto-scaling, branching, zero-ops for educational context
- **AI Integration:** OpenAI Chat SDK with GPT-4-mini
  - Rationale: Best-in-class safety, streaming support, function calling
- **Authentication:** Clerk or NextAuth
  - Rationale: Modern auth flows, parental consent workflows, age-gating
- **Deployment:** Vercel
  - Rationale: Native Docusaurus support, serverless functions, preview deployments
- **ORM:** Prisma
  - Rationale: Type-safe database access, migrations, schema versioning

**Rules:**
- NO introduction of new technologies without justification and constitutional amendment
- ALL dependencies MUST be actively maintained and security-patched
- NO direct database access - all queries through Prisma ORM
- API routes MUST be serverless functions (no long-running servers)

**Rationale:** Technology sprawl creates maintenance burden. The chosen stack
optimizes for educational content delivery, safety, and operational simplicity.

### VI. Content Moderation & Curation

All external content must be verified before exposure to children.

**Rules:**
- YouTube videos MUST be manually reviewed and marked `verified_safe: true` in database
- Video selection criteria: educational, age-appropriate, from reputable channels
- REJECT videos with: violence, misleading information, sensationalism, non-educational content
- Video metadata (title, youtube_id, educator_notes) stored in `videos` table
- Content moderation workflow: submit → review → approve/reject → publish
- Broken or flagged videos MUST be immediately removed from all lessons

**Rationale:** External content is the greatest source of safety risk. Manual curation
ensures only appropriate content reaches children.

### VII. Testing & Quality Gates

Quality and safety must be validated through automated and manual testing.

**Testing Requirements:**
- **Unit Tests:** Core business logic (models, services, utilities)
- **Integration Tests:** API routes, database queries, authentication flows
- **Safety Tests:** AI chatbot responses against unsafe inputs (profanity, personal questions)
- **Content Review:** Manual educator review of all lesson content before deployment
- **Accessibility:** WCAG 2.1 AA compliance for screen readers and keyboard navigation
- **Performance:** Lighthouse score >90 for Performance, Accessibility, Best Practices, SEO

**Quality Gates:**
- ALL tests MUST pass before merge to main branch
- Content MUST be reviewed by at least one educator
- AI responses MUST pass safety validation in staging environment
- NO direct commits to production - preview deployments required

**Rationale:** Automated testing catches regressions. Manual review catches
pedagogical and safety issues that code cannot detect.

### VIII. Simplicity & Maintainability

Code must be simple, readable, and maintainable by educators and developers.

**Rules:**
- Prefer simple solutions over clever abstractions
- No premature optimization - measure before optimizing
- Code comments ONLY where logic is non-obvious
- Database schema MUST be normalized (3NF) with clear entity relationships
- API routes MUST follow RESTful conventions or be clearly documented
- Component structure: feature-based folders, not technical layers
- Configuration MUST use environment variables with `.env.example` template

**Anti-Patterns to Avoid:**
- Over-engineering for hypothetical future requirements
- Helper functions for one-time operations
- Complex state management when React context suffices
- Unnecessary abstractions that obscure business logic

**Rationale:** Simplicity enables faster iteration, easier debugging, and lower
maintenance burden for a small team focused on educational outcomes.

## Child Safety & Privacy Requirements

### Authentication & Authorization

- Parent/teacher accounts use email + password authentication
- Child profiles are linked to parent account (no independent child accounts)
- Role hierarchy: Admin > Teacher > Parent > Student
- Permissions enforced at API route level with middleware
- Session expiry: 24 hours for students, 7 days for adults
- Multi-factor authentication (MFA) optional for admin/teacher roles

### Data Storage Rules

**Allowed Data:**
- User: id, email, role, created_at, last_login (for adults only)
- Student: id, display_name (first name only), grade, parent_id
- Progress: student_id, lesson_id, completed (boolean), score, completed_at
- Chat logs: session_id, timestamp, safe_query_hash (SHA-256), response_length

**Prohibited Data:**
- Full names, birthdates, addresses, phone numbers of children
- Raw chat transcripts (store only anonymized hashes)
- Browsing history, IP addresses, device fingerprints
- Any data that could identify a specific child outside the system

### Content Safety Filters

**AI Input Filters (Pre-processing):**
- Profanity detection and blocking
- Personal information detection (names, addresses, phone numbers)
- Unsafe intent detection (violence, self-harm, inappropriate topics)

**AI Output Filters (Post-processing):**
- Content policy validation (OpenAI moderation API)
- Fact-checking against lesson content (no hallucinations)
- Reading level validation (Grade-1 appropriate)
- Link and reference removal

### Incident Response

If unsafe content reaches a child:
1. Immediate removal of content from all affected lessons
2. Review of content moderation pipeline for gaps
3. Notification to parents of affected students within 24 hours
4. Incident report filed with details and corrective actions
5. Constitutional amendment if systematic failure detected

## Technical Standards

### Database Schema

**Core Tables:**

```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('admin', 'teacher', 'parent', 'student') NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
)

students (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  display_name VARCHAR(50) NOT NULL,
  grade INTEGER CHECK (grade BETWEEN 1 AND 12),
  parent_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
)

topics (
  id UUID PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)

lessons (
  id UUID PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  content_path VARCHAR(255) NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)

progress (
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  completed_at TIMESTAMP,
  PRIMARY KEY (student_id, lesson_id)
)

videos (
  id UUID PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  youtube_id VARCHAR(20) NOT NULL,
  title VARCHAR(200) NOT NULL,
  verified_safe BOOLEAN DEFAULT FALSE,
  educator_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)

chat_logs (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  safe_query_hash CHAR(64) NOT NULL,
  response_length INTEGER,
  INDEX idx_session (session_id),
  INDEX idx_timestamp (timestamp)
)
```

### API Routes (Vercel Serverless Functions)

**Public Routes (no auth required):**
- `GET /api/content/topics` - List all topics
- `GET /api/content/lessons/:lessonId` - Get lesson content

**Authenticated Routes (require valid session):**
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - End session
- `GET /api/progress/:studentId` - Get student progress
- `POST /api/progress/:studentId/:lessonId` - Update progress
- `POST /api/chat` - Send message to AI chatbot

**Admin Routes (require admin role):**
- `POST /api/admin/videos` - Add curated video
- `PATCH /api/admin/videos/:videoId` - Update video verification status
- `GET /api/admin/chat-logs` - Review anonymized chat logs

### Docusaurus Configuration

**Content Structure:**

```
docs/
├── intro.md
├── topics/
│   ├── living-things/
│   │   ├── index.md
│   │   ├── animals.mdx
│   │   ├── plants.mdx
│   │   └── body-parts.mdx
│   ├── materials/
│   │   ├── index.md
│   │   ├── solids-liquids-gases.mdx
│   │   └── properties.mdx
│   ├── forces-motion/
│   │   ├── index.md
│   │   ├── push-pull.mdx
│   │   └── magnets.mdx
│   └── earth-space/
│       ├── index.md
│       ├── weather.mdx
│       ├── seasons.mdx
│       └── day-night.mdx
└── activities/
    ├── experiments.mdx
    └── quizzes.mdx
```

**MDX Components:**
- `<ChatBot />` - Embedded AI helper (collapsible panel)
- `<VideoEmbed videoId="..." />` - Safe YouTube player with verified content
- `<Quiz questions={...} />` - Interactive assessments
- `<ProgressTracker />` - Visual progress indicator

**i18n Configuration:**
- Default locale: English (en)
- Additional locale: Urdu (ur)
- Locale-specific content in `i18n/ur/docusaurus-plugin-content-docs/current/`

### Environment Variables

```
# Database
DATABASE_URL=postgresql://user:pass@host/db

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-mini

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Deployment
VERCEL_ENV=production|preview|development
```

## Content Development Workflow

### Phase 1: Content Planning
1. Define learning objectives aligned with Grade-1 standards
2. Structure topics → subtopics → lessons
3. Identify curated video candidates
4. Review plan with educator (pedagogical validation)

### Phase 2: Content Creation
1. Write lesson content in MDX (simple language, short sentences)
2. Add visual aids (images, diagrams)
3. Select and verify YouTube videos
4. Create interactive components (quizzes, activities)
5. Test on target reading level validator

### Phase 3: Safety Review
1. Run content through safety filters (profanity, unsafe topics)
2. Verify all external links are educator-approved
3. Test AI chatbot responses for lesson-specific queries
4. Review with parent/teacher focus group

### Phase 4: Deployment
1. Merge content to main branch
2. Trigger Vercel preview deployment
3. QA validation on staging environment
4. Promote to production
5. Monitor chatbot interactions for first 24 hours

## Governance

### Amendment Procedure

1. Identify need for constitutional change (new principle, modified constraint)
2. Propose amendment with rationale and impact analysis
3. Review with project stakeholders (developers, educators, parents)
4. Document decision in Architecture Decision Record (ADR)
5. Update constitution with version bump:
   - **MAJOR:** Backward-incompatible governance changes, principle removals
   - **MINOR:** New principle added, section expanded
   - **PATCH:** Clarifications, wording, typo fixes
6. Propagate changes to dependent templates (spec, plan, tasks)
7. Commit with message: `docs: amend constitution to vX.Y.Z (change summary)`

### Compliance Review

- ALL feature specifications MUST reference constitution compliance
- ALL pull requests MUST pass constitution checks (automated where possible)
- Quarterly constitution review to identify gaps or outdated constraints
- Annual security audit for child safety and privacy compliance

### Complexity Justification

Any violation of constitutional principles (e.g., adding new technology, skipping
safety filters) MUST be justified with:
- **Why Needed:** Specific problem being solved
- **Simpler Alternative Rejected Because:** Why existing approach insufficient
- **Mitigation Plan:** How to minimize risk of the violation

Unjustified complexity will be rejected during code review.

### Runtime Guidance

For day-to-day development guidance beyond constitutional principles:
- See `CLAUDE.md` for agent-specific development instructions
- See `.claude/SKILL.md` for educational product engineering domain knowledge
- See `specs/<feature>/plan.md` for feature-specific architectural decisions
- See `history/adr/` for historical architectural decision records

**Version**: 1.0.0 | **Ratified**: 2026-01-14 | **Last Amended**: 2026-01-14

S