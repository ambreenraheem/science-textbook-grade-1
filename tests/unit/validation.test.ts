/**
 * Unit tests for validation schemas
 */

import { ChatMessageSchema, LocaleSchema } from '../../src/lib/validation';

describe('Validation Schemas', () => {
  describe('LocaleSchema', () => {
    it('should accept en locale', () => {
      const result = LocaleSchema.safeParse('en');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('en');
      }
    });

    it('should accept ur locale', () => {
      const result = LocaleSchema.safeParse('ur');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('ur');
      }
    });

    it('should reject unsupported locales', () => {
      expect(LocaleSchema.safeParse('fr').success).toBe(false);
      expect(LocaleSchema.safeParse('es').success).toBe(false);
      expect(LocaleSchema.safeParse('de').success).toBe(false);
    });

    it('should reject empty string', () => {
      expect(LocaleSchema.safeParse('').success).toBe(false);
    });
  });

  describe('ChatMessageSchema', () => {
    it('should accept valid message', () => {
      const result = ChatMessageSchema.safeParse({
        message: 'Why do birds fly?',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.message).toBe('Why do birds fly?');
        expect(result.data.locale).toBe('en'); // default
      }
    });

    it('should accept message with sessionId', () => {
      const result = ChatMessageSchema.safeParse({
        message: 'What do plants eat?',
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sessionId).toBe('550e8400-e29b-41d4-a716-446655440000');
      }
    });

    it('should accept message with locale en', () => {
      const result = ChatMessageSchema.safeParse({
        message: 'Test',
        locale: 'en',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.locale).toBe('en');
      }
    });

    it('should accept message with locale ur', () => {
      const result = ChatMessageSchema.safeParse({
        message: 'Test',
        locale: 'ur',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.locale).toBe('ur');
      }
    });

    it('should accept full valid payload', () => {
      const result = ChatMessageSchema.safeParse({
        message: 'Why is the sky blue?',
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
        locale: 'en',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty message', () => {
      const result = ChatMessageSchema.safeParse({
        message: '',
      });
      expect(result.success).toBe(false);
    });

    it('should trim whitespace-only message to empty (after min check)', () => {
      // Note: Zod runs min(1) before trim(), so "   " passes min check (length 3)
      // then gets trimmed to "". This is current schema behavior.
      const result = ChatMessageSchema.safeParse({
        message: '   ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.message).toBe('');
      }
    });

    it('should reject message exceeding 500 characters', () => {
      const result = ChatMessageSchema.safeParse({
        message: 'a'.repeat(501),
      });
      expect(result.success).toBe(false);
    });

    it('should accept message at exactly 500 characters', () => {
      const result = ChatMessageSchema.safeParse({
        message: 'a'.repeat(500),
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid sessionId format', () => {
      const result = ChatMessageSchema.safeParse({
        message: 'Test',
        sessionId: 'not-a-uuid',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid locale', () => {
      const result = ChatMessageSchema.safeParse({
        message: 'Test',
        locale: 'fr',
      });
      expect(result.success).toBe(false);
    });

    it('should default locale to en when not provided', () => {
      const result = ChatMessageSchema.safeParse({
        message: 'Test message',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.locale).toBe('en');
      }
    });

    it('should trim message whitespace', () => {
      const result = ChatMessageSchema.safeParse({
        message: '  Why do plants grow?  ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.message).toBe('Why do plants grow?');
      }
    });

    it('should reject missing message field', () => {
      const result = ChatMessageSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject null message', () => {
      const result = ChatMessageSchema.safeParse({
        message: null,
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-string message', () => {
      const result = ChatMessageSchema.safeParse({
        message: 123,
      });
      expect(result.success).toBe(false);
    });
  });
});
