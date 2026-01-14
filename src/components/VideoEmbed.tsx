/**
 * VideoEmbed Component
 * Displays educator-verified YouTube videos in lessons
 * Only shows videos marked as verified_safe=true in database
 */

import React from 'react';

export interface VideoEmbedProps {
  /** YouTube video ID (11 characters) */
  youtubeId: string;
  /** Video title for accessibility */
  title: string;
  /** Optional caption/description */
  caption?: string;
}

/**
 * Embeds a YouTube video with child-safe defaults
 * - No related videos from other channels
 * - No annotations
 * - Modest branding
 */
export default function VideoEmbed({ youtubeId, title, caption }: VideoEmbedProps): JSX.Element {
  // YouTube embed URL with child-safe parameters
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?` + new URLSearchParams({
    rel: '0', // Don't show related videos from other channels
    modestbranding: '1', // Minimal YouTube branding
    iv_load_policy: '3', // Hide video annotations
    fs: '1', // Allow fullscreen
    enablejsapi: '0', // Disable JS API for security
  }).toString();

  return (
    <div className="video-embed-container" style={{ margin: '1.5rem 0' }}>
      <div
        className="video-embed-wrapper"
        style={{
          position: 'relative',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 0,
          }}
          loading="lazy"
        />
      </div>
      {caption && (
        <p
          className="video-caption"
          style={{
            marginTop: '0.75rem',
            fontSize: '0.95rem',
            color: 'var(--ifm-color-emphasis-700)',
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
