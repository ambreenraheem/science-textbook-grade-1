/**
 * Express API Server for Science Textbook Chatbot
 * Runs alongside Docusaurus to handle /api/chat requests
 */

// Load environment variables first
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { ChatMessageSchema } from './src/lib/validation';
import { filterInputPipeline, filterOutputPipeline } from './src/lib/safety-filters';
import { openai, CHATBOT_CONFIG, getSystemPrompt } from './src/lib/openai';
import { prisma } from './src/lib/prisma';
import {
  generateSessionId,
  validateSessionId,
  hashQuery,
  SESSION_MESSAGE_LIMIT,
} from './src/lib/session';
import { getChatMessages, type Locale } from './src/lib/i18n';

const app = express();
const PORT = process.env.API_PORT || 3001;

// In-memory session tracking (for when database is unavailable)
const sessionCounts = new Map<string, number>();

/**
 * Get session message count (in-memory fallback)
 */
async function getSessionMessageCount(sessionId: string): Promise<number> {
  // Try database first
  try {
    const count = await prisma.chatLog.count({ where: { sessionId } });
    return count;
  } catch {
    // Fallback to in-memory tracking
    return sessionCounts.get(sessionId) || 0;
  }
}

/**
 * Log chat message (with database fallback)
 */
async function logChatMessage(sessionId: string, queryHash: string, responseLength: number): Promise<void> {
  try {
    await prisma.chatLog.create({
      data: {
        sessionId,
        safeQueryHash: queryHash,
        responseLength,
      },
    });
  } catch {
    // Fallback to in-memory tracking
    const current = sessionCounts.get(sessionId) || 0;
    sessionCounts.set(sessionId, current + 1);
  }
}

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json());

/**
 * Map filter reasons to localized error messages
 */
function getLocalizedErrorMessage(
  reason: string | undefined,
  messages: ReturnType<typeof getChatMessages>
): string {
  if (!reason) return messages.errorGeneric;

  if (reason.includes('kind words')) {
    return messages.errorSafetyInput;
  }
  if (reason.includes('personal information')) {
    return messages.errorSafetyPII;
  }
  if (reason.includes('science questions')) {
    return messages.errorOffTopic;
  }
  if (reason.includes('ask me a question') || reason.includes('empty')) {
    return messages.errorEmpty;
  }
  if (reason.includes('too long')) {
    return messages.errorTooLong;
  }
  if (reason.includes('appropriate') || reason.includes('unsafe')) {
    return messages.errorUnsafe;
  }

  return messages.errorGeneric;
}

/**
 * POST /api/chat - AI Chatbot Endpoint
 */
app.post('/api/chat', async (req, res) => {
  try {
    // 1. Validate request body
    const parseResult = ChatMessageSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid request' },
      });
    }

    const { message, sessionId: providedSessionId, locale = 'en' } = parseResult.data;
    const messages = getChatMessages(locale as Locale);

    // 2. Session management
    const sessionId =
      providedSessionId && validateSessionId(providedSessionId)
        ? providedSessionId
        : generateSessionId();

    // 3. Check rate limit (10 messages per session)
    const messageCount = await getSessionMessageCount(sessionId);
    if (messageCount >= SESSION_MESSAGE_LIMIT) {
      return res.status(429).json({
        success: false,
        error: { code: 'RATE_LIMIT_EXCEEDED', message: messages.errorRateLimit },
      });
    }

    // 4. Run input safety filter pipeline
    const inputFilter = await filterInputPipeline(message);
    if (!inputFilter.safe) {
      const errorMessage = getLocalizedErrorMessage(inputFilter.reason, messages);
      return res.status(400).json({
        success: false,
        error: { code: 'SAFETY_FILTER', message: errorMessage },
      });
    }

    // 5. Select system prompt based on locale
    const systemPrompt = getSystemPrompt(locale as 'en' | 'ur');

    // 6. Call OpenAI
    const completion = await openai.chat.completions.create({
      model: CHATBOT_CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: inputFilter.sanitizedInput! },
      ],
      temperature: CHATBOT_CONFIG.temperature,
      max_tokens: CHATBOT_CONFIG.maxTokens,
      top_p: CHATBOT_CONFIG.topP,
    });

    const aiResponse = completion.choices[0]?.message?.content || '';

    // 7. Run output safety filter pipeline
    const outputFilter = await filterOutputPipeline(aiResponse);
    if (!outputFilter.safe) {
      // Return safe fallback response instead of blocking
      return res.json({
        success: true,
        data: {
          response: messages.fallbackSafeResponse,
          sessionId,
          remaining: SESSION_MESSAGE_LIMIT - messageCount - 1,
        },
      });
    }

    // 8. Log anonymized data (database or in-memory)
    await logChatMessage(
      sessionId,
      hashQuery(inputFilter.sanitizedInput!),
      outputFilter.sanitizedInput!.length
    );

    // 9. Return successful response
    return res.json({
      success: true,
      data: {
        response: outputFilter.sanitizedInput,
        sessionId,
        remaining: SESSION_MESSAGE_LIMIT - messageCount - 1,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Something went wrong. Please try again.' },
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
