# Data Model: Grade-1 Science Learning Web Application

**Feature**: 001-grade1-science-app
**Date**: 2026-01-14
**Database**: Neon PostgreSQL with Prisma ORM

## Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    users    │───┐   │   students   │───┐   │  progress   │
│             │   │   │              │   │   │             │
│ id (PK)     │   └──<│ parent_id(FK)│   └──<│student_id(FK)│
│ email       │       │ user_id (FK) │       │ lesson_id(FK)│
│ role (ENUM) │       │ display_name │       │ completed   │
│ created_at  │       │ grade        │       │ score       │
│ last_login  │       │ created_at   │       │ completed_at│
└─────────────┘       └──────────────┘       └─────────────┘
                                                     ▲
                                                     │
┌─────────────┐       ┌──────────────┐             │
│   topics    │───┐   │   lessons    │─────────────┘
│             │   │   │              │
│ id (PK)     │   └──<│ topic_id (FK)│
│ title       │       │ title        │
│ slug        │       │ content_path │
│ description │       │ order_index  │
│ order_index │       │ created_at   │
│ created_at  │       └──────────────┘
└─────────────┘               │
                              │
                       ┌──────▼───────┐
                       │    videos    │
                       │              │
                       │ id (PK)      │
                       │ lesson_id(FK)│
                       │ youtube_id   │
                       │ title        │
                       │ verified_safe│
                       │ educator_notes│
                       │ created_at   │
                       └──────────────┘

