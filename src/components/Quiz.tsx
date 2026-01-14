/**
 * Quiz Component
 * Interactive multiple-choice quiz for Grade-1 students
 * Tracks scores and updates progress when passing (≥70%)
 */

import React, { useState } from 'react';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-based)
  explanation?: string; // Optional explanation after answering
}

export interface QuizProps {
  /** Quiz questions array */
  questions: QuizQuestion[];
  /** Lesson ID for progress tracking */
  lessonId?: string;
  /** Callback when quiz is completed */
  onComplete?: (score: number) => void;
}

/**
 * Interactive quiz component with immediate feedback
 */
export default function Quiz({ questions, lessonId, onComplete }: QuizProps): JSX.Element {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isCorrect = selectedAnswer === question.correctAnswer;
  const percentageScore = Math.round((score / questions.length) * 100);

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return; // Prevent changing answer after submission
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    setShowFeedback(true);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setQuizComplete(true);
      if (onComplete) {
        onComplete(percentageScore);
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setQuizComplete(false);
  };

  // Quiz completion screen
  if (quizComplete) {
    const passed = percentageScore >= 70;

    return (
      <div
        className="quiz-complete"
        style={{
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center',
          backgroundColor: passed ? '#e8f5e9' : '#fff3e0',
          border: `2px solid ${passed ? '#4caf50' : '#ff9800'}`,
        }}
      >
        <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
          {passed ? '🎉 Great job!' : '📚 Keep learning!'}
        </h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>
          Your score: {score}/{questions.length} ({percentageScore}%)
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          {passed
            ? 'You did an excellent job! You can move on to the next lesson.'
            : 'You need 70% to complete this lesson. Try again to learn more!'}
        </p>
        <button
          onClick={handleRetry}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--ifm-color-primary)',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {passed ? 'Try Again for Fun' : 'Try Again'}
        </button>
      </div>
    );
  }

  // Quiz question screen
  return (
    <div
      className="quiz-container"
      style={{
        padding: '1.5rem',
        borderRadius: '12px',
        border: '2px solid var(--ifm-color-primary-lighter)',
        backgroundColor: 'var(--ifm-background-surface-color)',
        margin: '2rem 0',
      }}
    >
      {/* Progress indicator */}
      <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)' }}>
        Question {currentQuestion + 1} of {questions.length}
      </div>

      {/* Question */}
      <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>{question.question}</h3>

      {/* Answer options */}
      <div style={{ marginBottom: '1.5rem' }}>
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === question.correctAnswer;
          const showCorrect = showFeedback && isCorrectOption;
          const showIncorrect = showFeedback && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showFeedback}
              style={{
                display: 'block',
                width: '100%',
                padding: '1rem',
                marginBottom: '0.75rem',
                fontSize: '1.1rem',
                textAlign: 'left',
                borderRadius: '8px',
                border: `2px solid ${
                  showCorrect
                    ? '#4caf50'
                    : showIncorrect
                    ? '#f44336'
                    : isSelected
                    ? 'var(--ifm-color-primary)'
                    : '#ddd'
                }`,
                backgroundColor: showCorrect
                  ? '#e8f5e9'
                  : showIncorrect
                  ? '#ffebee'
                  : isSelected
                  ? 'var(--ifm-color-primary-lightest)'
                  : 'white',
                cursor: showFeedback ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {option}
              {showCorrect && ' ✓'}
              {showIncorrect && ' ✗'}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            backgroundColor: isCorrect ? '#e8f5e9' : '#fff3e0',
            border: `2px solid ${isCorrect ? '#4caf50' : '#ff9800'}`,
          }}
        >
          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
            {isCorrect ? '✓ Correct!' : '✗ Not quite right.'}
          </p>
          {question.explanation && (
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem' }}>{question.explanation}</p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              border: 'none',
              backgroundColor:
                selectedAnswer === null ? '#ddd' : 'var(--ifm-color-primary)',
              color: selectedAnswer === null ? '#999' : 'white',
              cursor: selectedAnswer === null ? 'not-allowed' : 'pointer',
            }}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--ifm-color-primary)',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
}
