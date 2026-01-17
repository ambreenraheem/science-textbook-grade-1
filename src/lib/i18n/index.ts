/**
 * i18n exports for chatbot messages
 * Supports English (en) and Urdu (ur) locales
 */

import { CHAT_MESSAGES_EN, type ChatMessages } from './messages.en';
import { CHAT_MESSAGES_UR } from './messages.ur';

export type Locale = 'en' | 'ur';

const messages: Record<Locale, ChatMessages> = {
  en: CHAT_MESSAGES_EN,
  ur: CHAT_MESSAGES_UR,
};

/**
 * Get chat messages for a specific locale
 * Falls back to English if locale not found
 * @param locale - 'en' or 'ur'
 * @returns Localized message object
 */
export function getChatMessages(locale: Locale = 'en'): ChatMessages {
  return messages[locale] || messages.en;
}

/**
 * Check if a locale is supported
 * @param locale - Locale string to check
 * @returns true if locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return locale === 'en' || locale === 'ur';
}

export { CHAT_MESSAGES_EN, CHAT_MESSAGES_UR };
export type { ChatMessages };
