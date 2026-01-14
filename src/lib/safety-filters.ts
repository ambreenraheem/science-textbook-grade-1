/**
 * Multi-layer Safety Filters for AI Chatbot
 * Implements constitution principle: Child Safety First
 *
 * Filter Layers:
 * 1. Pre-filter: Profanity & PII detection (blocks before OpenAI)
 * 2. OpenAI: Content generation with safety constraints
 * 3. Moderation: OpenAI Moderation API check
 * 4. Post-filter: Educational relevance & tone validation
 */

import { openai } from './openai';

// ============================================================================
// Layer 1: Pre-filter (Input Validation)
// ============================================================================

/**
 * Profanity word list (basic patterns - extend as needed)
 * In production, use a comprehensive profanity filter library
 */
const PROFANITY_PATTERNS = [
  /\b(stupid|dumb|hate|kill|die|shut\s*up)\b/i,
  // Add more patterns as needed
];

/**
 * PII detection patterns (emails, phone numbers, addresses)
 */
const PII_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i, // Email
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/i, // Phone number
  /\b\d{5}(-\d{4})?\b/i, // Zip code
];

/**
 * Off-topic detection patterns
 * Rejects questions unrelated to Grade-1 science
 */
const OFF_TOPIC_PATTERNS = [
  /\b(homework|test|exam|grade|score)\b/i, // Academic pressure
  /\b(buy|sell|price|cost|money)\b/i, // Commercial content
  /\b(password|login|account)\b/i, // Security risks
];

export interface PreFilterResult {
  safe: boolean;
  reason?: string;
  sanitizedInput?: string;
}

/**
 * Pre-filter user input before sending to OpenAI
 * @param input Raw user question
 * @returns Filter result with sanitized input or rejection reason
 */
export function preFilterInput(input: string): PreFilterResult {
  // 1. Check for empty/invalid input
  if (!input || input.trim().length === 0) {
    return { safe: false, reason: 'Please ask me a question!' };
  }

  // 2. Check length (prevent abuse)
  if (input.length > 500) {
    return { safe: false, reason: 'Your question is too long. Can you make it shorter?' };
  }

  // 3. Check for profanity
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(input)) {
      return { safe: false, reason: 'Please use kind words when asking questions.' };
    }
  }

  // 4. Check for PII
  for (const pattern of PII_PATTERNS) {
    if (pattern.test(input)) {
      return { safe: false, reason: 'Please don\'t share personal information like emails or phone numbers.' };
    }
  }

  // 5. Check for off-topic content
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(input)) {
      return {
        safe: false,
        reason: 'I can only help with science questions about animals, plants, and nature!',
      };
    }
  }

  // Input passes pre-filter
  return { safe: true, sanitizedInput: input.trim() };
}

// ============================================================================
// Layer 3: OpenAI Moderation API
// ============================================================================

export interface ModerationResult {
  safe: boolean;
  reason?: string;
  categories?: Record<string, boolean>;
}

/**
 * Check content safety using OpenAI Moderation API
 * @param text Content to moderate (input or output)
 * @returns Moderation result
 */
export async function moderateContent(text: string): Promise<ModerationResult> {
  try {
    const moderation = await openai.moderations.create({
      input: text,
    });

    const result = moderation.results[0];

    if (result.flagged) {
      return {
        safe: false,
        reason: 'This content is not appropriate for children.',
        categories: result.categories as Record<string, boolean>,
      };
    }

    return { safe: true };
  } catch (error) {
    console.error('Moderation API error:', error);
    // Fail-safe: If moderation API fails, reject to be safe
    return {
      safe: false,
      reason: 'Unable to verify content safety. Please try again.',
    };
  }
}

// ============================================================================
// Layer 4: Post-filter (Output Validation)
// ============================================================================

/**
 * Educational relevance keywords
 * Responses should relate to Grade-1 science topics
 */
const SCIENCE_KEYWORDS = [
  'animal', 'plant', 'living', 'grow', 'earth', 'sun', 'moon', 'star',
  'water', 'air', 'soil', 'body', 'sense', 'see', 'hear', 'smell', 'taste',
  'touch', 'food', 'home', 'baby', 'seed', 'flower', 'tree', 'weather',
  'day', 'night', 'season', 'rock', 'stone',
];

export interface PostFilterResult {
  safe: boolean;
  reason?: string;
  sanitizedOutput?: string;
}

/**
 * Post-filter AI response before showing to student
 * @param response AI-generated response
 * @returns Filter result with sanitized output or rejection reason
 */
export function postFilterOutput(response: string): PostFilterResult {
  // 1. Check for empty response
  if (!response || response.trim().length === 0) {
    return { safe: false, reason: 'Unable to generate a response. Please try again.' };
  }

  // 2. Check length (too long responses lose child attention)
  if (response.length > 500) {
    return {
      safe: false,
      reason: 'Response too long - exceeds child-friendly length limit.',
    };
  }

  // 3. Check for educational relevance (basic heuristic)
  const lowerResponse = response.toLowerCase();
  const hasScience Keyword = SCIENCE_KEYWORDS.some((keyword) =>
    lowerResponse.includes(keyword)
  );

  // If no science keywords, might be off-topic (but allow some flexibility)
  if (!hasScienceKeyword && response.length > 100) {
    return {
      safe: false,
      reason: 'Response does not appear to be science-related.',
    };
  }

  // 4. Check for inappropriate phrases (backup check)
  const inappropriatePatterns = [
    /click here/i,
    /visit website/i,
    /download/i,
    /\bhttp/i, // URLs
  ];

  for (const pattern of inappropriatePatterns) {
    if (pattern.test(response)) {
      return {
        safe: false,
        reason: 'Response contains inappropriate content (links/downloads).',
      };
    }
  }

  // Response passes post-filter
  return { safe: true, sanitizedOutput: response.trim() };
}

// ============================================================================
// Combined Filter Pipeline
// ============================================================================

export interface FilterPipelineResult {
  safe: boolean;
  reason?: string;
  sanitizedInput?: string;
}

/**
 * Run complete input filter pipeline (pre-filter + moderation)
 * @param input Raw user input
 * @returns Combined filter result
 */
export async function filterInputPipeline(input: string): Promise<FilterPipelineResult> {
  // Layer 1: Pre-filter
  const preFilter = preFilterInput(input);
  if (!preFilter.safe) {
    return { safe: false, reason: preFilter.reason };
  }

  // Layer 3: Moderation API
  const moderation = await moderateContent(preFilter.sanitizedInput!);
  if (!moderation.safe) {
    return { safe: false, reason: moderation.reason };
  }

  return { safe: true, sanitizedInput: preFilter.sanitizedInput };
}

/**
 * Run complete output filter pipeline (moderation + post-filter)
 * @param output AI-generated response
 * @returns Combined filter result
 */
export async function filterOutputPipeline(output: string): Promise<FilterPipelineResult> {
  // Layer 3: Moderation API
  const moderation = await moderateContent(output);
  if (!moderation.safe) {
    return { safe: false, reason: moderation.reason };
  }

  // Layer 4: Post-filter
  const postFilter = postFilterOutput(output);
  if (!postFilter.safe) {
    return { safe: false, reason: postFilter.reason };
  }

  return { safe: true, sanitizedInput: postFilter.sanitizedOutput };
}
