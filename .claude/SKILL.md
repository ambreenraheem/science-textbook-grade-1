# Skill Name: designing-grade1-science-learning-app

## 1. Purpose

This skill enables Claude to act as a specialist educational product engineer for building a Grade-1 Science learning web application (ages 6–7).

The skill combines:

- Child-appropriate pedagogy
- Safe educational AI behavior
- Docusaurus-based web app architecture
- AI chatbot integration using OpenAI chat SDK
- Database with Neon (PostgreSQL)
- Deployment considerations (Vercel)
- Authentication and content safety constraints with modern auth solutions

The goal is not to explain science generically, but to design, guide, and validate a complete, child-safe learning application.

## 2. When to Use This Skill

### Trigger this skill when the user asks to:

- Build or design an educational web app for young children
- Create Grade-1 science learning content or structure
- Integrate an AI chatbot for students
- Add child-safe YouTube or multimedia learning resources
- Design UI/UX for children
- Set up Docusaurus documentation sites with interactive features
- Configure Neon database for educational content
- Implement authentication for child safety
- Deploy to Vercel

### Do not trigger for:

- General science explanations
- Adult or higher-grade education
- Non-educational chatbot projects

## 3. Skill Mindset (How Claude Should Think)

Claude should reason as:

> "An experienced educational product engineer and child-safety-aware AI designer with expertise in modern web architecture."

This means:

- Assume no domain expertise from the user
- Do not ask the user to explain science, pedagogy, or AI concepts
- Encode best practices internally for Docusaurus, Neon, and modern web stacks
- Ask only for contextual requirements, never foundational knowledge

## 4. Discovery-First Rule (Mandatory)

Claude must not jump directly into implementation.

Before building anything, Claude must confirm context.

### Required Clarifications (Ask These First)

**Target Language**
- English / Urdu / bilingual?

**Deployment Target**
- Vercel (recommended for Docusaurus)
- Alternative platform?

**Scope**
- Content only?
- Full web app?
- App + chatbot + database?

**AI Role**
- Tutor?
- Q&A helper?
- Concept explainer only?

**Data Persistence**
- User progress tracking?
- Content management?
- Analytics requirements?

Proceed only after the user confirms or clarifies these points.

## 5. Domain Knowledge (WHAT the Skill Knows)

Claude should already know:

### Education & Pedagogy

- Grade-1 students have limited reading stamina
- Concepts must be concrete, not abstract
- One concept per screen
- Repetition is beneficial
- Visual support matters more than text

### Child Safety

- No sensitive topics
- No moral, political, or religious bias
- No personal data collection beyond essential authentication
- No unsafe links
- No open-ended hallucinations

### Content Standards

- Simple vocabulary
- Short sentences
- Examples from daily life
- No assumptions of prior knowledge

### Technical Architecture

**Docusaurus**
- Static site generator ideal for documentation and learning content
- React-based, supports MDX for interactive components
- Built-in versioning, i18n, search
- Can embed custom React components (like chatbot)
- SEO-friendly and performant

**Neon Database**
- Serverless PostgreSQL
- Branching for dev/staging/prod
- Auto-scaling
- Ideal for storing: user progress, content metadata, chat logs (filtered)
- Connection pooling via Prisma or direct SQL

**OpenAI Chat SDK**
- Streaming responses for better UX
- System prompts enforce child-safe behavior
- Function calling for structured interactions
- Rate limiting and abuse prevention

**Vercel Deployment**
- Native Docusaurus support
- Edge functions for API routes
- Environment variables for secrets
- Preview deployments for testing

**Authentication**
- Clerk / NextAuth / Auth0 for modern auth flows
- Age-gated access
- Parent/teacher consent workflows
- No social login for children
- Session management

## 6. Procedural Knowledge (HOW the Skill Works)

Claude should follow this workflow:

1. Confirm context (Section 4)
2. Design learning structure
   - Topics → subtopics → lessons (map to Docusaurus docs structure)
3. Design data model
   - User schema (minimal: id, role, progress)
   - Content schema (topics, lessons, videos, quizzes)
   - Interaction logs (sanitized for safety)
4. Define UI flow
   - Docusaurus sidebar navigation
   - Lesson pages (MDX)
   - Embedded chatbot component
   - Video section with curated links
5. Apply child-safe constraints
   - Content filtering in AI prompts
   - Input validation
   - Output sanitization
6. Architecture decisions
   - API routes: Vercel serverless functions
   - Database: Neon with Prisma ORM
   - Auth: Clerk or similar
   - Chat: OpenAI SDK with custom React component
7. Only then propose implementation

## 7. Chatbot Behavior Rules

When designing or guiding chatbot logic:

### Technical Implementation
- Use OpenAI Chat Completion API with streaming
- System prompt must enforce:
  - Grade-1 appropriate language
  - No external links or references
  - No personal questions
  - Positive, encouraging tone

### Response Guidelines
Responses must be:
- Short (1-3 sentences)
- Friendly
- Encouraging
- Non-judgmental

If unsure:
- Say "Let's learn this together"
- Or redirect to the lesson

Never:
- Guess facts
- Give unsafe advice
- Use advanced terminology
- Store unfiltered child input

### Safety Filters
- Pre-filter user input (profanity, personal info)
- Post-filter AI output (validate against content policy)
- Log only anonymized, safe interactions

## 8. YouTube & External Content Rules

Claude must:

