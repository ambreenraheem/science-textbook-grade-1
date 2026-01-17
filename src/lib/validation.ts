/**
 * Validation Utilities
 * Uses Zod for runtime type validation and input sanitization
 */

import { z } from 'zod';

// ============================================================================
// User & Authentication Validation
// ============================================================================

export const EmailSchema = z.string().email('Please enter a valid email address');

export const RoleSchema = z.enum(['admin', 'teacher', 'parent', 'student']);

export const UserCreateSchema = z.object({
  email: EmailSchema,
  role: RoleSchema,
});

export type UserCreate = z.infer<typeof UserCreateSchema>;

// ============================================================================
// Student Profile Validation
// ============================================================================

export const DisplayNameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name must be 50 characters or less')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const GradeSchema = z
  .number()
  .int('Grade must be a whole number')
  .min(1, 'Grade must be at least 1')
  .max(12, 'Grade must be 12 or less');

export const StudentCreateSchema = z.object({
  displayName: DisplayNameSchema,
  grade: GradeSchema.default(1), // Default to Grade-1
  parentId: z.string().uuid('Invalid parent ID'),
});

export type StudentCreate = z.infer<typeof StudentCreateSchema>;

// ============================================================================
// Progress Tracking Validation
// ============================================================================

export const ScoreSchema = z
  .number()
  .int('Score must be a whole number')
  .min(0, 'Score cannot be negative')
  .max(100, 'Score cannot exceed 100')
  .nullable();

export const ProgressUpdateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  lessonId: z.string().uuid('Invalid lesson ID'),
  completed: z.boolean().default(false),
  score: ScoreSchema,
  completedAt: z.date().optional(),
});

export type ProgressUpdate = z.infer<typeof ProgressUpdateSchema>;

// ============================================================================
// Content Validation (Topics & Lessons)
// ============================================================================

export const SlugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
  .min(1, 'Slug is required')
  .max(100, 'Slug must be 100 characters or less');

export const TopicCreateSchema = z.object({
  title: z.string().min(1).max(100),
  slug: SlugSchema,
  description: z.string().max(500).optional(),
  orderIndex: z.number().int().min(1).max(5),
});

export type TopicCreate = z.infer<typeof TopicCreateSchema>;

export const LessonCreateSchema = z.object({
  topicId: z.string().uuid('Invalid topic ID'),
  title: z.string().min(1).max(100),
  contentPath: z.string().min(1).max(255),
  orderIndex: z.number().int().min(1),
});

export type LessonCreate = z.infer<typeof LessonCreateSchema>;

// ============================================================================
// Video Curation Validation
// ============================================================================

export const YouTubeIdSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{11}$/, 'Invalid YouTube video ID');

export const VideoCreateSchema = z.object({
  lessonId: z.string().uuid('Invalid lesson ID'),
  youtubeId: YouTubeIdSchema,
  title: z.string().min(1).max(200),
  verifiedSafe: z.boolean().default(false),
  educatorNotes: z.string().max(1000).optional(),
});

export type VideoCreate = z.infer<typeof VideoCreateSchema>;

// ============================================================================
// Chat Validation
// ============================================================================

export const LocaleSchema = z.enum(['en', 'ur']);

export const ChatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(500, 'Message must be 500 characters or less')
    .trim(),
  sessionId: z.string().uuid('Invalid session ID').optional(),
  locale: LocaleSchema.optional().default('en'),
});

export type Locale = z.infer<typeof LocaleSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// ============================================================================
// API Query Validation
// ============================================================================

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export const StudentProgressQuerySchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  topicId: z.string().uuid('Invalid topic ID').optional(),
  completed: z.boolean().optional(),
});

export type StudentProgressQuery = z.infer<typeof StudentProgressQuerySchema>;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Safely parse and validate data with Zod schema
 * @param schema Zod schema
 * @param data Data to validate
 * @returns Validation result with typed data or errors
 */
export function safeValidate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

/**
 * Format Zod validation errors into user-friendly messages
 * @param error Zod error object
 * @returns Array of error messages
 */
export function formatValidationErrors(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.join('.');
    return `${path}: ${issue.message}`;
  });
}

/**
 * Sanitize string input (trim, normalize whitespace)
 * @param input Raw string input
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

/**
 * Validate UUID format
 * @param id UUID string
 * @returns true if valid UUID
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