┌─────────────┐
│  chat_logs  │  (Anonymized, no PII)
│             │
│ id (PK)     │
│ session_id  │
│ timestamp   │
│ safe_query_hash │
│ response_length │
└─────────────┘
```

---

## Entity Definitions

### users

**Purpose**: Represents adult accounts (parent, teacher, admin) in the system.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email for authentication |
| role | ENUM('admin', 'teacher', 'parent', 'student') | NOT NULL | Role-based access control |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| last_login | TIMESTAMP | NULLABLE | Last successful login |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE INDEX on email
- INDEX on role (for role-based queries)

**Validation Rules**:
- Email MUST match RFC 5322 format
- Role MUST be one of: admin, teacher, parent, student
- Email MUST be unique across all users
- created_at MUST be set on insert (default)

**COPPA Compliance Notes**:
- No child accounts directly in users table
- Only adults (parent/teacher/admin) have direct user accounts
- Parent must be age-verified during signup (DOB checked, not stored)

**State Transitions**:
- Created → Active (email verified)
- Active → Suspended (admin action)
- Active → Deleted (soft delete with deleted_at)

---

### students

**Purpose**: Child profiles linked to parent accounts, no independent authentication.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| user_id | UUID | FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE | Links to user account (for potential future student login) |
| display_name | VARCHAR(50) | NOT NULL | First name only, no last names |
| grade | INTEGER | NOT NULL, CHECK (grade BETWEEN 1 AND 12) | Grade level (1 for Grade-1) |
| parent_id | UUID | FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE | Parent who manages this child |
| created_at | TIMESTAMP | DEFAULT NOW() | Profile creation timestamp |

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY INDEX on user_id
- FOREIGN KEY INDEX on parent_id
- INDEX on (parent_id, grade) for parent dashboard queries

**Validation Rules**:
- display_name MUST be 1-50 characters, no special characters
- grade MUST be 1 (for Grade-1 students)
- parent_id MUST reference a user with role = 'parent'
- One parent can have multiple students

**COPPA Compliance**:
- Only first name stored (display_name)
- No birthdate, last name, address, phone
- Linked to parent_id for consent tracking
- Cascade delete when parent account deleted

**Relationships**:
- Belongs to one parent (parent_id)
- Has many progress records (via student_id)

---

### topics

**Purpose**: Top-level science categories (5 total for Grade-1).

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| title | VARCHAR(100) | NOT NULL | Topic display name |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly identifier |
| description | TEXT | NULLABLE | Short description for parents/teachers |
| order_index | INTEGER | NOT NULL | Display order (1-5) |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE INDEX on slug
- INDEX on order_index (for ordered display)

**Validation Rules**:
- title MUST be 1-100 characters
- slug MUST match pattern: ^[a-z0-9-]+$
- order_index MUST be unique per topic
- order_index MUST be 1-5 (5 topics total)

**Seed Data** (Required for MVP):
```sql
INSERT INTO topics (title, slug, description, order_index) VALUES
('Living and Non-living Things', '01-living-nonliving', 'Learn what makes something alive', 1),
('Human Body and Senses', '02-human-body-senses', 'Explore your five senses', 2),
('Animals', '03-animals', 'Discover different animals and their homes', 3),
('Plants', '04-plants', 'Learn about plants and how they grow', 4),
('Earth and Universe', '05-earth-universe', 'Explore our planet and the sky', 5);
```

**Relationships**:
- Has many lessons (via topic_id)

---

### lessons

**Purpose**: Individual learning units within a topic (17 total across 5 topics).

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| topic_id | UUID | FOREIGN KEY REFERENCES topics(id) ON DELETE CASCADE | Parent topic |
| title | VARCHAR(100) | NOT NULL | Lesson display name |
| content_path | VARCHAR(255) | NOT NULL | Path to MDX file (e.g., "topics/01-living-nonliving/what-is-alive.mdx") |
| order_index | INTEGER | NOT NULL | Display order within topic |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY INDEX on topic_id
- INDEX on (topic_id, order_index) for topic page queries
- UNIQUE INDEX on content_path

**Validation Rules**:
- title MUST be 1-100 characters
- content_path MUST point to existing MDX file in docs/
- order_index MUST be unique within topic_id
- order_index MUST start at 1 for each topic

**Seed Data Example** (Topic 1 lessons):
```sql
INSERT INTO lessons (topic_id, title, content_path, order_index) VALUES
('topic-1-uuid', 'What Makes Something Alive?', 'topics/01-living-nonliving/what-is-alive.mdx', 1),
('topic-1-uuid', 'Non-living Things Around Us', 'topics/01-living-nonliving/nonliving-things.mdx', 2),
('topic-1-uuid', 'Sorting Living and Non-living', 'topics/01-living-nonliving/sorting-activity.mdx', 3);
```

**Relationships**:
- Belongs to one topic (topic_id)
- Has many videos (via lesson_id)
- Has many progress records (via lesson_id)

---

### progress

**Purpose**: Tracks student completion and scores for each lesson.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| student_id | UUID | FOREIGN KEY REFERENCES students(id) ON DELETE CASCADE | Student who completed lesson |
| lesson_id | UUID | FOREIGN KEY REFERENCES lessons(id) ON DELETE CASCADE | Lesson completed |
| completed | BOOLEAN | DEFAULT FALSE | Whether lesson is marked complete |
| score | INTEGER | NULLABLE, CHECK (score BETWEEN 0 AND 100) | Quiz score percentage (NULL if not taken) |
| completed_at | TIMESTAMP | NULLABLE | When lesson was marked complete |
| PRIMARY KEY | (student_id, lesson_id) | Composite key | Prevents duplicate progress records |

**Indexes**:
- PRIMARY KEY (student_id, lesson_id)
- FOREIGN KEY INDEX on student_id
- FOREIGN KEY INDEX on lesson_id
- INDEX on (student_id, completed) for progress dashboard

**Validation Rules**:
- score MUST be 0-100 if not NULL
- score ≥ 70 required to mark completed = TRUE
- completed_at MUST be set when completed = TRUE
- Upsert pattern: INSERT ... ON CONFLICT (student_id, lesson_id) DO UPDATE

**Business Logic**:
- Lesson marked complete when quiz score ≥ 70%
- Progress persists across sessions
- Parent dashboard shows completion percentage
- Student sees visual indicators (checkmarks, progress bars)

**Relationships**:
- Belongs to one student (student_id)
- Belongs to one lesson (lesson_id)

---

### videos

**Purpose**: Curated YouTube videos linked to lessons, educator-verified only.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| lesson_id | UUID | FOREIGN KEY REFERENCES lessons(id) ON DELETE CASCADE | Lesson this video belongs to |
| youtube_id | VARCHAR(20) | NOT NULL | YouTube video ID (e.g., "dQw4w9WgXcQ") |
| title | VARCHAR(200) | NOT NULL | Video title for display |
| verified_safe | BOOLEAN | DEFAULT FALSE | Educator approval flag |
| educator_notes | TEXT | NULLABLE | Internal notes from educator review |
| created_at | TIMESTAMP | DEFAULT NOW() | Submission timestamp |

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY INDEX on lesson_id
- INDEX on (lesson_id, verified_safe) for student video queries
- INDEX on verified_safe (for admin curation panel)

**Validation Rules**:
- youtube_id MUST match pattern: ^[A-Za-z0-9_-]{11}$
- title MUST be 1-200 characters
- verified_safe MUST be FALSE by default (requires admin approval)
- educator_notes optional but recommended

**Content Safety Workflow**:
1. Admin submits YouTube URL → extract youtube_id
2. Video stored with verified_safe = FALSE
3. Admin reviews video → marks verified_safe = TRUE
4. Only videos with verified_safe = TRUE shown to students
5. If flagged, set verified_safe = FALSE (soft delete, audit trail preserved)

**Query Patterns**:
```sql
-- Get verified videos for a lesson (student view)
SELECT * FROM videos
WHERE lesson_id = $1 AND verified_safe = TRUE
ORDER BY created_at;