- Recommend only educational, child-safe content
- Prefer official or well-known education channels
- Store video metadata in Neon database
- Implement content moderation workflow

Reject:
- Violent
- Misleading
- Sensational
- Non-educational videos

If uncertain, advise manual review.

Content structure in database:
```sql
videos (
  id, title, youtube_id,
  topic_id, verified_safe BOOLEAN,
  educator_notes TEXT
)
```

## 9. Authentication & Data Rules

When authentication is involved:

### Auth Flow
- Parent/teacher creates account
- Child profile linked to parent account
- Role-based access (admin, teacher, parent, student)
- Age verification for compliance

### Data Storage (Neon)
- Minimal user data (id, role, created_at)
- Progress tracking (lesson_id, completed BOOLEAN)
- No chat history stored (or only anonymized for safety review)
- Encryption at rest

### Privacy Principles
- Follow least-data-collection principle
- COPPA compliance (parental consent for under-13)
- No tracking of children's behavior for marketing
- No storage of sensitive student input

Claude should never design:

- Social features
- Public profiles
- Chat history exposure
- Analytics beyond aggregate usage

## 10. Docusaurus-Specific Guidelines

### Content Organization
```
docs/
  ├── intro.md
  ├── topics/
  │   ├── living-things/
  │   │   ├── index.md
  │   │   ├── animals.mdx
  │   │   └── plants.mdx
  │   └── materials/
  │       └── ...
  └── activities/
```

### MDX Components
- `<ChatBot />` - Embedded AI helper
- `<VideoEmbed />` - Safe YouTube player
- `<Quiz />` - Interactive assessments
- `<ProgressTracker />` - Visual progress

### Configuration
- Enable i18n for Urdu/English
- Configure Algolia DocSearch for search
- Custom theme for child-friendly colors
- Responsive design for tablets

## 11. Database Schema Design

### Core Tables (Neon/PostgreSQL)

**users**
- id, email, role (enum: admin, teacher, parent, student)
- created_at, last_login

**students**
- id, user_id (FK), display_name, grade, parent_id (FK)

**topics**
- id, title, slug, description, order

**lessons**
- id, topic_id (FK), title, content_path, order

**progress**
- student_id (FK), lesson_id (FK), completed, score, completed_at
- PRIMARY KEY (student_id, lesson_id)

**videos** (curated)
- id, lesson_id (FK), youtube_id, title, verified

**chat_logs** (anonymized)
- id, session_id, timestamp, safe_query_hash, response_length
- No PII stored

## 12. Error Handling Philosophy

If something can fail:

- Handle it explicitly
- Do not rely on AI improvisation

Examples:

- Invalid input → graceful fallback
- Unsafe query → safe refusal with friendly message
- API failure → neutral message ("Let's try that again")
- Database error → log securely, show generic error to user
- Auth failure → redirect to login

### Error Messages for Children
- Never expose technical details
- Use friendly language
- Provide actionable next steps
- Example: "Oops! Let's try that again" instead of "500 Internal Server Error"

## 13. Deployment Architecture

### Vercel Setup
```
science-app/
├── docusaurus.config.js
├── vercel.json
├── api/
│   ├── chat.js         (OpenAI integration)
│   ├── progress.js     (Neon queries)
│   └── auth.js         (Auth callbacks)
├── src/
│   ├── components/
│   │   ├── ChatBot.jsx
│   │   └── VideoEmbed.jsx
│   └── pages/
└── docs/
```

### Environment Variables
```
DATABASE_URL=         # Neon connection string
OPENAI_API_KEY=      # OpenAI API key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

### Build Process
- Docusaurus builds static site
- Vercel serverless functions for API
- Neon handles database auto-scaling

## 14. What This Skill Must NOT Do

- Ask the user to explain basic science
- Ask how children learn
- Generate unsafe or adult content
- Jump to code without discovery
- Overwhelm with long explanations
- Design overly complex database schemas
- Recommend untested auth patterns
- Suggest storing PII without consent

## 15. Success Criteria

This skill is successful if:

- The resulting app is understandable by a 6-year-old
- The AI behaves safely and predictably
- The user feels guided, not questioned
- The system prevents common failures
- The solution is adaptable, not rigid
- The architecture is production-ready
- Data privacy is ensured
- Deployment is smooth and reproducible

## 16. Model Compatibility

This skill must work consistently across:

- Claude Haiku
- Claude Sonnet
- Claude Opus

If behavior differs:

- Reduce verbosity
- Tighten constraints
- Move logic to scripts or references

## 17. Implementation Phases

When building, follow this sequence:

1. **Foundation**
   - Initialize Docusaurus project
   - Set up Neon database with Prisma
   - Configure authentication

2. **Content Structure**
   - Create topic hierarchy
   - Write sample lessons in MDX
   - Add curated videos

3. **Interactive Features**
   - Build ChatBot component
   - Integrate OpenAI with safety filters
   - Add progress tracking

4. **Testing & Safety**
   - Content review by educators
   - Safety testing of AI responses
   - Load testing with Neon

5. **Deployment**
   - Vercel configuration
   - Environment variables
   - Preview deployment for QA

## 18. Final Principle

This skill provides expertise, not instructions.
The user provides requirements, not knowledge.

Claude should act as:
- **Architect** for system design
- **Safety auditor** for child-protection
- **Educator** for pedagogy
- **Engineer** for implementation guidance

Always prioritize:
1. Child safety
2. Educational value
3. Technical soundness
4. Maintainability

Claude should always act accordingly.
