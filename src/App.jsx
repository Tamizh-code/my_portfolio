import React, { useState, useEffect, useRef } from 'react';
import ParticlesBg from './components/ParticlesBg';
import Typewriter from './components/Typewriter';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import ContactForm from './components/ContactForm';
import CertificationsPage from './components/CertificationsPage';
import { privateProjects, isIgnoredRepo } from './config/privateProjects';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [name, setName] = useState('Tamizh Mani V');
  const [logo, setLogo] = useState('TM');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(() =>
    privateProjects.filter((p) => !isIgnoredRepo(p.name))
  );

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

  // 4) Dynamic GitHub Projects Fetching with Pagination (Fetches all repos except ignored ones)
  useEffect(() => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const fetchAllRepos = async () => {
      try {
        let allRepos = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const endpoint = token
            ? `https://api.github.com/user/repos?sort=updated&per_page=100&page=${page}&affiliation=owner`
            : `https://api.github.com/users/Tamizh-code/repos?sort=updated&per_page=100&page=${page}`;

          const res = await fetch(endpoint, { headers });
          if (!res.ok) throw new Error(`Failed to fetch repositories (Status ${res.status})`);
          const data = await res.json();

          if (Array.isArray(data) && data.length > 0) {
            allRepos = [...allRepos, ...data];
            if (data.length < 100) {
              hasMore = false;
            } else {
              page++;
            }
          } else {
            hasMore = false;
          }
        }

        if (allRepos.length > 0) {
          const formatted = allRepos
            .filter((repo) => {
              if (repo.fork) return false;
              return !isIgnoredRepo(repo.name);
            })
            .map((repo) => ({
              id: String(repo.id),
              title: repo.name
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase()),
              body: repo.description || (repo.private ? 'A private repository on GitHub.' : 'A public repository on GitHub.'),
              tags: [repo.language, ...(repo.topics || [])].filter(Boolean),
              htmlUrl: repo.html_url,
              name: repo.name,
              isPrivate: Boolean(repo.private),
              owner: repo.owner?.login || 'Tamizh-code'
            }));

          if (formatted.length > 0) {
            const formattedCleanKeys = formatted.map((p) => p.name.toLowerCase().replace(/[^a-z0-9]/g, ''));

            const curatedNonDuplicates = privateProjects
              .filter((curated) => !isIgnoredRepo(curated.name))
              .map((curated) => {
                const clean = curated.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                const matchedIdx = formattedCleanKeys.indexOf(clean);
                if (matchedIdx !== -1) {
                  formatted[matchedIdx] = {
                    ...curated,
                    ...formatted[matchedIdx],
                    title: curated.title || formatted[matchedIdx].title,
                    body: curated.body || formatted[matchedIdx].body,
                    tags: curated.tags?.length ? curated.tags : formatted[matchedIdx].tags,
                    isPrivate: curated.isPrivate || formatted[matchedIdx].isPrivate,
                    readmeContent: curated.readmeContent || formatted[matchedIdx].readmeContent
                  };
                  return null;
                }
                return curated;
              })
              .filter(Boolean);

            setProjects([...curatedNonDuplicates, ...formatted]);
          }
        }
      } catch (err) {
        console.error('Error fetching GitHub repos, using curated fallback projects:', err);
      }
    };

    fetchAllRepos();
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
    { label: 'Certifications', path: '/certifications' },
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
                      <div style={{ fontSpread: 'normal', fontWeight: 800, fontSize: '18px', color: 'var(--accent1)' }}>{projects.length}+</div>
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
                      isPrivate={proj.isPrivate}
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
                    isPrivate={proj.isPrivate}
                    onClick={() => setSelectedProject(proj)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS PAGE */}
          {currentRoute === '/certifications' && (
            <CertificationsPage />
          )}

          {/* ABOUT PAGE */}
          {currentRoute === '/about' && (
            <section id="page-about" className="fade-in visible">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span className="eyebrow">Professional Profile & Resume</span>
                  <h2 style={{ margin: '8px 0 0 0', fontWeight: 800, fontSize: '28px' }}>About Me</h2>
                </div>
                <a
                  href="/Tamizh_Mani_V_Resume.docx"
                  download="Tamizh_Mani_V_Resume.docx"
                  className="btn btn-primary"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '10px 18px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download Resume (CV)
                </a>
              </div>

              <div className="card two-col-layout">
                <div>
                  {/* Professional Summary */}
                  <h4 style={{ margin: '0 0 10px 0', fontWeight: 800, fontSize: '16px', color: 'var(--accent1)' }}>
                    Professional Summary
                  </h4>
                  <p className="muted" style={{ margin: '0 0 24px 0', lineHeight: '1.65', fontSize: '15px' }}>
                    Final-year Computer Science Engineering student specializing in <strong>Java Full Stack Development</strong> and <strong>Cloud Engineering</strong>, with hands-on experience in building scalable web, cloud, and AI-powered applications. Proficient in Java, Spring Boot, React.js, MySQL, REST APIs, AWS, Docker, and Google Cloud. Practical exposure through enterprise-grade academic projects and an industry full-stack internship. Experienced in API integration, relational database design, IaC cloud deployment (Terraform), and modern software workflows using Git & Postman. Strong problem-solving, leadership, and collaborative skills.
                  </p>

                  {/* Education */}
                  <h4 style={{ margin: '24px 0 12px 0', fontWeight: 800, fontSize: '16px' }}>Education</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                    <div style={{ borderLeft: '3px solid var(--accent1)', paddingLeft: '14px' }}>
                      <div style={{ fontWeight: 800, fontSize: '15px' }}>B.E. Computer Science and Engineering</div>
                      <div className="muted small" style={{ fontWeight: 500, marginTop: '2px' }}>Erode Sengunthar Engineering College • 2024 - 2027</div>
                      <div className="muted small" style={{ fontWeight: 700, color: 'var(--accent1)', marginTop: '4px' }}>CGPA: 8.5 / 10</div>
                    </div>
                    <div style={{ borderLeft: '3px solid var(--muted-light)', paddingLeft: '14px' }}>
                      <div style={{ fontWeight: 800, fontSize: '15px' }}>Diploma in Mechanical Engineering</div>
                      <div className="muted small" style={{ fontWeight: 500, marginTop: '2px' }}>Rajagopal Polytechnic College • 2020 - 2023</div>
                      <div className="muted small" style={{ fontWeight: 700, marginTop: '4px' }}>Percentage: 80%</div>
                    </div>
                  </div>

                  {/* Categorized Technical Skills */}
                  <h4 style={{ margin: '24px 0 12px 0', fontWeight: 800, fontSize: '16px' }}>Technical Skills & Competencies</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    <div>
                      <div className="muted small" style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--accent1)' }}>Programming Languages</div>
                      <div className="skills">
                        <div className="skill">Java</div>
                        <div className="skill">Python</div>
                        <div className="skill">SQL</div>
                        <div className="skill">JavaScript</div>
                        <div className="skill">Dart</div>
                        <div className="skill">HCL (Terraform)</div>
                      </div>
                    </div>
                    <div>
                      <div className="muted small" style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--accent1)' }}>Web & Frameworks</div>
                      <div className="skills">
                        <div className="skill">Spring Boot</div>
                        <div className="skill">Spring MVC</div>
                        <div className="skill">Spring Data JPA / Hibernate</div>
                        <div className="skill">React.js</div>
                        <div className="skill">REST APIs</div>
                        <div className="skill">HTML5 & CSS3</div>
                        <div className="skill">Bootstrap</div>
                      </div>
                    </div>
                    <div>
                      <div className="muted small" style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--accent1)' }}>Cloud, DevOps & Infrastructure</div>
                      <div className="skills">
                        <div className="skill">AWS (EC2, S3, RDS, ASG, ALB, CloudWatch)</div>
                        <div className="skill">Terraform IaC</div>
                        <div className="skill">Docker</div>
                        <div className="skill">Kubernetes Basics</div>
                        <div className="skill">GCP Basics</div>
                        <div className="skill">CI/CD Pipelines</div>
                      </div>
                    </div>
                    <div>
                      <div className="muted small" style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--accent1)' }}>AI / ML & GenAI</div>
                      <div className="skills">
                        <div className="skill">LangChain</div>
                        <div className="skill">LangGraph</div>
                        <div className="skill">RAG Architecture</div>
                        <div className="skill">Google Gemini API</div>
                        <div className="skill">Qdrant Vector DB</div>
                        <div className="skill">Vertex AI</div>
                      </div>
                    </div>
                    <div>
                      <div className="muted small" style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--accent1)' }}>Databases & Tools</div>
                      <div className="skills">
                        <div className="skill">MySQL</div>
                        <div className="skill">PostgreSQL</div>
                        <div className="skill">MongoDB</div>
                        <div className="skill">Redis</div>
                        <div className="skill">Firebase</div>
                        <div className="skill">Git & GitHub</div>
                        <div className="skill">Postman</div>
                        <div className="skill">IntelliJ IDEA</div>
                        <div className="skill">VS Code</div>
                        <div className="skill">XAMPP</div>
                      </div>
                    </div>
                  </div>

                  {/* Certifications & Achievements */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 12px 0', flexWrap: 'wrap', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontWeight: 800, fontSize: '16px' }}>Certifications & Honors</h4>
                    <a href="#/certifications" className="muted small" style={{ fontWeight: 600, color: 'var(--accent1)', textDecoration: 'none' }}>View All 17+ Certificates →</a>
                  </div>
                  <ul className="muted" style={{ margin: '0 0 24px 0', paddingLeft: '20px', lineHeight: '1.65', fontSize: '14.5px' }}>
                    <li><strong>AWS Cloud Practitioner Essentials:</strong> Training on core cloud concepts, AWS services, and cloud security architecture.</li>
                    <li><strong>17 Google Skills Boost Badges:</strong> Earned badges in Generative AI, Vertex AI, Prompt Engineering, Gemini, Streamlit, and GCP Cloud infra.</li>
                    <li><strong>HackerRank Software Engineer Certification:</strong> Verified proficiency in programming, problem solving, DSA, and software engineering principles.</li>
                    <li><strong>NPTEL Programming in Java:</strong> Successfully completed national-level certification in Java programming.</li>
                    <li><strong>Cognizant Hackathon 2026:</strong> Advanced to Round 2 in national software innovation challenge.</li>
                    <li><strong>Adobe India Hackathon 2026:</strong> Competed and developed innovative solution in national hackathon.</li>
                    <li><strong>Infosys Springboard (10+ Certifications):</strong> Completed courses in Front-End Dev, AI, Python, Software Engineering, and RPA.</li>
                    <li><strong>CADD Centre Certified:</strong> Certified in Python Programming & Frontend Web Development.</li>
                  </ul>

                  {/* Leadership & Extra Curriculum */}
                  <h4 style={{ margin: '24px 0 12px 0', fontWeight: 800, fontSize: '16px' }}>Leadership & Student Mentorship</h4>
                  <ul className="muted" style={{ margin: '0 0 12px 0', paddingLeft: '20px', lineHeight: '1.65', fontSize: '14.5px' }}>
                    <li><strong>Technical Lead (College Students Committee):</strong> Led technical hackathons, coding workshops, and project-based activities while coordinating student teams.</li>
                    <li><strong>Learning Club Lead (Student Mentorship Program):</strong> Mentored junior students in programming, real-world full-stack projects, Git/GitHub, and career readiness.</li>
                  </ul>
                </div>

                {/* Right Column: Internship Experience & Highlights */}
                <div>
                  <div className="card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.45)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ fontWeight: 800, fontSize: '15px', borderBottom: '1px solid rgba(15, 23, 42, 0.08)', paddingBottom: '10px' }}>
                      💼 Industry Internship
                    </div>
                    <div>
                      <strong style={{ fontWeight: 800, fontSize: '15px' }}>Java Full Stack Developer Intern</strong>
                      <div className="muted small" style={{ fontWeight: 700, color: 'var(--accent1)', marginTop: '2px' }}>Azhizhen Solutions</div>
                      <div className="muted small" style={{ marginTop: '2px', fontWeight: 500 }}>Feb 2026 - Mar 2026</div>

                      <div style={{ marginTop: '10px', fontSize: '13.5px', lineHeight: '1.5' }}>
                        <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--text)' }}>Project: Process Flow Control Application</div>
                        <ul className="muted" style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <li>Developed full stack workflow management app using Java, Spring Boot, & MySQL to automate business process flows.</li>
                          <li>Designed RESTful APIs for process creation, approval management, & real-time status tracking.</li>
                          <li>Implemented secure CRUD operations & optimized MySQL database schema design.</li>
                          <li>Integrated frontend/backend with Spring MVC & REST APIs, tested via Postman & managed with GitHub.</li>
                        </ul>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(15, 23, 42, 0.08)', paddingTop: '14px' }}>
                      <strong style={{ fontWeight: 800, fontSize: '14px' }}>🌐 Languages Spoken</strong>
                      <div className="muted small" style={{ marginTop: '6px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="skill" style={{ padding: '4px 10px' }}>English (Professional)</span>
                        <span className="skill" style={{ padding: '4px 10px' }}>Tamil (Native)</span>
                        <span className="skill" style={{ padding: '4px 10px' }}>Telugu</span>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(15, 23, 42, 0.08)', paddingTop: '14px' }}>
                      <strong style={{ fontWeight: 800 }}>Available for Roles</strong>
                      <div className="muted small" style={{ marginTop: '2px', fontWeight: 500 }}>Full-time / Entry-level Software Engineer, Java Developer & Cloud Engineer</div>
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
              <div className="card two-col-layout">
                <ContactForm />

                <div className="contact-sidebar">
                  <div className="muted-light small" style={{ fontWeight: 600 }}>Prefer email?</div>
                  <div style={{ marginTop: '6px', fontWeight: 600, wordBreak: 'break-word' }}>mr.tamizh77@gmail.com</div>
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
