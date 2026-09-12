import React, { useEffect, useRef } from 'react';

export default function CertificateModal({ isOpen, onClose, certificate }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !certificate) return null;

  const handleBackdropClick = (e) => {
    if (e.target.id === 'cert-modal-backdrop') {
      onClose();
    }
  };

  return (
    <div
      id="cert-modal-backdrop"
      className="modal open"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="certModalTitle"
    >
      <div
        ref={dialogRef}
        className="dialog card"
        tabIndex="-1"
        style={{
          outline: 'none',
          maxWidth: '900px',
          width: '92%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 id="certModalTitle" style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>
              {certificate.title}
            </h3>
            {certificate.category && (
              <span className="eyebrow" style={{ marginTop: '6px', fontSize: '11px', padding: '4px 10px' }}>
                {certificate.category}
              </span>
            )}
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            style={{ position: 'static' }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(15, 23, 42, 0.03)', borderRadius: '12px', padding: '16px' }}>
          <img
            src={certificate.url}
            alt={certificate.title}
            style={{
              maxWidth: '100%',
              maxHeight: '65vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <span className="muted small">File: {certificate.filename}</span>
          <a
            href={certificate.url}
            download={certificate.filename}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Open / Download High Quality
          </a>
        </div>
      </div>
    </div>
  );
}
