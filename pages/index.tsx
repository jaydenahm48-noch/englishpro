/**
 * Public Frontend — Portfolio Website
 */

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import TypingText from '../components/admin/TypingText';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Certificate {
  id: string; title: string; description: string; issuer: string;
  image: string; issued_date: string; credential_url: string;
}

interface Task {
  id: string; title: string; description: string; task_number: string;
  link_url: string; link_label: string; link_type: string; submitted_date: string;
}

interface Project {
  id: string; title: string; slug: string; description: string;
  technologies: string; thumbnail: string; github_url: string; demo_url: string; featured: boolean;
}

interface ProjectImage {
  id: string; url: string; caption: string; sort_order: number;
}

interface ProjectDetail extends Project {
  images: ProjectImage[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PIXEL_FRAMES = [
  '/images/pixel gerakan 1.png',
  '/images/pixel gerakan 2.png',
  '/images/pixel gerakan 3.png',
  '/images/pixel gerakan 4.png',
  '/images/pixel gerakan 5.png',
];

const TASK_ICON: Record<string, string> = {
  doc: 'fa-file-word', pdf: 'fa-file-pdf', video: 'fa-file-video',
  presentation: 'fa-file-powerpoint', other: 'fa-file-alt',
};
const TASK_COLOR: Record<string, string> = {
  doc: '#4285f4', pdf: '#ea4335', video: '#ff0000',
  presentation: '#fbbc04', other: 'var(--skin-color)',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certsLoading, setCertsLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [projectDetailLoading, setProjectDetailLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Pixel sprite animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % PIXEL_FRAMES.length);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  // Fetch data
  useEffect(() => {
    fetch('/api/certificates')
      .then(r => r.json())
      .then(d => { if (d.success) setCerts(d.data); })
      .catch(() => {})
      .finally(() => setCertsLoading(false));

    fetch('/api/tasks')
      .then(r => r.json())
      .then(d => { if (d.success) setTasks(d.data); })
      .catch(() => {})
      .finally(() => setTasksLoading(false));

    fetch('/api/portfolio')
      .then(r => r.json())
      .then(d => { if (d.success) setProjects(d.data); })
      .catch(() => {})
      .finally(() => setProjectsLoading(false));
  }, []);

  // Close cert modal on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCert(null);
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Open project detail modal
  const openProjectDetail = async (slug: string) => {
    setProjectDetailLoading(true);
    setActiveImageIndex(0);
    try {
      const r = await fetch(`/api/portfolio/${slug}`);
      const d = await r.json();
      if (d.success) setSelectedProject(d.data);
    } catch { /* silent */ }
    finally { setProjectDetailLoading(false); }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Zaidan — 2300018222 ENGLISH PRO</title>
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/skins/color-1.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" referrerPolicy="no-referrer" />
        <link rel="stylesheet" href="/css/skins/color-1.css" className="alternate-style" title="color-1" {...{ disabled: true } as object} />
        <link rel="stylesheet" href="/css/skins/color-2.css" className="alternate-style" title="color-2" {...{ disabled: true } as object} />
        <link rel="stylesheet" href="/css/skins/color-3.css" className="alternate-style" title="color-3" {...{ disabled: true } as object} />
        <link rel="stylesheet" href="/css/skins/color-4.css" className="alternate-style" title="color-4" {...{ disabled: true } as object} />
        <link rel="stylesheet" href="/css/skins/color-5.css" className="alternate-style" title="color-5" {...{ disabled: true } as object} />
        <link rel="stylesheet" href="/css/style-switcher.css" />
        <link rel="stylesheet" href="/css/about-animations.css" />
      </Head>

      <div className="main-container">

        {/* ── Burger Button ── */}
        <button className="nav-toggler-btn" id="globalNavToggler" aria-label="Buka menu navigasi" aria-expanded="false" aria-controls="sidebarAside">
          <span></span>
        </button>
        <div className="nav-overlay" id="navOverlay"></div>

        {/* ── Sidebar ── */}
        <div className="aside" id="sidebarAside">
          <div className="logo">
            <a href="#home" onClick={() => { const el = document.querySelector('.nav a[href="#home"]') as HTMLElement; if (el) el.click(); }}>
              <img src="/images/img1.png" alt="Logo" />
            </a>
          </div>
          <div className="nav-toggler" id="asideNavToggler"><span></span></div>
          <ul className="nav">
            <li><a href="#home" className="active"><i className="fa fa-home"></i> Home</a></li>
            <li><a href="#about"><i className="fa fa-user"></i> About</a></li>
            <li><a href="#tasks"><i className="fa fa-book"></i> Tasks</a></li>
            <li><a href="#certificate"><i className="fa fa-certificate"></i> Certificates</a></li>
            <li><a href="#portfolio"><i className="fa fa-book"></i> Project</a></li>
          </ul>
        </div>

        {/* ── Main Content ── */}
        <div className="main-content">

          {/* ── HOME ── */}
          <section className="home active section" id="home">
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
              <div className="row">
                <div className="home-info padd-15">
                  <h3 className="hello">Hello, my name is <span>Zaidan</span></h3>
                  <h3 className="my-profession">I&apos;m a <TypingText /></h3>
                  <p>
                    I&apos;m an Informatics student at Universitas Ahmad Dahlan and a passionate Fullstack &amp; Mobile Developer
                    who is eager to grow by working on real projects. I bring strong dedication, quick learning
                    skills, and a fresh perspective to every task — committed to delivering quality work while continuously improving.
                  </p>
                  <a href="/images/ZAIDAN_CV.pdf" className="btn" download>Download CV</a>
                </div>
                <div className="home-img padd-15">
                  <div style={{ width: '340px', height: '300px', overflow: 'hidden', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={PIXEL_FRAMES[currentFrame]}
                      alt="Zaidan Pixel Animation"
                      style={{ width: '100%', height: '125%', objectFit: 'cover', objectPosition: 'top center' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── ABOUT ── */}
          <section className="about section" id="about">
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
              <div className="row">
                <div className="section-title padd-15"><h2>About Me</h2></div>
              </div>
              <div className="row">
                <div className="about-content padd-15">
                  <div className="row">
                    <div className="about-text padd-15">
                      <h3>I&apos;m <span>Zaidan</span> &mdash; Programmer</h3>
                      <div className="rpg-dialog" id="about-dialog"
                        data-full-text="I'm an Informatics student at Universitas Ahmad Dahlan and a passionate fullstack & mobile developer. Eager to learn, adapt, and deliver quality work — ready to grow and collaborate.">
                        <div className="rpg-dialog-header">Detail</div>
                        <div className="rpg-dialog-text">
                          <span className="rpg-typewriter"></span>
                          <span className="rpg-typewriter-cursor" aria-hidden="true"></span>
                        </div>
                        <span className="rpg-skip" role="button" tabIndex={0} aria-label="Skip animation">[ TAP TO SKIP ]</span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="personal-info padd-15" style={{ paddingLeft: '30px', paddingRight: '20px' }}>
                      <div className="row">
                        <div className="info-item">
                          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                            <tbody>
                              <tr className="about-info-row"><td style={{ width: '90px', fontWeight: 'bold', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>Birthday</td><td style={{ width: '15px', textAlign: 'center', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>:</td><td style={{ padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-700)' }}>19 NOV 2005</td></tr>
                              <tr className="about-info-row"><td style={{ fontWeight: 'bold', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>Instagram</td><td style={{ textAlign: 'center', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>:</td><td style={{ padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-700)' }}>@jayden.noch</td></tr>
                              <tr className="about-info-row"><td style={{ fontWeight: 'bold', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>Website</td><td style={{ textAlign: 'center', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>:</td><td style={{ padding: '6px 0', verticalAlign: 'top', wordBreak: 'break-all', color: 'var(--text-black-700)' }}>portojay.vercel.app</td></tr>
                              <tr className="about-info-row"><td style={{ fontWeight: 'bold', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>Phone</td><td style={{ textAlign: 'center', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>:</td><td style={{ padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-700)' }}>+62 813 751 3615</td></tr>
                              <tr className="about-info-row"><td style={{ fontWeight: 'bold', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>Country</td><td style={{ textAlign: 'center', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>:</td><td style={{ padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-700)' }}>Indonesia</td></tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="info-item">
                          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                            <tbody>
                              <tr className="about-info-row"><td style={{ width: '90px', fontWeight: 'bold', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>Age</td><td style={{ width: '15px', textAlign: 'center', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>:</td><td style={{ padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-700)' }}>20</td></tr>
                              <tr className="about-info-row"><td style={{ fontWeight: 'bold', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>Gmail</td><td style={{ textAlign: 'center', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>:</td><td style={{ padding: '6px 0', verticalAlign: 'top', wordBreak: 'break-all', color: 'var(--text-black-700)' }}>zaidanahmad005@gmail.com</td></tr>
                              <tr className="about-info-row"><td style={{ fontWeight: 'bold', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>Degree</td><td style={{ textAlign: 'center', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>:</td><td style={{ padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-700)' }}>CS</td></tr>
                              <tr className="about-info-row"><td style={{ fontWeight: 'bold', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>City</td><td style={{ textAlign: 'center', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>:</td><td style={{ padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-700)' }}>Yogyakarta</td></tr>
                              <tr className="about-info-row"><td style={{ fontWeight: 'bold', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>Freelance</td><td style={{ textAlign: 'center', padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-900)' }}>:</td><td style={{ padding: '6px 0', verticalAlign: 'top', color: 'var(--text-black-700)' }}>Available</td></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="row">
                        <div className="buttons padd-15">
                          <a href="#contact" className="btn hire-me">Hire Me</a>
                        </div>
                      </div>
                    </div>
                    <div className="skills padd-15">
                      <div className="row">
                        {[
                          ['Next.js & React', 85], ['TypeScript & JS', 80], ['Laravel & PHP', 80],
                          ['Flutter & Dart', 75], ['Tailwind CSS & HTML', 85], ['MySQL & PostgreSQL', 80],
                        ].map(([name, pct]) => (
                          <div key={name as string} className="skill-item padd-15">
                            <h5>{name}</h5>
                            <div className="progress">
                              <div className="progress-in" style={{ width: `${pct}%` }}></div>
                              <div className="skill-percent">{pct}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="education padd-15">
                      <h3 className="title">Education</h3>
                      <div className="row">
                        <div className="timeline-box padd-15">
                          <div className="timeline shadow-dark">
                            <div className="timeline-item"><div className="circle-dot"></div><h3 className="timeline-date"><i className="fa fa-calendar"></i> 2011&ndash;2016</h3><h4 className="timeline-title">MI Istiqomah Sambas PBG</h4><p>Strong foundation in learning, discipline, and curiosity.</p></div>
                            <div className="timeline-item"><div className="circle-dot"></div><h3 className="timeline-date"><i className="fa fa-calendar"></i> 2017&ndash;2019</h3><h4 className="timeline-title">Istiqomah Sambas PBG Junior High</h4><p>Strengthened academic skills and teamwork.</p></div>
                            <div className="timeline-item"><div className="circle-dot"></div><h3 className="timeline-date"><i className="fa fa-calendar"></i> 2020&ndash;2023</h3><h4 className="timeline-title">SMKN 1 PBG</h4><p>Computer and Network Engineering (TKJ).</p></div>
                            <div className="timeline-item"><div className="circle-dot"></div><h3 className="timeline-date"><i className="fa fa-calendar"></i> 2023&ndash;2027</h3><h4 className="timeline-title">Universitas Ahmad Dahlan</h4><p>Bachelor&apos;s in Informatics.</p></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="experience padd-15">
                      <h3 className="title">Experience</h3>
                      <div className="row">
                        <div className="timeline-box padd-15">
                          <div className="timeline shadow-dark">
                            <div className="timeline-item"><div className="circle-dot"></div><h3 className="timeline-date"><i className="fa fa-calendar"></i> 2021&ndash;2022</h3><h4 className="timeline-title">Internship (PKL) &mdash; PT HCP</h4><p>Fiber optic installation and maintenance.</p></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── CERTIFICATES ── */}
          <section className="certificate section" id="certificate">
            <div className="container">
              <div className="row">
                <div className="section-title padd-15"><h2>Certificates</h2></div>
              </div>
              <div className="row">
                <div className="portfolio-heading padd-15">
                  <h2 style={{ color: 'var(--text-black-900)' }}>My Certificates :</h2>
                </div>
              </div>
              <div className="row">
                {certsLoading ? (
                  <div className="certificate-item padd-15" style={{ flex: '0 0 100%', maxWidth: '100%', textAlign: 'center', padding: '40px 0', color: 'var(--text-black-700)' }}>
                    <i className="fa fa-spinner fa-spin" style={{ fontSize: '28px' }}></i>
                  </div>
                ) : certs.length === 0 ? (
                  <div style={{ flex: '0 0 100%', maxWidth: '100%', textAlign: 'center', padding: '40px 0', color: 'var(--text-black-700)' }}>Belum ada sertifikat.</div>
                ) : certs.map(c => (
                  <div key={c.id} className="certificate-item padd-15">
                    <div className="certificate-item-inner shadow-dark" style={{ cursor: 'pointer' }} onClick={() => setSelectedCert(c)}>
                      {c.image
                        ? <div className="certificate-img"><img src={c.image} alt={c.title} loading="lazy" /></div>
                        : <div className="certificate-img certificate-img--placeholder"><i className="fa fa-certificate"></i></div>
                      }
                      <div className="certificate-info">
                        <h4>{c.title}</h4>
                        {c.issuer && <p className="certificate-issuer"><i className="fa fa-building"></i> {c.issuer}</p>}
                        {c.issued_date && <p className="certificate-date"><i className="fa fa-calendar"></i> {c.issued_date}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── TASKS ── */}
          <section className="portfolio section" id="tasks">
            <div className="container">
              <div className="row">
                <div className="section-title padd-15"><h2>Tasks</h2></div>
              </div>
              <div className="row">
                <div className="portfolio-heading padd-15">
                  <h2>English Professional Tasks :</h2>
                </div>
              </div>
              <div className="row">
                {tasksLoading ? (
                  <div className="portfolio-item padd-15" style={{ flex: '0 0 100%', maxWidth: '100%', textAlign: 'center', padding: '40px 0', color: 'var(--text-black-700)' }}>
                    <i className="fa fa-spinner fa-spin" style={{ fontSize: '28px' }}></i>
                  </div>
                ) : tasks.length === 0 ? (
                  <div style={{ flex: '0 0 100%', maxWidth: '100%', textAlign: 'center', padding: '40px 0', color: 'var(--text-black-700)' }}>Belum ada task.</div>
                ) : tasks.map(t => (
                  <div key={t.id} className="portfolio-item padd-15">
                    <div className="portfolio-item-inner shadow-dark" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className={'fa ' + (TASK_ICON[t.link_type] || 'fa-file-alt')} style={{ fontSize: '22px', color: TASK_COLOR[t.link_type] || 'var(--skin-color)' }}></i>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {t.task_number && <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--skin-color)', opacity: 0.8 }}>Task {t.task_number}</span>}
                          <h4 style={{ margin: '2px 0 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-black-900)', lineHeight: 1.3 }}>{t.title}</h4>
                        </div>
                      </div>
                      {t.description
                        ? <p style={{ fontSize: '12px', color: 'var(--text-black-700)', lineHeight: 1.5, margin: '0 0 12px', flex: 1 }}>{t.description}</p>
                        : <div style={{ flex: 1 }}></div>
                      }
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-black-700)' }}>{t.submitted_date}</span>
                        <a href={t.link_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '6px 14px', fontSize: '11px', fontWeight: 600, textDecoration: 'none' }}>
                          {t.link_label || 'Buka File'}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── PORTFOLIO / PROJECTS ── */}
          <section className="portfolio section" id="portfolio">
            <div className="container">
              <div className="row">
                <div className="section-title padd-15"><h2>Projects</h2></div>
              </div>
              <div className="row">
                <div className="portfolio-heading padd-15">
                  <h2>My Projects :</h2>
                </div>
              </div>
              <div className="row">
                {projectsLoading ? (
                  <div className="portfolio-item padd-15" style={{ flex: '0 0 100%', maxWidth: '100%', textAlign: 'center', padding: '40px 0', color: 'var(--text-black-700)' }}>
                    <i className="fa fa-spinner fa-spin" style={{ fontSize: '28px' }}></i>
                  </div>
                ) : projects.length === 0 ? (
                  <div style={{ flex: '0 0 100%', maxWidth: '100%', textAlign: 'center', padding: '40px 0', color: 'var(--text-black-700)' }}>Belum ada project.</div>
                ) : projects.map(p => (
                  <div key={p.id} className="portfolio-item padd-15">
                    <div
                      className="portfolio-item-inner shadow-dark"
                      style={{ cursor: 'pointer' }}
                      onClick={() => openProjectDetail(p.slug)}
                    >
                      <div className="portfolio-img">
                        <img src={p.thumbnail || '/images/port.jpg'} alt={p.title} loading="lazy" />
                      </div>
                      <div className="portfolio-info">
                        <h4>{p.title}</h4>
                        {p.description && <p>{p.description}</p>}
                        {p.technologies && <p style={{ fontSize: '10px', color: 'var(--skin-color)', marginTop: '4px' }}>{p.technologies}</p>}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          {p.demo_url && (
                            <a href={p.demo_url} target="_blank" rel="noopener noreferrer" className="btn"
                              style={{ padding: '6px 12px', fontSize: '9px' }}
                              onClick={e => e.stopPropagation()}>
                              <i className="fa fa-external-link-alt" style={{ marginRight: '4px' }}></i>Demo
                            </a>
                          )}
                          {p.github_url && (
                            <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="btn"
                              style={{ padding: '6px 12px', fontSize: '9px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--card-border)' }}
                              onClick={e => e.stopPropagation()}>
                              <i className="fa fa-code" style={{ marginRight: '4px' }}></i>Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CONTACT ── */}
          <section className="contact section" id="contact">
            <div className="container">
              <div className="row">
                <div className="section-title padd-15"><h2>Contact Me</h2></div>
              </div>
              <h3 className="contact-title padd-15">Have You Any Questions ?</h3>
              <h4 className="contact-sub-title padd-15">I&apos;M AT YOUR SERVICE</h4>
              <div className="row">
                <div className="contact-info-item padd-15">
                  <div className="icon"><i className="fa fa-phone"></i></div>
                  <h4>Call Me On</h4>
                  <p>+62 82137513615</p>
                </div>
                <div className="contact-info-item padd-15">
                  <div className="icon"><i className="fa fa-map-marker-alt"></i></div>
                  <h4>Office</h4>
                  <p>Yogyakarta</p>
                </div>
                <div className="contact-info-item padd-15">
                  <div className="icon"><i className="fa fa-envelope"></i></div>
                  <h4>Gmail</h4>
                  <p>jydnahm@gmail.com</p>
                </div>
                <div className="contact-info-item padd-15">
                  <div className="icon"><i className="fa fa-globe-asia"></i></div>
                  <h4>Website</h4>
                  <p>portojay.vercel.app</p>
                </div>
              </div>
              <h3 className="contact-title padd-15">SEND ME AN EMAIL ?</h3>
              <h4 className="contact-sub-title padd-15">I&apos;M VERY RESPONSIVE TO MESSAGES</h4>
              <div className="row">
                <div className="contact-form padd-15">
                  <form id="contactForm">
                    <div className="row">
                      <div className="form-item col-6 padd-15">
                        <div className="form-group">
                          <input type="text" name="name" id="cf-name" className="form-control" placeholder="Name" required />
                        </div>
                      </div>
                      <div className="form-item col-6 padd-15">
                        <div className="form-group">
                          <input type="email" name="email" id="cf-email" className="form-control" placeholder="Gmail" required />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-item col-12 padd-15">
                        <div className="form-group">
                          <input type="text" name="subject" id="cf-subject" className="form-control" placeholder="Subject" required />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-item col-12 padd-15">
                        <div className="form-group">
                          <textarea name="message" id="cf-message" className="form-control" placeholder="Message" required></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-item col-12 padd-15">
                        <button type="submit" id="cf-submit" className="btn">Send Message</button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="padd-15" style={{ flex: '0 0 100%', maxWidth: '100%' }}>
                        <p id="cf-status" style={{ display: 'none', marginTop: '10px', textAlign: 'center', fontWeight: 600 }}></p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* ── Certificate Detail Modal ── */}
      {selectedCert && (
        <div id="certificateDetailOverlay" style={{ display: 'block' }} onClick={e => { if (e.target === e.currentTarget) setSelectedCert(null); }}>
          <div id="certificateDetailCard">
            <button className="cd-close-btn" onClick={() => setSelectedCert(null)}>&#x2715;</button>
            <div className="cd-image-wrap">
              {selectedCert.image && <img src={selectedCert.image} alt={selectedCert.title} />}
            </div>
            <div className="cd-body">
              <h2>{selectedCert.title}</h2>
              <div className="cd-meta">
                {selectedCert.issuer && <div className="cd-meta-item"><i className="fa fa-building"></i><span>{selectedCert.issuer}</span></div>}
                {selectedCert.issued_date && <div className="cd-meta-item"><i className="fa fa-calendar"></i><span>{selectedCert.issued_date}</span></div>}
              </div>
              <p className="cd-description">{selectedCert.description}</p>
              {selectedCert.credential_url && (
                <a className="cd-verify-btn" href={selectedCert.credential_url} target="_blank" rel="noopener">
                  <i className="fa fa-external-link-alt"></i> Lihat Sertifikat
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Project Detail Modal ── */}
      {(selectedProject || projectDetailLoading) && (
        <div
          style={{
            display: 'block', position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.92)', zIndex: 999,
            overflowY: 'auto', padding: '20px',
          }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedProject(null); }}
        >
          <div style={{
            maxWidth: '860px', margin: '40px auto',
            background: 'var(--bg-black-100)',
            border: '1px solid var(--card-border)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Close */}
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute', top: '12px', right: '14px',
                background: 'none', border: 'none', fontSize: '20px',
                cursor: 'pointer', color: 'var(--text-black-900)',
                zIndex: 10, fontFamily: 'monospace', lineHeight: 1,
              }}
            >&#x2715;</button>

            {projectDetailLoading ? (
              <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-black-700)' }}>
                <i className="fa fa-spinner fa-spin" style={{ fontSize: '32px' }}></i>
              </div>
            ) : selectedProject && (
              <>
                {/* ── Gallery ── */}
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <div style={{ background: 'var(--bg-black-50)' }}>
                    {/* Main image */}
                    <div style={{ width: '100%', maxHeight: '420px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                      <img
                        src={selectedProject.images[activeImageIndex]?.url}
                        alt={selectedProject.images[activeImageIndex]?.caption || selectedProject.title}
                        style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain', display: 'block' }}
                      />
                    </div>
                    {/* Caption */}
                    {selectedProject.images[activeImageIndex]?.caption && (
                      <div style={{ padding: '8px 16px', fontSize: '12px', color: 'var(--text-black-700)', fontStyle: 'italic', borderBottom: '1px solid var(--card-border)' }}>
                        {selectedProject.images[activeImageIndex].caption}
                      </div>
                    )}
                    {/* Thumbnails row */}
                    {selectedProject.images.length > 1 && (
                      <div style={{ display: 'flex', gap: '6px', padding: '10px 14px', overflowX: 'auto', flexWrap: 'nowrap' }}>
                        {selectedProject.images.map((img, idx) => (
                          <div
                            key={img.id}
                            onClick={() => setActiveImageIndex(idx)}
                            style={{
                              width: '70px', height: '52px', flexShrink: 0,
                              cursor: 'pointer', overflow: 'hidden',
                              border: idx === activeImageIndex ? '2px solid var(--skin-color)' : '2px solid transparent',
                              opacity: idx === activeImageIndex ? 1 : 0.55,
                              transition: 'opacity 0.2s, border-color 0.2s',
                            }}
                          >
                            <img src={img.url} alt={img.caption || `img-${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Prev / Next arrows */}
                    {selectedProject.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImageIndex(i => (i - 1 + selectedProject.images.length) % selectedProject.images.length)}
                          style={{ position: 'absolute', top: '180px', left: '8px', background: 'rgba(0,0,0,0.55)', border: 'none', color: '#fff', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >&#8249;</button>
                        <button
                          onClick={() => setActiveImageIndex(i => (i + 1) % selectedProject.images.length)}
                          style={{ position: 'absolute', top: '180px', right: '8px', background: 'rgba(0,0,0,0.55)', border: 'none', color: '#fff', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >&#8250;</button>
                      </>
                    )}
                  </div>
                )}

                {/* Thumbnail only (no images) fallback */}
                {(!selectedProject.images || selectedProject.images.length === 0) && (
                  <div style={{ width: '100%', height: '280px', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={selectedProject.thumbnail || '/images/port.jpg'} alt={selectedProject.title} style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain' }} />
                  </div>
                )}

                {/* ── Info ── */}
                <div style={{ padding: '22px 26px 28px' }}>
                  <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '13px', fontWeight: 400, lineHeight: 1.7, color: 'var(--text-black-900)', marginBottom: '12px', letterSpacing: '0.06em' }}>
                    {selectedProject.title}
                  </h2>
                  {selectedProject.technologies && (
                    <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedProject.technologies.split(',').map(t => (
                        <span key={t} style={{ fontFamily: "'VT323', monospace", fontSize: '14px', letterSpacing: '0.04em', padding: '2px 8px', background: 'rgba(236,24,57,0.12)', border: '1px solid var(--card-border)', color: 'var(--skin-color)' }}>
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  {selectedProject.description && (
                    <p style={{ fontSize: '13px', color: 'var(--text-black-700)', lineHeight: 1.75, marginBottom: '20px' }}>
                      {selectedProject.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {selectedProject.demo_url && (
                      <a href={selectedProject.demo_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: '9px', padding: '10px 18px' }}>
                        <i className="fa fa-external-link-alt" style={{ marginRight: '6px' }}></i>Live Demo
                      </a>
                    )}
                    {selectedProject.github_url && (
                      <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: '9px', padding: '10px 18px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--card-border)', color: 'var(--text-black-900)' }}>
                        <i className="fa fa-code" style={{ marginRight: '6px' }}></i>Source Code
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Style Switcher ── */}
      <div className="style-switcher">
        <div className="style-switcher-toggler s-icon"><i className="fas fa-cog fa-spin"></i></div>
        <div className="day-night s-icon"><i className="fas fa-sun"></i></div>
        <h4>Theme Colors</h4>
        <div className="colors">
          <span className="color-1" id="sc-1"></span>
          <span className="color-2" id="sc-2"></span>
          <span className="color-3" id="sc-3"></span>
          <span className="color-4" id="sc-4"></span>
          <span className="color-5" id="sc-5"></span>
        </div>
      </div>

      {/* ── Scripts ── */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.1.0/typed.umd.js" strategy="beforeInteractive" referrerPolicy="no-referrer" />
      <Script src="/js/script.js" strategy="afterInteractive" />
      <Script src="/js/style-switcher.js" strategy="afterInteractive" />
      <Script src="/js/about-animations.js" strategy="afterInteractive" />
      <Script id="site-handlers" strategy="afterInteractive">{`
        (function() {
          var btn = document.getElementById('globalNavToggler');
          var overlay = document.getElementById('navOverlay');
          var aside = document.querySelector('.aside');
          var sections = document.querySelectorAll('.section');
          if (!btn) return;
          function open() { btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); aside.classList.add('open'); overlay.classList.add('active'); sections.forEach(function(s){s.classList.add('open');}); }
          function close() { btn.classList.remove('open'); btn.setAttribute('aria-expanded','false'); aside.classList.remove('open'); overlay.classList.remove('active'); sections.forEach(function(s){s.classList.remove('open');}); }
          btn.addEventListener('click', function() { aside.classList.contains('open') ? close() : open(); });
          if (overlay) overlay.addEventListener('click', close);
          window._closeNavDrawer = close;
        })();
        document.getElementById('sc-1').onclick = function() { setActiveStyle('color-1'); };
        document.getElementById('sc-2').onclick = function() { setActiveStyle('color-2'); };
        document.getElementById('sc-3').onclick = function() { setActiveStyle('color-3'); };
        document.getElementById('sc-4').onclick = function() { setActiveStyle('color-4'); };
        document.getElementById('sc-5').onclick = function() { setActiveStyle('color-5'); };
        document.getElementById('contactForm').addEventListener('submit', async function(e) {
          e.preventDefault();
          var btn = document.getElementById('cf-submit');
          var status = document.getElementById('cf-status');
          btn.disabled = true; btn.textContent = 'Sending...'; status.style.display = 'none';
          try {
            var r = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: document.getElementById('cf-name').value.trim(), email: document.getElementById('cf-email').value.trim(), subject: document.getElementById('cf-subject').value.trim(), message: document.getElementById('cf-message').value.trim() }) });
            var d = await r.json();
            status.textContent = (r.ok && d.success) ? 'Pesan berhasil dikirim!' : (d.error || 'Gagal mengirim.');
            status.style.color = (r.ok && d.success) ? 'var(--skin-color)' : '#e74c3c';
            status.style.display = 'block';
            if (r.ok && d.success) document.getElementById('contactForm').reset();
          } catch(err) { status.textContent = 'Terjadi kesalahan koneksi.'; status.style.color = '#e74c3c'; status.style.display = 'block'; }
          finally { btn.disabled = false; btn.textContent = 'Send Message'; }
        });
      `}</Script>
    </>
  );
}
