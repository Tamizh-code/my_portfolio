import React, { useRef, useEffect } from 'react';

export default function ProjectCard({ id, title, description, tags, isPrivate, onClick, enableTilt = true, className = '' }) {
  const cardRef = useRef(null);
  let rect = null;

  const handleMouseMove = (e) => {
    if (!enableTilt) return;
    const card = cardRef.current;
    if (!card) return;

    // Respect reduced motion & touch devices
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    if (!rect) {
      rect = card.getBoundingClientRect();
    }

    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 12;
    const rotateX = (0.5 - py) * 10;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = '';
    }
    rect = null;
  };

  useEffect(() => {
    const handleResize = () => {
      rect = null;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className={`project ${className}`}
      data-id={id}
      data-tilt={enableTilt ? "" : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, flex: 1 }}>{title}</h4>
        {isPrivate && (
          <span className="tag" style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af', border: '1px solid rgba(244, 63, 94, 0.3)', whiteSpace: 'nowrap' }}>
            🔒 Private
          </span>
        )}
      </div>
      <div className="muted small">{description}</div>
      {tags && tags.length > 0 && (
        <div className="tags">
          {tags.map((tag) => (
            <div key={tag} className="tag">
              {tag}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
