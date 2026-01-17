/**
 * ChatBot Component
 * AI-powered science tutor for Grade-1 students
 * Features:
 * - Multi-layer safety filtering
 * - Child-friendly interface
 * - Rate limiting (10 questions per session)
 * - Session-based (no PII tracking)
 * - i18n support (English/Urdu)
 */

import React, { useState, useRef, useEffect } from 'react';
import { getChatMessages, type Locale } from '../lib/i18n';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatBotProps {
  /** Initial greeting message (overrides i18n default) */
  greeting?: string;
  /** Maximum messages per session (default: 10) */
  maxMessages?: number;
  /** Callback when message limit reached */
  onLimitReached?: () => void;
  /** Locale for messages - 'en' or 'ur' (default: 'en') */
  locale?: Locale;
}

/**
 * Interactive AI chatbot for answering science questions
 */
export default function ChatBot({
  greeting,
  maxMessages = 10,
  onLimitReached,
  locale = 'en',
}: ChatBotProps): JSX.Element {
  const messages_ = getChatMessages(locale);
  const initialGreeting = greeting || messages_.greeting;

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: initialGreeting, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine text direction based on locale
  const isRTL = locale === 'ur';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading || messageCount >= maxMessages) {
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setMessageCount((prev) => prev + 1);

    try {
      // Call chatbot API with locale and sessionId
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          locale,
          ...(sessionId && { sessionId }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to get response');
      }

      // Store sessionId from response for subsequent requests
      if (data.data?.sessionId) {
        setSessionId(data.data.sessionId);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.data?.response || messages_.fallbackSafeResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);

      const errorMessage: Message = {
        role: 'assistant',
        content: messages_.errorGeneric,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }

    // Check if limit reached
    if (messageCount + 1 >= maxMessages && onLimitReached) {
      onLimitReached();
    }
  };

  const remainingMessages = maxMessages - messageCount;
  const isLimitReached = messageCount >= maxMessages;

  return (
    <div
      className="chatbot-container"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '500px',
        borderRadius: '12px',
        border: '2px solid var(--ifm-color-primary-lighter)',
        backgroundColor: 'var(--ifm-background-surface-color)',
        overflow: 'hidden',
      }}
    >
      {/* Chat header */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: 'var(--ifm-color-primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            {messages_.uiTitle}
          </span>
        </div>
        <div style={{ fontSize: '0.9rem' }}>
          {remainingMessages} {messages_.uiQuestionsLeft}
        </div>
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                backgroundColor:
                  message.role === 'user'
                    ? 'var(--ifm-color-primary)'
                    : 'var(--ifm-color-primary-lightest)',
                color: message.role === 'user' ? 'white' : 'var(--ifm-font-color-base)',
                fontSize: '1rem',
                lineHeight: '1.5',
                textAlign: isRTL ? 'right' : 'left',
              }}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                backgroundColor: 'var(--ifm-color-primary-lightest)',
                fontSize: '1rem',
              }}
            >
              <span className="loading-dots">{messages_.uiThinking}</span>
              <style>{`
                .loading-dots::after {
                  content: '...';
                  animation: dots 1.5s steps(4, end) infinite;
                }
                @keyframes dots {
                  0%, 20% { content: '.'; }
                  40% { content: '..'; }
                  60%, 100% { content: '...'; }
                }
              `}</style>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '1rem',
          borderTop: '1px solid var(--ifm-color-emphasis-300)',
          display: 'flex',
          gap: '0.5rem',
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isLimitReached ? messages_.uiPlaceholderLimitReached : messages_.uiPlaceholder
          }
          disabled={isLoading || isLimitReached}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{
            flex: 1,
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '2px solid var(--ifm-color-emphasis-300)',
            outline: 'none',
            textAlign: isRTL ? 'right' : 'left',
          }}
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || isLimitReached}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            border: 'none',
            backgroundColor:
              !input.trim() || isLoading || isLimitReached
                ? '#ddd'
                : 'var(--ifm-color-primary)',
            color: !input.trim() || isLoading || isLimitReached ? '#999' : 'white',
            cursor:
              !input.trim() || isLoading || isLimitReached ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? '...' : messages_.uiSendButton}
        </button>
      </form>

      {/* Limit reached message */}
      {isLimitReached && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fff3e0',
            borderTop: '1px solid #ff9800',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'var(--ifm-color-emphasis-900)',
          }}
        >
          {messages_.uiLimitReachedMessage}
        </div>
      )}
    </div>
  );
}