-- Get unverified videos (admin curation panel)
SELECT * FROM videos
WHERE verified_safe = FALSE
ORDER BY created_at DESC;
```

**Relationships**:
- Belongs to one lesson (lesson_id)

---

### chat_logs

**Purpose**: Anonymized interaction logs for safety review, NO raw transcripts or PII.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| session_id | UUID | NOT NULL | Anonymous session identifier (not linked to user_id) |
| timestamp | TIMESTAMP | DEFAULT NOW() | When interaction occurred |
| safe_query_hash | CHAR(64) | NOT NULL | SHA-256 hash of sanitized query (NO raw text) |
| response_length | INTEGER | NOT NULL | Character count of response (for rate limiting analysis) |

**Indexes**:
- PRIMARY KEY (id)
- INDEX on session_id (for session-based queries)
- INDEX on timestamp (for time-range analysis)

**COPPA Compliance**:
- NO raw chat transcripts stored
- NO linkage to student_id or user_id
- session_id is ephemeral (not tied to user account)
- Only hashes and metadata stored
- Used for aggregate safety analysis only

**Use Cases**:
- Detect patterns of inappropriate queries (hash frequency)
- Monitor rate limiting effectiveness (count per session)
- Analyze chatbot usage patterns (response lengths)
- Safety audits (identify anomalies)

**NOT Used For**:
- Individual student tracking
- Content recommendations
- Marketing analysis
- Behavioral profiling

**Data Retention**:
- Logs older than 90 days automatically deleted
- No backups of chat_logs (ephemeral by design)

---

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id         String    @id @default(uuid()) @db.Uuid
  email      String    @unique @db.VarChar(255)
  role       Role
  createdAt  DateTime  @default(now()) @map("created_at")
  lastLogin  DateTime? @map("last_login")

  // Relationships
  managedStudents Student[] @relation("ParentStudents")

  @@index([role])
  @@map("users")
}

model Student {
  id          String   @id @default(uuid()) @db.Uuid
  userId      String?  @map("user_id") @db.Uuid // Future: student login
  displayName String   @map("display_name") @db.VarChar(50)
  grade       Int      @db.Integer
  parentId    String   @map("parent_id") @db.Uuid
  createdAt   DateTime @default(now()) @map("created_at")

  // Relationships
  parent   User       @relation("ParentStudents", fields: [parentId], references: [id], onDelete: Cascade)
  progress Progress[]

  @@index([parentId, grade])
  @@map("students")
}

model Topic {
  id          String   @id @default(uuid()) @db.Uuid
  title       String   @db.VarChar(100)
  slug        String   @unique @db.VarChar(100)
  description String?  @db.Text
  orderIndex  Int      @map("order_index") @db.Integer
  createdAt   DateTime @default(now()) @map("created_at")

  // Relationships
  lessons Lesson[]

  @@index([orderIndex])
  @@map("topics")
}

model Lesson {
  id          String   @id @default(uuid()) @db.Uuid
  topicId     String   @map("topic_id") @db.Uuid
  title       String   @db.VarChar(100)
  contentPath String   @unique @map("content_path") @db.VarChar(255)
  orderIndex  Int      @map("order_index") @db.Integer
  createdAt   DateTime @default(now()) @map("created_at")

  // Relationships
  topic    Topic      @relation(fields: [topicId], references: [id], onDelete: Cascade)
  videos   Video[]
  progress Progress[]

  @@index([topicId, orderIndex])
  @@map("lessons")
}

model Progress {
  studentId   String    @map("student_id") @db.Uuid
  lessonId    String    @map("lesson_id") @db.Uuid
  completed   Boolean   @default(false)
  score       Int?      @db.Integer
  completedAt DateTime? @map("completed_at")

  // Relationships
  student Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  lesson  Lesson  @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@id([studentId, lessonId])
  @@index([studentId, completed])
  @@map("progress")
}

model Video {
  id            String   @id @default(uuid()) @db.Uuid
  lessonId      String   @map("lesson_id") @db.Uuid
  youtubeId     String   @map("youtube_id") @db.VarChar(20)
  title         String   @db.VarChar(200)
  verifiedSafe  Boolean  @default(false) @map("verified_safe")
  educatorNotes String?  @map("educator_notes") @db.Text
  createdAt     DateTime @default(now()) @map("created_at")

  // Relationships
  lesson Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@index([lessonId, verifiedSafe])
  @@index([verifiedSafe])
  @@map("videos")
}

model ChatLog {
  id              String   @id @default(uuid()) @db.Uuid
  sessionId       String   @map("session_id") @db.Uuid
  timestamp       DateTime @default(now())
  safeQueryHash   String   @map("safe_query_hash") @db.Char(64)
  responseLength  Int      @map("response_length") @db.Integer

  @@index([sessionId])
  @@index([timestamp])
  @@map("chat_logs")
}

enum Role {
  admin
  teacher
  parent
  student
}
```

