import React, { useState, useEffect, useRef } from 'react';
import ParticlesBg from './components/ParticlesBg';
import Typewriter from './components/Typewriter';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import ContactForm from './components/ContactForm';

const localFallbackProjects = [
  {
    id: 'p1',
    title: 'Tourism Management System (TMS)',
    body: 'Built a comprehensive Tourism Management System that allows users to explore destinations, plan trips, and manage travel details in a smooth workflow.',
    tags: ['Java', 'Spring Boot', 'React.js', 'MySQL', 'REST API']
  },
  {
    id: 'p2',
    title: 'Application Management System (AMS)',
    body: 'Developed an Application Management System with an authorization workflow, enabling users to submit requests, track approval status, and receive notifications.',
    tags: ['Spring Boot', 'Java', 'React.js', 'MySQL', 'REST APIs', 'CRUD']
  },
  {
    id: 'p3',
    title: 'Hotel Management System Backend',
    body: 'Developed a Hotel Management System to streamline room bookings, customer record management, billing, and room availability tracking through an efficient MVC workflow.',
    tags: ['Java', 'Spring Boot', 'MySQL', 'MVC Architecture']
  }
];

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [name, setName] = useState('Tamizh Mani V');
  const [logo, setLogo] = useState('TM');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(localFallbackProjects);

  const dotsRef = useRef([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const dotCoords = useRef([
    { x: -100, y: -100 },
    { x: -100, y: -100 },
    { x: -100, y: -100 },
    { x: -100, y: -100 }
  ]);

  // 1) Hash-based Routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentRoute(hash);
      setIsMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHash);
    handleHash(); // initial trigger

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // 2) URL Name Param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name');
    if (nameParam) {
      setName(nameParam);
      const initials = nameParam
        .split(' ')
        .map((s) => s[0])
        .slice(0, 2)
        .join('');
      setLogo(initials.toUpperCase());
    }
  }, []);

  // 3) Keyboard Shortcut (Press 'P' to open projects)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key.toLowerCase() === 'p') {
        window.location.hash = '#/projects';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 4) Dynamic GitHub Projects Fetching
  useEffect(() => {
    fetch('https://api.github.com/users/Tamizh-code/repos?sort=updated&per_page=15')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch repositories');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data
            .filter((repo) => !repo.fork)
            .map((repo) => ({
              id: String(repo.id),
              title: repo.name
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase()),
              body: repo.description || 'A public repository on GitHub.',
              tags: [repo.language, ...(repo.topics || [])].filter(Boolean),
              htmlUrl: repo.html_url,
              name: repo.name
            }));
          if (formatted.length > 0) {
            setProjects(formatted);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching GitHub repos, using fallback projects:', err);
      });
  }, []);

  // 5) Reveal / Fade-in on Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll('.fade-in, .project, .card');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [currentRoute]);

  // 6) Body nav open helper class
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('nav-open');
    } else {
      document.body.classList.remove('nav-open');
    }
  }, [isMenuOpen]);

  // 7) Gemini / Google Custom Dots Cursor Follower
  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, input, textarea, .project');
      if (target) {
        document.body.classList.add('cursor-hover');
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, input, textarea, .project');
      if (target) {
        document.body.classList.remove('cursor-hover');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    let animationId;
    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const render = () => {
      let targetX = mousePos.current.x;
      let targetY = mousePos.current.y;

      dotCoords.current.forEach((coord, index) => {
        // Snake trailing effect where each dot tracks the preceding dot coordinate
        const speed = 0.26 - index * 0.04;
        coord.x = lerp(coord.x, targetX, speed);
        coord.y = lerp(coord.y, targetY, speed);

        const dot = dotsRef.current[index];
        if (dot) {
          dot.style.left = `${coord.x}px`;
          dot.style.top = `${coord.y}px`;
        }

        targetX = coord.x;
        targetY = coord.y;
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationId);
      document.body.classList.remove('cursor-hover');
    };
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <div className="blob a" aria-hidden="true"></div>
      <div className="blob b" aria-hidden="true"></div>
      <ParticlesBg />

      {/* Google/Gemini Dots Cursor follower elements */}
      <div className="cursor-dot dot-blue" ref={(el) => (dotsRef.current[0] = el)}></div>
      <div className="cursor-dot dot-red" ref={(el) => (dotsRef.current[1] = el)}></div>
      <div className="cursor-dot dot-yellow" ref={(el) => (dotsRef.current[2] = el)}></div>
      <div className="cursor-dot dot-green" ref={(el) => (dotsRef.current[3] = el)}></div>

      <div className="container">
        <header>
          <div className="brand">
            <div className="logo">
              <img src="/images/portfolio_logo.png" alt="Logo" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, letterSpacing: '0.05em' }}>TAMIZH.</div>
              <div className="small muted" style={{ fontWeight: 500 }}>Software Engineer Portfolio</div>
            </div>
          </div>

          <nav id="nav" className={isMenuOpen ? "mobile-nav" : ""} aria-label="Primary navigation">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={`#${link.path}`}
                className={currentRoute === link.path ? 'active' : ''}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            id="menuToggle"
            className="menu-toggle"
            aria-expanded={isMenuOpen}
            aria-controls="nav"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </header>

        <main id="app" style={{ outline: 'none' }}>
          {/* HOME PAGE */}
          {currentRoute === '/' && (
            <section id="page-home" className="fade-in visible">
              <div className="hero">
                <div className="intro card">
                  <span className="eyebrow">Crafting elegant experiences</span>
                  <h1 style={{ marginTop: '16px' }}>
                    Hi, I'm <span id="dynamic-name">{name}</span> — <Typewriter words={['Full-Stack Developer', 'Cloud Engineer']} />
                  </h1>
                  <p className="lead">
                    I build clean, scalable web apps with Spring Boot, React.js and Cloud infrastructures. I am passionate about API integration, OOP concepts, database design, and cloud workflows.
                  </p>
                  <div className="cta-row">
                    <button className="btn btn-primary" onClick={() => window.location.hash = '#/contact'}>Hire me</button>
                    <a className="btn btn-ghost" href="#/projects">See projects</a>
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div className="card" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 18px' }}>
                      <div style={{ fontSpread: 'normal', fontWeight: 800, fontSize: '18px', color: 'var(--accent1)' }}>10+</div>
                      <div className="muted small" style={{ fontWeight: 500 }}>Projects built</div>
                    </div>
                  </div>
                </div>

                <aside className="card profile-card">
                  <div className="avatar">
                    <img
                      src="/images/profile.jpg"
                      alt={name}
                      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 12%' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerText = logo;
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '8px' }}>
                    <div style={{ fontWeight: 800, fontSize: '18px' }}>{name}</div>
                    <div className="muted small" style={{ fontWeight: 500, marginTop: '4px', lineHeight: '1.3' }}>Fullstack Dev & Cloud Engineer</div>
                  </div>
                  <div className="socials" style={{ margin: '8px 0' }}>
                    <a className="muted small" href="https://github.com/Tamizh-code" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a className="muted small" href="https://linkedin.com/in/tamizh-mani-v" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  </div>
                  <div style={{ marginTop: 'auto', width: '100%' }}>
                    <div className="muted small" style={{ fontWeight: 600 }}>Top skills</div>
                    <div className="skills" style={{ marginTop: '10px' }}>
                      <div className="skill">Java</div>
                      <div className="skill">Spring Boot</div>
                      <div className="skill">React.js</div>
                      <div className="skill">MySQL</div>
                      <div className="skill">AWS & GCP</div>
                    </div>
                  </div>
                </aside>
              </div>

              {/* quick projects preview */}
              <section style={{ marginTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontWeight: 800, fontSize: '20px' }}>Selected projects</h3>
                  <a href="#/projects" className="muted small" style={{ fontWeight: 600, textDecoration: 'none' }}>View all →</a>
                </div>

                <div className="grid" style={{ marginTop: '18px' }}>
                  {projects.slice(0, 3).map((proj) => (
                    <ProjectCard
                      key={proj.id}
                      id={proj.id}
                      title={proj.title}
                      description={proj.body}
                      tags={proj.tags}
                      onClick={() => setSelectedProject(proj)}
                    />
                  ))}
                </div>
              </section>
            </section>
          )}

          {/* PROJECTS PAGE */}
          {currentRoute === '/projects' && (
            <section id="page-projects" className="fade-in visible">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontWeight: 800, fontSize: '26px' }}>Projects</h2>
                <div className="muted small" style={{ fontWeight: 500 }}>Click any project for details</div>
              </div>

              <div className="grid" style={{ marginTop: '24px' }}>
                {projects.map((proj) => (
                  <ProjectCard
                    key={proj.id}
                    id={proj.id}
                    title={proj.title}
                    description={proj.body}
                    tags={proj.tags}
                    onClick={() => setSelectedProject(proj)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ABOUT PAGE */}
          {currentRoute === '/about' && (
            <section id="page-about" className="fade-in visible">
              <h2 style={{ margin: '0 0 16px 0', fontWeight: 800, fontSize: '26px' }}>About me</h2>
              <div className="card" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
                <div>
                  <p className="muted" style={{ margin: '0 0 18px 0', lineHeight: '1.6', fontSize: '15px' }}>
                    I'm a Computer Science Engineering student with hands-on experience in Java Full Stack Development and Cloud Computing through academic projects, certifications, and a Java Full Stack internship. Skilled in API integration, database management, testing, and debugging, with a strong interest in building scalable and reliable software solutions.
                  </p>

                  <h4 style={{ margin: '24px 0 10px 0', fontWeight: 800, fontSize: '16px' }}>What I do</h4>
                  <ul className="muted" style={{ margin: '0 0 24px 0', paddingLeft: '20px', lineHeight: '1.6', fontSize: '15px' }}>
                    <li>Develop full-stack web applications using Java, Spring Boot, and React.js.</li>
                    <li>Design databases using MySQL and PostgreSQL and create REST APIs.</li>
                    <li>Deploy serverless apps, event-driven architectures, and Generative AI pipelines on Cloud (AWS/GCP).</li>
                    <li>Perform testing, debugging, and code optimizations.</li>
                  </ul>

                  <h4 style={{ margin: '0 0 12px 0', fontWeight: 800, fontSize: '16px' }}>Education</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ borderLeft: '3px solid var(--accent1)', paddingLeft: '12px' }}>
                      <div style={{ fontWeight: 800 }}>B.E. Computer Science and Engineering</div>
                      <div className="muted small" style={{ fontWeight: 500 }}>Erode Sengunthar Engineering College • 2024 - 2027</div>
                      <div className="muted small" style={{ fontWeight: 600, color: 'var(--accent1)', marginTop: '2px' }}>CGPA: 8.5 / 10</div>
                    </div>
                    <div style={{ borderLeft: '3px solid var(--muted-light)', paddingLeft: '12px' }}>
                      <div style={{ fontWeight: 800 }}>Diploma in Mechanical Engineering</div>
                      <div className="muted small" style={{ fontWeight: 500 }}>Rajagopal Polytechnic College • 2020 - 2023</div>
                      <div className="muted small" style={{ fontWeight: 600, marginTop: '2px' }}>Percentage: 80%</div>
                    </div>
                  </div>

                  <h4 style={{ margin: '0 0 12px 0', fontWeight: 800, fontSize: '16px' }}>Certifications & Achievements</h4>
                  <ul className="muted" style={{ margin: '0 0 24px 0', paddingLeft: '20px', lineHeight: '1.6', fontSize: '15px' }}>
                    <li><strong>AWS Cloud Practitioner Essentials:</strong> In-depth training on cloud concepts and core AWS services.</li>
                    <li><strong>Google Cloud Arcade:</strong> Earned 7+ Google Cloud Skill Badges & completed Google Cloud Arcade Level 3 (Serverless, Generative AI, cloud infra).</li>
                    <li><strong>Infosys Springboard:</strong> Completed 10+ certifications in Front-End Dev, AI, Python, Software Engineering, and RPA.</li>
                    <li><strong>Cognizant Hackathon 2026:</strong> Successfully advanced to the Second Round of the challenge.</li>
                    <li><strong>CADD Centre:</strong> Certified in Python Programming and Frontend Web Development.</li>
                  </ul>

                  <h4 style={{ margin: '0 0 12px 0', fontWeight: 800, fontSize: '16px' }}>Tools & Technologies</h4>
                  <div className="skills">
                    <div className="skill">Java</div>
                    <div className="skill">Spring Boot</div>
                    <div className="skill">React.js</div>
                    <div className="skill">MySQL</div>
                    <div className="skill">PostgreSQL</div>
                    <div className="skill">AWS</div>
                    <div className="skill">GCP</div>
                    <div className="skill">Git & GitHub</div>
                    <div className="skill">VS Code</div>
                    <div className="skill">IntelliJ IDEA</div>
                    <div className="skill">Postman</div>
                  </div>
                </div>

                <div>
                  <div className="card" style={{ padding: '18px', background: 'rgba(255, 255, 255, 0.4)', height: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontWeight: 800, borderBottom: '1px solid rgba(15, 23, 42, 0.08)', paddingBottom: '8px' }}>Internship Experience</div>
                    <div>
                      <strong style={{ fontWeight: 800, fontSize: '14px' }}>Java Full Stack Developer Intern</strong>
                      <div className="muted small" style={{ fontWeight: 600, color: 'var(--accent1)' }}>Azhizhen Solutions</div>
                      <div className="muted small" style={{ marginTop: '2px' }}>Feb 2026 - Mar 2026</div>
                      <p className="muted small" style={{ marginTop: '8px', lineHeight: '1.4' }}>
                        Contributed to full stack web applications using Spring Boot, Java, and MySQL. Handled API development, testing, database schema management, and debugging.
                      </p>
                    </div>

                    <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(15, 23, 42, 0.08)', paddingTop: '14px' }}>
                      <strong style={{ fontWeight: 800 }}>Available for roles</strong>
                      <div className="muted small" style={{ marginTop: '2px' }}>Full-time / Entry-level roles</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* CONTACT PAGE */}
          {currentRoute === '/contact' && (
            <section id="page-contact" className="fade-in visible">
              <h2 style={{ margin: '0 0 16px 0', fontWeight: 800, fontSize: '26px' }}>Contact</h2>
              <div className="card" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
                <ContactForm />

                <div style={{ paddingLeft: '12px' }}>
                  <div className="muted-light small" style={{ fontWeight: 600 }}>Prefer email?</div>
                  <div style={{ marginTop: '6px', fontWeight: 600 }}>mr.tamizh77@gmail.com</div>
                  <div className="muted-light small" style={{ marginTop: '20px', fontWeight: 600 }}>Location</div>
                  <div style={{ marginTop: '6px', fontWeight: 600 }}>Tamil Nadu, India</div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      <ProjectModal
        isOpen={!!selectedProject}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
