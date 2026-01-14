# Quickstart Guide: Grade-1 Science Learning Web Application

**Feature**: 001-grade1-science-app
**Last Updated**: 2026-01-14
**Estimated Setup Time**: 30 minutes

## Prerequisites

Before starting, ensure you have:

- **Node.js**: v18.x or later ([download](https://nodejs.org/))
- **pnpm**: v8.x or later (`npm install -g pnpm`)
- **Git**: Latest version
- **Neon Account**: Free tier ([sign up](https://neon.tech/))
- **Clerk Account**: Free tier ([sign up](https://clerk.com/))
- **OpenAI API Key**: [Get API key](https://platform.openai.com/api-keys)
- **Code Editor**: VS Code recommended

## Project Setup (15 minutes)

### 1. Initialize Docusaurus Project

```bash
# Clone repository
git clone <repo-url>
cd science-textbook-grade-1

# Checkout feature branch
git checkout 001-grade1-science-app

# Initialize Docusaurus (if not already done)
npx create-docusaurus@latest . classic --typescript

# Install dependencies
pnpm install

# Install additional dependencies
pnpm add @prisma/client @clerk/nextjs openai zod
pnpm add -D prisma typescript @types/node @types/react
```

### 2. Configure Environment Variables

Create `.env.local` file in project root:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/scienceapp?sslmode=require"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxx"
CLERK_SECRET_KEY="sk_test_xxx"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# OpenAI
OPENAI_API_KEY="sk-proj-xxx"
OPENAI_MODEL="gpt-4-mini"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**Important**: Add `.env.local` to `.gitignore`!

### 3. Setup Neon PostgreSQL Database

```bash
# Initialize Prisma
pnpm prisma init

# This creates:
# - prisma/schema.prisma
# - .env with DATABASE_URL
```

Copy the Prisma schema from `specs/001-grade1-science-app/data-model.md` into `prisma/schema.prisma`.

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev --name init

# Seed database with topics and lessons
pnpm prisma db seed
```

### 4. Configure Docusaurus

Update `docusaurus.config.js`:

```javascript
// @ts-check
const config = {
  title: 'Science Textbook Grade-1',
  tagline: 'Learn science in a fun way!',
  favicon: 'img/favicon.ico',
  url: 'https://science-grade1.vercel.app',
  baseUrl: '/',

  // i18n configuration
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      },
      ur: {
        label: 'اردو',
        direction: 'rtl',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', // Docs at root
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Science Grade 1',
      logo: {
        alt: 'Science Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} Science Textbook Grade-1`,
    },
  },
};

module.exports = config;
```

### 5. Register Custom MDX Components

Create `src/theme/MDXComponents.js`:

```javascript
import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import ChatBot from '@site/src/components/ChatBot';
import VideoEmbed from '@site/src/components/VideoEmbed';
import Quiz from '@site/src/components/Quiz';

export default {
  ...MDXComponents,
  ChatBot,
  VideoEmbed,
  Quiz,
};
```

## Development Workflow (Daily)

### Start Development Server

```bash
# Terminal 1: Start Docusaurus
pnpm start

# Terminal 2: Start Prisma Studio (optional)
pnpm prisma studio

# Opens browser at http://localhost:3000
```

### Common Commands

```bash
# Build for production
pnpm build

# Serve production build locally
pnpm serve

# Run type checking
pnpm tsc --noEmit

# Format code
pnpm prettier --write .

# Lint code
pnpm eslint src/ --ext .ts,.tsx

# Database migrations
pnpm prisma migrate dev
pnpm prisma migrate deploy  # Production

# Reset database (⚠️ destructive)
pnpm prisma migrate reset
```

## Project Structure

```
science-textbook-grade-1/
├── docs/                          # Docusaurus content (MDX files)
│   ├── intro.md                   # Landing page
│   └── topics/                    # 5 science topics
│       ├── 01-living-nonliving/
│       │   ├── index.md
│       │   ├── what-is-alive.mdx
│       │   └── nonliving-things.mdx
│       ├── 02-human-body-senses/
│       ├── 03-animals/
│       ├── 04-plants/
│       └── 05-earth-universe/
│
├── i18n/ur/                       # Urdu translations
│   └── docusaurus-plugin-content-docs/
│       └── current/               # Mirrors docs/ structure
│
├── src/
│   ├── components/                # React components
│   │   ├── ChatBot.tsx           # AI chatbot with safety filters
│   │   ├── VideoEmbed.tsx        # YouTube video player
│   │   ├── Quiz.tsx              # Interactive quizzes
│   │   └── ProgressTracker.tsx   # Visual progress indicator
│   ├── pages/                     # Custom Docusaurus pages
│   │   ├── sign-in.tsx           # Clerk authentication
│   │   ├── sign-up.tsx
│   │   └── dashboard.tsx         # Parent progress dashboard
│   ├── api/                       # Vercel serverless functions
│   │   ├── auth/
│   │   │   ├── login.ts
│   │   │   └── logout.ts
│   │   ├── chat/
│   │   │   └── message.ts        # AI chatbot endpoint
│   │   ├── progress/
│   │   │   ├── [studentId].ts
│   │   │   └── update.ts
│   │   ├── admin/
│   │   │   ├── videos.ts
│   │   │   └── chat-logs.ts
│   │   └── content/
│   │       ├── topics.ts
│   │       └── lessons/[id].ts
│   ├── lib/                       # Shared utilities
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── openai.ts             # OpenAI client
│   │   ├── safety-filters.ts     # Pre/post filters
│   │   └── auth.ts               # Clerk helpers
│   └── css/
│       └── custom.css            # Child-friendly theme
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Migration history
│   └── seed.ts                   # Seed data (topics, lessons)
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── specs/
│   └── 001-grade1-science-app/   # This feature's documentation
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       ├── quickstart.md         # This file
│       └── contracts/
│           └── api-spec.yaml
│
├── docusaurus.config.js          # Docusaurus configuration
├── sidebars.js                   # Sidebar navigation
├── package.json
├── tsconfig.json
└── vercel.json                   # Vercel deployment config
```

## Creating Content (Writers/Educators)

### 1. Add New Lesson

```bash
# Create MDX file
touch docs/topics/01-living-nonliving/new-lesson.mdx
```

**Example Lesson Template** (`new-lesson.mdx`):

```mdx
---
title: New Lesson Title
description: Brief description for metadata
---

# New Lesson Title

Simple text here. Max 10 words per sentence. Use pictures!

![Description](./images/picture.jpg)

## Watch and Learn

<VideoEmbed videoId="youtube-id-here" title="Video Title" />

## Let's Practice

<Quiz questions={[
  {
    id: "q1",
    type: "multiple-choice",
    question: "Which one is alive?",
    options: [
      { id: "a", text: "Dog", image: "./images/dog.jpg", correct: true },
      { id: "b", text: "Rock", image: "./images/rock.jpg", correct: false }
    ],
    feedback: {
      correct: "Great job! Dogs are living things!",
      incorrect: "Let's try again! Think about what grows and moves."
    }
  }
]} />

## Ask Questions

<ChatBot />
```

### 2. Add Video to Lesson (Admin Only)

1. Log in to admin panel: `/admin/videos`
2. Submit YouTube URL
3. Add educator notes
4. Mark as `verified_safe: true` after review
5. Video automatically appears in lesson

### 3. Translate Content to Urdu

```bash
# Copy English lesson
cp docs/topics/01-living-nonliving/what-is-alive.mdx \
   i18n/ur/docusaurus-plugin-content-docs/current/topics/01-living-nonliving/what-is-alive.mdx

# Edit Urdu version (replace all English text)
```

**Urdu Translation Checklist**:
- [ ] Translate all headings
- [ ] Translate all body text (Grade-1 appropriate Urdu)
- [ ] Keep image paths the same
- [ ] Keep component syntax the same (`<VideoEmbed>`, `<Quiz>`)
- [ ] Update quiz questions and options to Urdu
- [ ] Test rendering with `pnpm start --locale ur`

## Testing

### Run Tests

```bash
# Unit tests
pnpm jest

# Integration tests
pnpm jest --config jest.integration.config.js

# E2E tests (Playwright)
pnpm playwright test

# Watch mode
pnpm jest --watch
```

### Manual Testing Checklist

**Student Flow**:
- [ ] Parent logs in and creates child profile
- [ ] Child can access lesson content
- [ ] Videos play correctly (verified_safe only)
- [ ] Chatbot responds in <2 seconds with Grade-1 language
- [ ] Quiz submission marks lesson complete (score ≥70%)
- [ ] Progress persists across sessions

**Safety Testing**:
- [ ] Chatbot blocks profanity (test with common profane words)
- [ ] Chatbot blocks PII (test with "My name is John" → blocked)
- [ ] Chatbot rate limit enforces 10 queries/session
- [ ] Removed videos show placeholder (not technical error)
- [ ] Error messages are child-friendly (no stack traces)

**Accessibility**:
- [ ] Screen reader can navigate all content
- [ ] Keyboard-only navigation works
- [ ] Lighthouse Accessibility score >90
- [ ] High contrast mode renders correctly

## Deployment (Vercel)

### First-Time Setup

1. **Install Vercel CLI**:
   ```bash
   pnpm install -g vercel
   ```

2. **Link Project**:
   ```bash
   vercel link
   ```

3. **Set Environment Variables** (Vercel Dashboard):
   - `DATABASE_URL` (Neon PostgreSQL)
   - `CLERK_SECRET_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_APP_URL`

4. **Configure `vercel.json`**:
   ```json
   {
     "buildCommand": "pnpm docusaurus build",
     "outputDirectory": "build",
     "framework": null,
     "functions": {
       "src/api/**/*.ts": {
         "memory": 1024,
         "maxDuration": 10
       }
     }
   }
   ```

### Deploy

```bash
# Preview deployment (branch)
vercel

# Production deployment (main)
vercel --prod
```

### Post-Deployment Checklist

- [ ] Run Prisma migrations: `pnpm prisma migrate deploy`
- [ ] Seed production database (topics, lessons, admin user)
- [ ] Test auth flow (Clerk redirect URLs)
- [ ] Test chatbot API (OpenAI key configured)
- [ ] Verify videos load (YouTube not blocked)
- [ ] Check Lighthouse scores (>90 all categories)
- [ ] Monitor Vercel logs for errors
- [ ] Test from tablet device (primary target)

## Troubleshooting

### Common Issues

**Issue**: Prisma Client not found
```bash
# Solution: Regenerate client
pnpm prisma generate
```

**Issue**: Database connection fails
```bash
# Check DATABASE_URL format
# Neon requires ?sslmode=require
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

**Issue**: Chatbot always returns errors
```bash
# Verify OpenAI API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Issue**: Videos don't load
- Check `verified_safe = true` in database
- Verify YouTube video ID is correct (11 characters)
- Test YouTube embed directly: `https://www.youtube.com/embed/VIDEO_ID`

**Issue**: Urdu content not showing
- Verify locale selector in navbar
- Check i18n folder structure matches docs/
- Rebuild: `pnpm docusaurus build --locale ur`

## Performance Optimization

### Build Optimizations

```javascript
// docusaurus.config.js
module.exports = {
  // ...
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('esbuild-loader'),
      options: {
        loader: 'tsx',
        target: isServer ? 'node12' : 'es2017',
      },
    }),
  },

  // Image optimization
  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
      },
    ],
  ],
};
```

### API Route Optimization

```typescript
// src/api/chat/message.ts
import { OpenAI } from 'openai';

// Singleton OpenAI client (reused across invocations)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Connection pooling
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Enable streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');

  // ... chatbot logic
}
```

## Monitoring & Analytics

### Setup Sentry (Error Tracking)

```bash
pnpm add @sentry/nextjs
pnpm sentry-wizard -i nextjs
```

Configure `sentry.properties`:
```properties
defaults.project=science-grade1
defaults.org=your-org
```

### Vercel Analytics

Enable in Vercel Dashboard → Project → Analytics

**Metrics to Monitor**:
- Page load time (target: <2s)
- Chatbot response time (target: <2s, p95)
- API error rate (target: <1%)
- Lighthouse scores (target: >90)

## Support

**Documentation**: `specs/001-grade1-science-app/`
**API Reference**: `specs/001-grade1-science-app/contracts/api-spec.yaml`
**Issues**: GitHub Issues
**Slack**: #science-app-dev (internal)

## Next Steps

After completing quickstart:
1. Review `specs/001-grade1-science-app/plan.md` for implementation plan
2. Read `specs/001-grade1-science-app/data-model.md` for database schema
3. Implement custom React components (ChatBot, VideoEmbed, Quiz)
4. Write unit tests for safety filters
5. Create seed data for all 5 topics and 17 lessons
6. Deploy to Vercel preview environment
7. Conduct user testing with Grade-1 students