---

## Migration Strategy

### Initial Migration (v1)
```sql
-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM type
CREATE TYPE "Role" AS ENUM ('admin', 'teacher', 'parent', 'student');

-- Create all tables in dependency order
CREATE TABLE users (...);
CREATE TABLE students (...);
CREATE TABLE topics (...);
CREATE TABLE lessons (...);
CREATE TABLE progress (...);
CREATE TABLE videos (...);
CREATE TABLE chat_logs (...);

-- Create indexes
-- Create foreign key constraints
```

### Seed Data (Required for MVP)
1. Insert 5 topics
2. Insert 17 lessons (mapped to Docusaurus MDX files)
3. Create admin user account
4. Insert curated videos with verified_safe = TRUE

### Future Migrations
- Add soft delete (deleted_at column) if needed
- Add audit trail tables
- Add quiz_attempts table for detailed analytics (future)

---

## Query Optimization

### Common Queries & Indexes

**Student Progress Dashboard** (Parent View):
```sql
SELECT
  l.title,
  t.title as topic_title,
  p.completed,
  p.score,
  p.completed_at
FROM progress p
JOIN lessons l ON p.lesson_id = l.id
JOIN topics t ON l.topic_id = t.id
WHERE p.student_id = $1
ORDER BY t.order_index, l.order_index;
```
*Index*: (student_id, completed), (topic_id, order_index), (lesson_id)

**Lesson Content with Videos** (Student View):
```sql
SELECT
  l.title,
  l.content_path,
  v.youtube_id,
  v.title as video_title
FROM lessons l
LEFT JOIN videos v ON l.id = v.lesson_id AND v.verified_safe = TRUE
WHERE l.id = $1;
```
*Index*: (lesson_id, verified_safe)

**Admin Curation Panel**:
```sql
SELECT * FROM videos
WHERE verified_safe = FALSE
ORDER BY created_at DESC
LIMIT 50;
```
*Index*: (verified_safe, created_at DESC)

---

## Data Retention & Cleanup

### Automated Cleanup (Scheduled Jobs)
1. **Chat Logs**: Delete records older than 90 days (weekly job)
2. **Inactive Students**: Notify parent after 18 months inactivity, delete after 24 months
3. **Soft-deleted Users**: Permanently delete 7 days after deletion request

### Manual Deletion (Parent Request)
```sql
-- Delete all child data
DELETE FROM students WHERE parent_id = $1;
-- Cascades to: progress records
-- Does NOT cascade to: chat_logs (no linkage by design)
```

---

## Security Considerations

### Row-Level Security (Future)
- Not implemented in MVP (application-level filtering sufficient for <10k users)
- Consider RLS if scaling beyond 10k concurrent users

### Data Encryption
- At rest: Neon PostgreSQL encryption
- In transit: TLS 1.3 for all connections
- Application-level: No sensitive data in client-side storage

### Backup Strategy
- Neon automatic backups (daily)
- Point-in-time recovery available
- NO backups of chat_logs (ephemeral by design)

---

## Testing Strategy

### Unit Tests (Prisma Models)
- Validation rules (email format, grade range, score range)
- Unique constraints (email, slug, content_path)
- Foreign key constraints

### Integration Tests (Database)
- User creates student profile → verify cascade relationships
- Student completes lesson → verify progress upsert
- Admin removes video → verify soft delete (verified_safe = FALSE)
- Parent deletes account → verify cascade deletion

### Seed Data Tests
- Verify all 5 topics present
- Verify all 17 lessons mapped to existing MDX files
- Verify admin account created

---

## Next Steps

1. Generate API contracts based on this data model
2. Create database migration scripts
3. Implement Prisma client initialization
4. Write seed data scripts
5. Update quickstart guide with database setup
