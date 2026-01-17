/**
 * Session Management Utilities
 * Handles session ID generation, validation, message counting, and query hashing
 * for the AI chatbot with rate limiting.
 */

import { randomUUID, createHash } from 'crypto';
import { prisma } from './prisma';

/**
 * Maximum messages allowed per session (per constitution requirement)
 */
export const SESSION_MESSAGE_LIMIT = 10;

/**
 * Generate a new UUID v4 session ID
 * @returns Cryptographically secure session ID
 */
export function generateSessionId(): string {
  return randomUUID();
}

/**
 * Validate that a session ID is a valid UUID format
 * @param sessionId - Session ID to validate
 * @returns true if valid UUID v4 format
 */
export function validateSessionId(sessionId: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(sessionId);
}

/**
 * Get the number of messages sent in a session from the database
 * @param sessionId - Session ID to check
 * @returns Number of messages in this session
 */
export async function getSessionMessageCount(sessionId: string): Promise<number> {
  const count = await prisma.chatLog.count({
    where: { sessionId },
  });
  return count;
}

/**
 * Check if a session has reached its message limit
 * @param sessionId - Session ID to check
 * @returns true if session has reached limit
 */
export async function isSessionLimitReached(sessionId: string): Promise<boolean> {
  const count = await getSessionMessageCount(sessionId);
  return count >= SESSION_MESSAGE_LIMIT;
}

/**
 * Hash a query string using SHA-256 for anonymized logging
 * Normalizes input (lowercase, trim) before hashing for consistency
 * @param query - User's sanitized query
 * @returns 64-character hex hash
 */
export function hashQuery(query: string): string {
  return createHash('sha256')
    .update(query.toLowerCase().trim())
    .digest('hex');
}
