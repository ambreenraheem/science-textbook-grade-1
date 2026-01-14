/**
 * ProgressTracker Component
 * Displays student's learning progress across topics and lessons
 * Shows visual indicators (checkmarks, progress bars, stars)
 */

import React from 'react';

export interface LessonProgress {
  lessonId: string;
  lessonTitle: string;
  completed: boolean;
  score: number | null;
}

export interface TopicProgress {
  topicId: string;
  topicTitle: string;
  lessons: LessonProgress[];
}

export interface ProgressTrackerProps {
  /** Student's progress data */
  progress: TopicProgress[];
  /** Display mode: 'compact' | 'detailed' */
  mode?: 'compact' | 'detailed';
}

/**
 * Visual progress tracker for student dashboard
 */
export default function ProgressTracker({
  progress,
  mode = 'detailed',
}: ProgressTrackerProps): JSX.Element {
  // Calculate overall statistics
  const totalLessons = progress.reduce((sum, topic) => sum + topic.lessons.length, 0);
  const completedLessons = progress.reduce(
    (sum, topic) => sum + topic.lessons.filter((l) => l.completed).length,
    0
  );
  const overallPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Compact mode: Just overall progress
  if (mode === 'compact') {
    return (
      <div
        className="progress-tracker-compact"
        style={{
          padding: '1rem',
          borderRadius: '8px',
          backgroundColor: 'var(--ifm-color-primary-lightest)',
          border: '2px solid var(--ifm-color-primary-lighter)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Learning Progress</h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>
              {completedLessons} of {totalLessons} lessons completed
            </p>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
            {overallPercentage}%
          </div>
        </div>
        <div
          style={{
            marginTop: '0.75rem',
            height: '12px',
            borderRadius: '6px',
            backgroundColor: '#e0e0e0',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${overallPercentage}%`,
              backgroundColor: 'var(--ifm-color-primary)',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>
    );
  }

  // Detailed mode: Show all topics and lessons
  return (
    <div className="progress-tracker-detailed">
      {/* Overall progress summary */}
      <div
        style={{
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          textAlign: 'center',
          backgroundColor: 'var(--ifm-color-primary-lightest)',
          border: '2px solid var(--ifm-color-primary-lighter)',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Your Learning Journey</h3>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
          {overallPercentage}%
        </div>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>
          {completedLessons} of {totalLessons} lessons completed
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', fontSize: '2rem' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < Math.floor(overallPercentage / 20) ? '⭐' : '☆'}</span>
          ))}
        </div>
      </div>

      {/* Topic-by-topic breakdown */}
      {progress.map((topic) => {
        const topicCompleted = topic.lessons.filter((l) => l.completed).length;
        const topicTotal = topic.lessons.length;
        const topicPercentage = Math.round((topicCompleted / topicTotal) * 100);

        return (
          <div
            key={topic.topicId}
            style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '2px solid #e0e0e0',
              backgroundColor: 'var(--ifm-background-surface-color)',
            }}
          >
            {/* Topic header */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0, fontSize: '1.3rem' }}>{topic.topicTitle}</h4>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--ifm-color-primary)' }}>
                  {topicPercentage}%
                </span>
              </div>
              <div
                style={{
                  marginTop: '0.5rem',
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: '#e0e0e0',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${topicPercentage}%`,
                    backgroundColor: 'var(--ifm-color-primary)',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>

            {/* Lesson list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {topic.lessons.map((lesson) => (
                <div
                  key={lesson.lessonId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: lesson.completed ? '#e8f5e9' : '#f5f5f5',
                    border: `2px solid ${lesson.completed ? '#4caf50' : '#e0e0e0'}`,
                  }}
                >
                  <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>
                    {lesson.completed ? '✅' : '⬜'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1rem', fontWeight: lesson.completed ? '600' : '400' }}>
                      {lesson.lessonTitle}
                    </div>
                    {lesson.completed && lesson.score !== null && (
                      <div style={{ fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)', marginTop: '0.25rem' }}>
                        Score: {lesson.score}%
                      </div>
                    )}
                  </div>
                  {lesson.completed && lesson.score !== null && lesson.score >= 90 && (
                    <span style={{ fontSize: '1.5rem' }}>⭐</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Encouragement message */}
      {overallPercentage === 100 && (
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            backgroundColor: '#fff3e0',
            border: '2px solid #ff9800',
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>🎉 Amazing work!</h3>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>
            You've completed all lessons! You're a science superstar! 🌟
          </p>
        </div>
      )}
    </div>
  );
}
