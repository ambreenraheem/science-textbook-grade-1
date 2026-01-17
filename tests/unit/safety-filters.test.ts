/**
 * Unit tests for safety filters
 * Tests the multi-layer safety filter system
 */

// Mock openai before importing safety-filters
jest.mock('../../src/lib/openai', () => ({
  openai: {
    moderations: {
      create: jest.fn().mockResolvedValue({
        results: [{ flagged: false }],
      }),
    },
  },
}));

import { preFilterInput, postFilterOutput } from '../../src/lib/safety-filters';

describe('Safety Filters', () => {
  describe('preFilterInput', () => {
    it('should accept valid science questions', () => {
      const result = preFilterInput('Why do plants need water?');
      expect(result.safe).toBe(true);
      expect(result.sanitizedInput).toBe('Why do plants need water?');
    });

    it('should accept questions about animals', () => {
      const result = preFilterInput('What do cats eat?');
      expect(result.safe).toBe(true);
    });

    it('should reject empty input', () => {
      const result = preFilterInput('');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('ask me a question');
    });

    it('should reject whitespace-only input', () => {
      const result = preFilterInput('   ');
      expect(result.safe).toBe(false);
    });

    it('should reject input exceeding 500 characters', () => {
      const longInput = 'a'.repeat(501);
      const result = preFilterInput(longInput);
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('too long');
    });

    it('should accept input at exactly 500 characters', () => {
      const exactInput = 'a'.repeat(500);
      const result = preFilterInput(exactInput);
      expect(result.safe).toBe(true);
    });

    it('should reject profanity - stupid', () => {
      const result = preFilterInput('This is stupid');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('kind words');
    });

    it('should reject profanity - hate', () => {
      const result = preFilterInput('I hate science');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('kind words');
    });

    it('should reject email addresses (PII)', () => {
      const result = preFilterInput('My email is test@example.com');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('personal information');
    });

    it('should reject phone numbers (PII)', () => {
      const result = preFilterInput('Call me at 555-123-4567');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('personal information');
    });

    it('should reject phone numbers with dots (PII)', () => {
      const result = preFilterInput('My number is 555.123.4567');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('personal information');
    });

    it('should reject zip codes (PII)', () => {
      const result = preFilterInput('I live in 12345');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('personal information');
    });

    it('should reject off-topic - homework', () => {
      const result = preFilterInput('Help me with my homework');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('science questions');
    });

    it('should reject off-topic - money', () => {
      const result = preFilterInput('How much does this cost?');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('science questions');
    });

    it('should reject off-topic - password', () => {
      const result = preFilterInput('What is your password?');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('science questions');
    });

    it('should trim whitespace from valid input', () => {
      const result = preFilterInput('  Why do birds fly?  ');
      expect(result.safe).toBe(true);
      expect(result.sanitizedInput).toBe('Why do birds fly?');
    });
  });

  describe('postFilterOutput', () => {
    it('should accept valid science responses', () => {
      const result = postFilterOutput('Plants need water to grow strong!');
      expect(result.safe).toBe(true);
      expect(result.sanitizedOutput).toBe('Plants need water to grow strong!');
    });

    it('should accept responses about animals', () => {
      const result = postFilterOutput('Dogs are friendly animals that live in homes.');
      expect(result.safe).toBe(true);
    });

    it('should reject empty responses', () => {
      const result = postFilterOutput('');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('Unable to generate');
    });

    it('should reject whitespace-only responses', () => {
      const result = postFilterOutput('   ');
      expect(result.safe).toBe(false);
    });

    it('should reject responses exceeding 500 characters', () => {
      const longResponse = 'Plants need water '.repeat(30); // ~540 chars
      const result = postFilterOutput(longResponse);
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('too long');
    });

    it('should reject responses with HTTP URLs', () => {
      const result = postFilterOutput('Visit http://example.com for more info');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('links');
    });

    it('should reject responses with HTTPS URLs', () => {
      const result = postFilterOutput('Check https://example.com for details');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('links');
    });

    it('should reject responses with click here', () => {
      const result = postFilterOutput('Click here to learn more about plants');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('links');
    });

    it('should reject responses with download instructions', () => {
      const result = postFilterOutput('Download this file to see more animals');
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('links');
    });

    it('should allow short responses without science keywords', () => {
      // Short responses (< 100 chars) are allowed even without keywords
      const result = postFilterOutput('That sounds interesting!');
      expect(result.safe).toBe(true);
    });

    it('should reject long off-topic responses', () => {
      // Long responses (> 100 chars) without science keywords are rejected
      const offTopic = 'This is a really long response about something completely unrelated that has nothing to do with science topics at all and just keeps going on and on.';
      const result = postFilterOutput(offTopic);
      expect(result.safe).toBe(false);
      expect(result.reason).toContain('science-related');
    });

    it('should trim whitespace from valid output', () => {
      const result = postFilterOutput('  Plants grow in soil.  ');
      expect(result.safe).toBe(true);
      expect(result.sanitizedOutput).toBe('Plants grow in soil.');
    });
  });
});
