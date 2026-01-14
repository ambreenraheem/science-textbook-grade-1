/**
 * ChatBot Component
 * AI-powered science tutor for Grade-1 students
 * Features:
 * - Multi-layer safety filtering
 * - Child-friendly interface
 * - Rate limiting (10 questions per session)
 * - Session-based (no PII tracking)
 */

import React, { useState, useRef, useEffect } from 'react';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatBotProps {
  /** Initial greeting message */
  greeting?: string;
  /** Maximum messages per session (default: 10) */
  maxMessages?: number;
  /** Callback when message limit reached */
  onLimitReached?: () => void;
}

/**
 * Interactive AI chatbot for answering science questions
 */
export default function ChatBot({
  greeting = "Hi! I'm your science helper! Ask me anything about animals, plants, or nature! 🌱",
  maxMessages = 10,
  onLimitReached,
}: ChatBotProps): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: greeting, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      // Call chatbot API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'Sorry, I couldn\'t understand that. Can you ask in a different way?',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);

      const errorMessage: Message = {
        role: 'assistant',
        content: 'Oops! Something went wrong. Please try asking your question again!',
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
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Science Helper</span>
        </div>
        <div style={{ fontSize: '0.9rem' }}>
          {remainingMessages} questions left
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
              <span className="loading-dots">Thinking</span>
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
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLimitReached ? 'Question limit reached' : 'Ask a science question...'}
          disabled={isLoading || isLimitReached}
          style={{
            flex: 1,
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '2px solid var(--ifm-color-emphasis-300)',
            outline: 'none',
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
          {isLoading ? '...' : 'Ask'}
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
          You've reached the question limit for this session. Great questions! Keep exploring the lessons! 🌟
        </div>
      )}
    </div>
  );
}
