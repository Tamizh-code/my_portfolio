import React, { useEffect, useRef, useState } from 'react';

export default function ProjectModal({ isOpen, onClose, project }) {
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);
  const [readmeHtml, setReadmeHtml] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      if (dialogRef.current) {
        dialogRef.current.focus();
      }

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
    }
  }, [isOpen, onClose]);

  // Fetch README from GitHub when project changes
  useEffect(() => {
    if (!isOpen || !project) return;

    // 1) Use pre-defined readmeContent if available (curated private project config)
    if (project.readmeContent) {
      setReadmeHtml(project.readmeContent);
      setIsLoading(false);
      return;
    }

    // 2) Fetch README dynamically from GitHub API
    if (project.name) {
      setIsLoading(true);
      setReadmeHtml(null);

      const headers = {
        Accept: 'application/vnd.github.html'
      };

      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const repoOwner = project.owner || 'Tamizh-code';
      fetch(`https://api.github.com/repos/${repoOwner}/${project.name}/readme`, { headers })
        .then((res) => {
          if (!res.ok) throw new Error('README not found');
          return res.text();
        })
        .then((html) => {
          setReadmeHtml(html);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching readme:', err);
          setReadmeHtml(null);
          setIsLoading(false);
        });
    } else {
      setReadmeHtml(null);
      setIsLoading(false);
    }
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  const handleBackdropClick = (e) => {
    if (e.target.id === 'modal-backdrop') {
      onClose();
    }
  };

  return (
    <div
      id="modal-backdrop"
      className="modal open"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div
        ref={dialogRef}
        className="dialog card"
        tabIndex="-1"
        style={{ 
          outline: 'none', 
          maxWidth: '680px', 
          width: '90%', 
          maxHeight: '85vh', 
          display: 'flex', 
          flexDirection: 'column',
          padding: '24px'
        }}
      >
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close project dialog"
        >
          ×
        </button>
        <div style={{ overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h3 id="modalTitle" style={{ margin: '0', fontSize: '22px', fontWeight: 800 }}>
              {project.title}
            </h3>
            {project.isPrivate && (
              <span className="tag" style={{ fontSize: '11px', padding: '3px 10px', background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                🔒 Private Repository
              </span>
            )}
          </div>
          
          {isLoading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted-light)' }}>
              <div className="spinner" style={{ 
                display: 'inline-block', 
                width: '32px', 
                height: '32px', 
                border: '3px solid rgba(79, 70, 229, 0.1)', 
                borderTopColor: 'var(--accent1)', 
                borderRadius: '50%', 
                animation: 'spin 0.8s linear infinite', 
                marginBottom: '12px' 
              }}></div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--muted)' }}>Retrieving repository README...</div>
            </div>
          ) : readmeHtml ? (
            <div className="readme-content muted" dangerouslySetInnerHTML={{ __html: readmeHtml }} />
          ) : (
            <p id="modalBody" className="muted" style={{ margin: '0', lineHeight: '1.5', fontSize: '15px' }}>
              {project.body}
            </p>
          )}
          
          {project.tags && project.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {project.htmlUrl && (
            <div style={{ marginTop: '12px' }}>
              <a
                href={project.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                View on GitHub
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
