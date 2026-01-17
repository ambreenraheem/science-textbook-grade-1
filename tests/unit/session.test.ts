/**
 * Unit tests for session management utilities
 */

// Mock prisma before importing session
jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    chatLog: {
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import {
  generateSessionId,
  validateSessionId,
  hashQuery,
  SESSION_MESSAGE_LIMIT,
} from '../../src/lib/session';

describe('Session Management', () => {
  describe('generateSessionId', () => {
    it('should generate a valid UUID v4', () => {
      const sessionId = generateSessionId();
      expect(validateSessionId(sessionId)).toBe(true);
    });

    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateSessionId());
      }
      expect(ids.size).toBe(100);
    });

    it('should generate 36-character string with hyphens', () => {
      const sessionId = generateSessionId();
      expect(sessionId.length).toBe(36);
      expect(sessionId.split('-').length).toBe(5);
    });
  });

  describe('validateSessionId', () => {
    it('should accept valid UUID v4 lowercase', () => {
      expect(validateSessionId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should accept valid UUID v4 uppercase', () => {
      expect(validateSessionId('550E8400-E29B-41D4-A716-446655440000')).toBe(true);
    });

    it('should accept valid UUID v4 mixed case', () => {
      expect(validateSessionId('550e8400-E29B-41d4-A716-446655440000')).toBe(true);
    });

    it('should reject empty string', () => {
      expect(validateSessionId('')).toBe(false);
    });

    it('should reject non-UUID strings', () => {
      expect(validateSessionId('not-a-uuid')).toBe(false);
      expect(validateSessionId('123')).toBe(false);
      expect(validateSessionId('hello-world')).toBe(false);
    });

    it('should reject UUID with wrong version', () => {
      // Version 6 UUID (not valid for v1-5)
      expect(validateSessionId('550e8400-e29b-61d4-a716-446655440000')).toBe(false);
    });

    it('should reject UUID with wrong variant', () => {
      // Wrong variant byte (should be 8, 9, a, or b)
      expect(validateSessionId('550e8400-e29b-41d4-c716-446655440000')).toBe(false);
    });

    it('should reject UUID with extra characters', () => {
      expect(validateSessionId('550e8400-e29b-41d4-a716-446655440000-extra')).toBe(false);
    });

    it('should reject UUID with missing hyphens', () => {
      expect(validateSessionId('550e8400e29b41d4a716446655440000')).toBe(false);
    });
  });

  describe('hashQuery', () => {
    it('should return 64-character hex string', () => {
      const hash = hashQuery('test query');
      expect(hash.length).toBe(64);
      expect(/^[0-9a-f]{64}$/.test(hash)).toBe(true);
    });

    it('should be deterministic', () => {
      const hash1 = hashQuery('test query');
      const hash2 = hashQuery('test query');
      expect(hash1).toBe(hash2);
    });

    it('should be case-insensitive', () => {
      const hash1 = hashQuery('Test Query');
      const hash2 = hashQuery('test query');
      const hash3 = hashQuery('TEST QUERY');
      expect(hash1).toBe(hash2);
      expect(hash2).toBe(hash3);
    });

    it('should trim whitespace', () => {
      const hash1 = hashQuery('  test query  ');
      const hash2 = hashQuery('test query');
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different queries', () => {
      const hash1 = hashQuery('query one');
      const hash2 = hashQuery('query two');
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', () => {
      const hash = hashQuery('');
      expect(hash.length).toBe(64);
    });

    it('should handle unicode characters', () => {
      const hash = hashQuery('پودوں کو پانی کی ضرورت کیوں ہے؟');
      expect(hash.length).toBe(64);
      expect(/^[0-9a-f]{64}$/.test(hash)).toBe(true);
    });
  });

  describe('SESSION_MESSAGE_LIMIT', () => {
    it('should be 10 as per constitution requirement', () => {
      expect(SESSION_MESSAGE_LIMIT).toBe(10);
    });
  });
});
