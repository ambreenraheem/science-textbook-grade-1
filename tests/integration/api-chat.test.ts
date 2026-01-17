/**
 * Integration tests for POST /api/chat endpoint
 * Uses manual mocks instead of node-mocks-http
 */

import type { NextApiRequest, NextApiResponse } from 'next';

// Mock dependencies before importing handler
jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    chatLog: {
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('../../src/lib/openai', () => ({
  openai: {
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Plants need water to grow strong!' } }],
        }),
      },
    },
    moderations: {
      create: jest.fn().mockResolvedValue({
        results: [{ flagged: false }],
      }),
    },
  },
  CHATBOT_CONFIG: {
    model: 'gpt-4-mini',
    temperature: 0.7,
    maxTokens: 300,
    topP: 0.9,
  },
  SYSTEM_PROMPT: 'Test system prompt',
  SYSTEM_PROMPT_UR: 'Test system prompt ur',
  getSystemPrompt: jest.fn((locale: string) =>
    locale === 'ur' ? 'Test system prompt ur' : 'Test system prompt'
  ),
}));

import handler from '../../src/api/chat';
import { prisma } from '../../src/lib/prisma';

// Helper to create mock request/response
function createMockReqRes(options: {
  method?: string;
  body?: any;
}) {
  const headers: Record<string, string> = {};
  const req = {
    method: options.method || 'POST',
    body: options.body || {},
  } as NextApiRequest;

  let statusCode = 200;
  let responseData = '';

  const res = {
    status: function(code: number) {
      statusCode = code;
      return this;
    },
    json: function(data: any) {
      responseData = JSON.stringify(data);
      return this;
    },
    end: function() {
      return this;
    },
    setHeader: function(name: string, value: string) {
      headers[name] = value;
      return this;
    },
    getHeader: function(name: string) {
      return headers[name];
    },
    _getStatusCode: () => statusCode,
    _getData: () => responseData,
    _getHeaders: () => headers,
  } as unknown as NextApiResponse & {
    _getStatusCode: () => number;
    _getData: () => string;
    _getHeaders: () => Record<string, string>;
  };

  return { req, res };
}

describe('POST /api/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.chatLog.count as jest.Mock).mockResolvedValue(0);
    (prisma.chatLog.create as jest.Mock).mockResolvedValue({});
  });

  it('should return successful response for valid science question', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        message: 'Why do plants need water?',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.data.response).toBeTruthy();
    expect(data.data.sessionId).toBeTruthy();
    expect(data.data.remaining).toBe(9);
  });

  it('should return 405 for GET method', async () => {
    const { req, res } = createMockReqRes({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('METHOD_NOT_ALLOWED');
  });

  it('should return 400 for empty request body', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 429 when session limit reached', async () => {
    (prisma.chatLog.count as jest.Mock).mockResolvedValue(10);

    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        message: 'Test question',
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(429);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('RATE_LIMIT_EXCEEDED');
  });

  it('should accept valid sessionId', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        message: 'Why do birds fly?',
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.data.sessionId).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  it('should generate new sessionId if not provided', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        message: 'What do animals eat?',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.data.sessionId).toBeTruthy();
    expect(data.data.sessionId.length).toBe(36);
  });

  it('should accept locale en', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        message: 'Why is the sky blue?',
        locale: 'en',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });

  it('should accept locale ur', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        message: 'پودوں کو پانی کی ضرورت کیوں ہے؟',
        locale: 'ur',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });

  it('should log anonymized data on successful response', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        message: 'Why do birds fly?',
      },
    });

    await handler(req, res);

    expect(prisma.chatLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        safeQueryHash: expect.any(String),
        responseLength: expect.any(Number),
        sessionId: expect.any(String),
      }),
    });

    // Verify hash is 64 characters (SHA-256)
    const callArgs = (prisma.chatLog.create as jest.Mock).mock.calls[0][0];
    expect(callArgs.data.safeQueryHash.length).toBe(64);
  });

  it('should block profanity input', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        message: 'This is stupid',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.error.code).toBe('SAFETY_FILTER');
  });

  it('should block PII - email', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        message: 'My email is test@example.com',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.error.code).toBe('SAFETY_FILTER');
  });

  it('should handle OPTIONS request for CORS', async () => {
    const { req, res } = createMockReqRes({
      method: 'OPTIONS',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()['Access-Control-Allow-Origin']).toBe('*');
  });

  it('should set CORS headers on successful response', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        message: 'Why do plants grow?',
      },
    });

    await handler(req, res);

    expect(res._getHeaders()['Access-Control-Allow-Origin']).toBe('*');
  });

  it('should return remaining message count', async () => {
    (prisma.chatLog.count as jest.Mock).mockResolvedValue(5);

    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        message: 'Why do animals need water?',
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.data.remaining).toBe(4); // 10 - 5 - 1 = 4
  });
});
