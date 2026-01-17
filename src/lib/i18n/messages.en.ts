/**
 * English messages for chatbot
 * Used for UI strings and error messages
 */

export interface ChatMessages {
  greeting: string;
  errorGeneric: string;
  errorRateLimit: string;
  errorSafetyInput: string;
  errorSafetyPII: string;
  errorOffTopic: string;
  errorUnsafe: string;
  errorEmpty: string;
  errorTooLong: string;
  fallbackUncertain: string;
  fallbackOffTopic: string;
  fallbackSafeResponse: string;
  uiTitle: string;
  uiQuestionsLeft: string;
  uiPlaceholder: string;
  uiPlaceholderLimitReached: string;
  uiSendButton: string;
  uiThinking: string;
  uiLimitReachedMessage: string;
}

export const CHAT_MESSAGES_EN: ChatMessages = {
  // Greetings
  greeting: "Hi! I'm your science helper! Ask me anything about animals, plants, or nature!",

  // Error messages
  errorGeneric: "Oops! Something went wrong. Please try asking your question again!",
  errorRateLimit: "You've reached the question limit for this session. Great questions! Keep exploring the lessons!",
  errorSafetyInput: "Please use kind words when asking questions.",
  errorSafetyPII: "Please don't share personal information like emails or phone numbers.",
  errorOffTopic: "I can only help with science questions about animals, plants, and nature!",
  errorUnsafe: "I can't answer that. Let's talk about science instead!",
  errorEmpty: "Please ask me a question!",
  errorTooLong: "Your question is too long. Please make it shorter!",

  // Fallback responses
  fallbackUncertain: "I'm not sure about that, but we can learn together!",
  fallbackOffTopic: "That's a great question! But I can only help with science topics like animals, plants, and the Earth. Can you ask me a science question?",
  fallbackSafeResponse: "I'm not sure about that. Can you ask in a different way?",

  // UI strings
  uiTitle: "Science Helper",
  uiQuestionsLeft: "questions left",
  uiPlaceholder: "Ask a science question...",
  uiPlaceholderLimitReached: "Question limit reached",
  uiSendButton: "Ask",
  uiThinking: "Thinking",
  uiLimitReachedMessage: "You've reached the question limit for this session. Great questions! Keep exploring the lessons!",
};

export default CHAT_MESSAGES_EN;
