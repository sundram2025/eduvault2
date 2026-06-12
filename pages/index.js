// pages/index.js
import Link from 'next/link';
import Navbar from '../components/shared/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={S.hero}>
        <div style={S.heroBg} />
        <div className="container" style={S.heroInner}>
          <div style={S.badge}>
            <span style={{ color: 'var(--gold)' }}>⚡</span>
            Free Learning Platform
          </div>
          <h1 style={S.heroTitle}>
            Unlock Your <span className="gradient-text">Potential</span><br />
            Learn from the Best
          </h1>
          <p style={S.heroSub}>
            Access world-class courses by top educators. Master marketing, AI, business & more.
            100% free for all registered students.
          </p>
          <div style={S.heroBtns}>
            <Link href="/courses" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              🎓 Browse Courses
            </Link>
            <Link href="/auth/signup" className="btn btn-outline" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              Get Started Free
            </Link>
          </div>

          {/* Stats */}
          <div style={S.stats}>
            {[
              { num: '2+', label: 'Expert Courses' },
              { num: '100%', label: 'Free Access' },
              { num: '∞', label: 'Lifetime Access' },
              { num: '24/7', label: 'Available Always' },
            ].map((s, i) => (
              <div key={i} style={S.statItem}>
                <div style={S.statNum}>{s.num}</div>
                <div style={S.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={S.sectionTitle}>
            Why Choose <span className="gradient-text">EduVault?</span>
          </h2>
          <p style={S.sectionSub}>Everything you need to level up your skills</p>
          <div className="grid-3">
            {features.map((f, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={S.featureIcon}>{f.icon}</div>
                <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <h2 style={S.sectionTitle}>
            Start Learning in <span className="gradient-text">3 Simple Steps</span>
          </h2>
          <p style={S.sectionSub}>No payment needed. Just sign up and start.</p>
          <div className="grid-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {steps.map((step, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={S.stepNum}>{i + 1}</div>
                <div style={{ fontSize: '2rem', margin: '12px 0' }}>{step.icon}</div>
                <h3 style={{ marginBottom: '8px', fontSize: '1rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={S.cta}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '16px' }}>
            Ready to Start <span className="gradient-text">Learning?</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
            Join students transforming their careers with expert-led courses — completely free.
          </p>
          <Link href="/courses" className="btn btn-gold" style={{ padding: '16px 40px', fontSize: '1.05rem' }}>
            🚀 Explore All Courses
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={S.footer}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            © 2024 EduVault. All rights reserved. | Free Educational Platform
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  { icon: '🎯', title: 'Expert-Led Courses', desc: 'Learn from industry leaders with proven methodologies and real-world experience.' },
  { icon: '🔓', title: 'Free for Everyone', desc: 'All courses are completely free. Sign up and access everything instantly.' },
  { icon: '📱', title: 'Learn Anywhere', desc: 'Fully responsive on mobile, tablet, and desktop. Learn on the go.' },
  { icon: '⚡', title: 'Instant Access', desc: 'No waiting, no approval. Sign up and start watching within seconds.' },
  { icon: '🤖', title: 'AI & Modern Skills', desc: 'Stay ahead with courses on AI, Marketing, and future-ready skills.' },
  { icon: '🏆', title: 'Structured Learning', desc: 'Well-organized lectures and course content to keep you on track.' },
];

const steps = [
  { icon: '✍️', title: 'Create Account', desc: 'Sign up with your email in under 30 seconds. No credit card needed.' },
  { icon: '🎓', title: 'Pick a Course', desc: 'Browse our library and choose any course that interests you.' },
  { icon: '▶️', title: 'Start Learning', desc: 'Click "Start Learning" and access all lectures instantly for free.' },
];

const S = {
  hero: {
    position: 'relative',
    padding: 'clamp(48px, 8vw, 100px) 0 clamp(48px, 8vw, 100px)',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 30% 50%, rgba(108,99,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(245,200,66,0.06) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  heroInner: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '680px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(108,99,255,0.1)',
    border: '1px solid rgba(108,99,255,0.3)',
    borderRadius: '20px',
    padding: '6px 16px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    width: 'fit-content',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
    lineHeight: 1.1,
  },
  heroSub: {
    fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    maxWidth: '540px',
  },
  heroBtns: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
  },
  stats: {
    display: 'flex',
    gap: 'clamp(16px, 4vw, 32px)',
    flexWrap: 'wrap',
    paddingTop: '16px',
    borderTop: '1px solid var(--border)',
  },
  statItem: { display: 'flex', flexDirection: 'column', gap: '2px' },
  statNum: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', color: 'var(--accent-light)' },
  statLabel: { fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 },
  sectionTitle: { textAlign: 'center', fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '8px' },
  sectionSub: { textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '48px', fontSize: '0.95rem' },
  featureIcon: { fontSize: '2rem', marginBottom: '16px', display: 'block' },
  stepNum: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem',
    color: 'white', margin: '0 auto',
  },
  cta: {
    padding: '80px 0',
    background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(245,200,66,0.04))',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
  },
  footer: {
    padding: '32px 0',
    background: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border)',
  },
};
