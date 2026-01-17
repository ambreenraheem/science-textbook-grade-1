/**
 * POST /api/chat - AI Chatbot Endpoint
 *
 * Flow:
 * 1. Handle CORS preflight
 * 2. Validate request (method, body schema)
 * 3. Generate/validate sessionId
 * 4. Check session rate limit (max 10 messages)
 * 5. Run input through safety filter pipeline
 * 6. Call OpenAI with appropriate system prompt (en/ur)
 * 7. Run output through safety filter pipeline
 * 8. Log anonymized data to database
 * 9. Return response
 *
 * Constitution Compliance:
 * - Child Safety First: Multi-layer filtering
 * - 1-3 sentence responses: maxTokens=300
 * - No PII collection: Only hash and response length logged
 * - Rate limiting: 10 messages per session
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatMessageSchema } from '../lib/validation';
import { filterInputPipeline, filterOutputPipeline } from '../lib/safety-filters';
import { openai, CHATBOT_CONFIG, getSystemPrompt } from '../lib/openai';
import { prisma } from '../lib/prisma';
import {
  sendSuccess,
  sendError,
  handleApiError,
  handleCorsPreflightOptions,
  setCorsHeaders,
  ensureMethod,
} from '../lib/api-helpers';
import {
  generateSessionId,
  validateSessionId,
  getSessionMessageCount,
  hashQuery,
  SESSION_MESSAGE_LIMIT,
} from '../lib/session';
import { getChatMessages, type Locale } from '../lib/i18n';

/**
 * Main API handler for chatbot requests
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  // Set CORS headers
  setCorsHeaders(res);

  // Handle OPTIONS preflight
  if (handleCorsPreflightOptions(req, res)) {
    return;
  }

  // Ensure POST method
  if (!ensureMethod(req, res, ['POST'])) {
    return;
  }

  try {
    // 1. Validate request body
    const parseResult = ChatMessageSchema.safeParse(req.body);
    if (!parseResult.success) {
      sendError(res, 'VALIDATION_ERROR', 'Invalid request', 400);
      return;
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
      sendError(res, 'RATE_LIMIT_EXCEEDED', messages.errorRateLimit, 429);
      return;
    }

    // 4. Run input safety filter pipeline
    const inputFilter = await filterInputPipeline(message);
    if (!inputFilter.safe) {
      // Map filter reason to localized message
      const errorMessage = getLocalizedErrorMessage(inputFilter.reason, messages);
      sendError(res, 'SAFETY_FILTER', errorMessage, 400);
      return;
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
      sendSuccess(res, {
        response: messages.fallbackSafeResponse,
        sessionId,
        remaining: SESSION_MESSAGE_LIMIT - messageCount - 1,
      });
      return;
    }

    // 8. Log anonymized data to database
    await prisma.chatLog.create({
      data: {
        sessionId,
        safeQueryHash: hashQuery(inputFilter.sanitizedInput!),
        responseLength: outputFilter.sanitizedInput!.length,
      },
    });

    // 9. Return successful response
    sendSuccess(res, {
      response: outputFilter.sanitizedInput,
      sessionId,
      remaining: SESSION_MESSAGE_LIMIT - messageCount - 1,
    });
  } catch (error) {
    handleApiError(error, res);
  }
}

/**
 * Map filter reasons to localized error messages
 */
function getLocalizedErrorMessage(
  reason: string | undefined,
  messages: ReturnType<typeof getChatMessages>
): string {
  if (!reason) return messages.errorGeneric;

  // Match filter reasons to appropriate messages
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
