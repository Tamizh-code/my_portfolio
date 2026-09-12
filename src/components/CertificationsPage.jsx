import React, { useState, useMemo } from 'react';
import CertificateModal from './CertificateModal';

// Dynamically import all images from src/certificates directory using Vite import.meta.glob
const certificateModules = import.meta.glob('../certificates/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG}', {
  eager: true,
  import: 'default'
});

// Helper to deduce clean title and category from filename
function parseCertificateInfo(filepath, url) {
  const filename = filepath.split('/').pop();
  const cleanName = decodeURIComponent(filename);

  let title = cleanName;
  let category = 'Certification';
  let badgeColor = 'var(--accent1)';

  if (/^GCD-/i.test(cleanName)) {
    const numMatch = cleanName.match(/GCD-(\d+)/i);
    const num = numMatch ? numMatch[1] : '';
    title = `Google Cloud Arcade Skill Badge ${num ? '#' + num : ''}`;
    category = 'Google Cloud';
    badgeColor = '#4285F4';
  } else if (/aws/i.test(cleanName)) {
    title = 'AWS Cloud Practitioner Essentials';
    category = 'AWS Cloud';
    badgeColor = '#FF9900';
  } else if (/adobe/i.test(cleanName)) {
    title = 'Adobe Hackathon Achievement Certificate';
    category = 'Hackathons & Contests';
    badgeColor = '#FF0000';
  } else if (/cts|cognizant/i.test(cleanName)) {
    title = 'Cognizant (CTS) Hackathon Certificate';
    category = 'Hackathons & Contests';
    badgeColor = '#003366';
  } else if (/python/i.test(cleanName)) {
    title = 'Essential Python for Professionals Certification';
    category = 'Python Dev';
    badgeColor = '#3776AB';
  } else if (/java/i.test(cleanName)) {
    title = 'Programming in Java Certification';
    category = 'Java Dev';
    badgeColor = '#E76F51';
  } else if (/software_engineer/i.test(cleanName)) {
    title = 'Software Engineering Professional Certification';
    category = 'Software Engineering';
    badgeColor = '#10B981';
  } else {
    // Generically handle uuid or serial formatted certificate files (Infosys Springboard / Course certs)
    const indexStr = cleanName.replace(/_page.*$/, '').replace(/^[0-9]+-/, '');
    const shortId = indexStr.length > 12 ? indexStr.substring(0, 8) : indexStr;
    title = `Infosys Springboard Certification (${shortId.toUpperCase()})`;
    category = 'Infosys Springboard';
    badgeColor = '#6366F1';
  }

  return {
    id: filepath,
    filename,
    title,
    category,
    badgeColor,
    url
  };
}

export default function CertificationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCert, setActiveCert] = useState(null);

  // Process imported certificate list
  const certificates = useMemo(() => {
    return Object.entries(certificateModules).map(([path, url]) =>
      parseCertificateInfo(path, url)
    );
  }, []);

  const categories = ['All', 'Google Cloud', 'AWS Cloud', 'Java Dev', 'Python Dev', 'Infosys Springboard', 'Hackathons & Contests'];


  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchesCat = selectedCategory === 'All' || cert.category === selectedCategory;
      const matchesSearch =
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.filename.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [certificates, selectedCategory, searchQuery]);

  return (
    <section id="page-certifications" className="fade-in visible">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <span className="eyebrow">Verified Credentials</span>
          <h2 style={{ margin: '8px 0 4px 0', fontWeight: 800, fontSize: '28px' }}>
            Certifications & Achievements
          </h2>
          <p className="muted" style={{ margin: 0, fontSize: '15px' }}>
            Showing {filteredCertificates.length} of {certificates.length} verified certificates, skill badges, and awards.
          </p>
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              paddingLeft: '38px',
              borderRadius: '12px',
              border: '1px solid rgba(15, 23, 42, 0.12)',
              background: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-light)' }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px', scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              borderRadius: '999px'
            }}
          >
            {cat} {cat === 'All' ? `(${certificates.length})` : ''}
          </button>
        ))}
      </div>

      {/* Grid of Certificates */}
      {filteredCertificates.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
          <h3>No certificates found</h3>
          <p className="small" style={{ marginTop: '8px' }}>Try resetting your search query or selected category.</p>
          <button className="btn btn-ghost" style={{ marginTop: '12px' }} onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="card cert-card"
              onClick={() => setActiveCert(cert)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: '16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '180px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <img
                  src={cert.url}
                  alt={cert.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: cert.category === 'Google Cloud' ? 'contain' : 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  className="cert-img-preview"
                />
                <div className="cert-hover-overlay">
                  <span className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                    View Certificate 🔍
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <span
                  style={{
                    display: 'inline-block',
                    alignSelf: 'flex-start',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: cert.badgeColor,
                    background: `${cert.badgeColor}15`,
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {cert.category}
                </span>

                <h4 style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: 800, lineHeight: '1.3' }}>
                  {cert.title}
                </h4>

                <div className="muted small" style={{ marginTop: 'auto', paddingTop: '8px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Click to view full size</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <CertificateModal
        isOpen={!!activeCert}
        certificate={activeCert}
        onClose={() => setActiveCert(null)}
      />
    </section>
  );
}
