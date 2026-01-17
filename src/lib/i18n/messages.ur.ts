/**
 * Urdu messages for chatbot (اردو)
 * Direction: RTL (Right-to-Left)
 * Used for UI strings and error messages
 */

import type { ChatMessages } from './messages.en';

export const CHAT_MESSAGES_UR: ChatMessages = {
  // سلام - Greetings
  greeting: "سلام! میں آپ کا سائنس مددگار ہوں! جانوروں، پودوں، یا فطرت کے بارے میں کچھ بھی پوچھیں!",

  // خرابی کے پیغامات - Error messages
  errorGeneric: "افوہ! کچھ غلط ہو گیا۔ براہ کرم دوبارہ سوال پوچھیں!",
  errorRateLimit: "آپ نے اس سیشن کے سوالات کی حد تک پہنچ گئے۔ بہترین سوالات! اسباق دیکھتے رہیں!",
  errorSafetyInput: "براہ کرم سوالات پوچھتے وقت اچھے الفاظ استعمال کریں۔",
  errorSafetyPII: "براہ کرم ذاتی معلومات جیسے ای میل یا فون نمبر شیئر نہ کریں۔",
  errorOffTopic: "میں صرف جانوروں، پودوں، اور فطرت کے بارے میں سائنس کے سوالات میں مدد کر سکتا ہوں!",
  errorUnsafe: "میں اس کا جواب نہیں دے سکتا۔ آئیے سائنس کے بارے میں بات کریں!",
  errorEmpty: "براہ کرم مجھ سے سوال پوچھیں!",
  errorTooLong: "آپ کا سوال بہت لمبا ہے۔ براہ کرم اسے چھوٹا کریں!",

  // متبادل جوابات - Fallback responses
  fallbackUncertain: "مجھے اس کے بارے میں یقین نہیں ہے، لیکن ہم مل کر سیکھ سکتے ہیں!",
  fallbackOffTopic: "یہ ایک اچھا سوال ہے! لیکن میں صرف جانوروں، پودوں، اور زمین جیسے سائنس کے موضوعات میں مدد کر سکتا ہوں۔ کیا آپ مجھ سے سائنس کا سوال پوچھ سکتے ہیں؟",
  fallbackSafeResponse: "مجھے یہ سمجھ نہیں آیا۔ کیا آپ مختلف طریقے سے پوچھ سکتے ہیں؟",

  // یوزر انٹرفیس - UI strings
  uiTitle: "سائنس مددگار",
  uiQuestionsLeft: "سوالات باقی ہیں",
  uiPlaceholder: "سائنس کا سوال پوچھیں...",
  uiPlaceholderLimitReached: "سوالات کی حد ختم",
  uiSendButton: "پوچھیں",
  uiThinking: "سوچ رہا ہوں",
  uiLimitReachedMessage: "آپ نے اس سیشن کے سوالات کی حد تک پہنچ گئے۔ بہترین سوالات! اسباق دیکھتے رہیں!",
};

export default CHAT_MESSAGES_UR;
