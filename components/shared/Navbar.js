// components/shared/Navbar.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, userProfile, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
    setMenuOpen(false);
  };

  return (
    <>
      <style>{`
        .nav-links-desktop { display: flex; gap: 32px; align-items: center; flex: 1; justify-content: center; }
        .nav-auth-desktop  { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .nav-hamburger     { display: none; }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none; }
          .nav-auth-desktop  { display: none; }
          .nav-hamburger     { display: flex; flex-direction: column; justify-content: space-between;
                               width: 28px; height: 20px; background: none; border: none; cursor: pointer;
                               padding: 0; flex-shrink: 0; }
        }
      `}</style>

      <nav style={S.nav}>
        <div style={S.inner}>
          <Link href="/" style={S.logo}>
            <span style={{ fontSize: '1.4rem' }}>⚡</span>
            <span style={S.logoText}>EduVault</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links-desktop">
            <Link href="/courses" style={S.link}>Courses</Link>
            {user && !isAdmin && <Link href="/dashboard" style={S.link}>My Learning</Link>}
            {isAdmin && <Link href="/admin" style={{ ...S.link, color: 'var(--gold)' }}>Admin Panel</Link>}
          </div>

          {/* Desktop Auth */}
          <div className="nav-auth-desktop">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={S.avatar}>{userProfile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</div>
                <span style={S.userName}>{userProfile?.name?.split(' ')[0] || 'User'}</span>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href="/auth/login" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Login</Link>
                <Link href="/auth/signup" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Sign Up</Link>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', width: '100%', height: '2px',
                background: 'var(--text-primary)', borderRadius: '2px',
                transition: 'all 0.3s',
                transform: menuOpen
                  ? i === 0 ? 'rotate(45deg) translate(6px, 6px)'
                  : i === 1 ? 'scaleX(0) opacity(0)'
                  : 'rotate(-45deg) translate(6px, -6px)'
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
            zIndex: 60, backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Mobile Drawer */}
      <div style={{
        ...S.drawer,
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
      }}>
        <div style={S.drawerHeader}>
          <span style={S.logoText}>EduVault</span>
          <button onClick={() => setMenuOpen(false)} style={S.closeBtn}>✕</button>
        </div>

        {user && (
          <div style={S.drawerUser}>
            <div style={S.drawerAvatar}>{userProfile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{userProfile?.name || 'Student'}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
          </div>
        )}

        <nav style={S.drawerNav}>
          {[
            { href: '/courses', icon: '🎓', label: 'Courses', show: true },
            { href: '/dashboard', icon: '📚', label: 'My Learning', show: !!(user && !isAdmin) },
            { href: '/admin', icon: '🛡️', label: 'Admin Panel', show: !!isAdmin, gold: true },
            { href: '/auth/login', icon: '🔐', label: 'Login', show: !user },
            { href: '/auth/signup', icon: '✨', label: 'Sign Up', show: !user },
          ].filter(i => i.show).map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{ ...S.drawerLink, ...(item.gold ? { color: 'var(--gold)' } : {}) }}
              onClick={() => setMenuOpen(false)}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {user && (
          <div style={{ padding: '0 16px 24px' }}>
            <button onClick={handleLogout} style={S.drawerLogout}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const S = {
  nav: {
    background: 'rgba(10,10,15,0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  inner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    gap: '16px',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  logoText: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: '1.3rem',
    background: 'linear-gradient(135deg, #6c63ff, #f5c842)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  link: { color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' },
  avatar: {
    width: '34px', height: '34px', borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
  },
  userName: {
    fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)',
    maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  drawer: {
    position: 'fixed',
    top: 0, right: 0,
    width: '280px', maxWidth: '85vw',
    height: '100vh',
    background: 'var(--bg-secondary)',
    borderLeft: '1px solid var(--border)',
    zIndex: 70,
    transition: 'transform 0.3s ease',
    display: 'flex', flexDirection: 'column',
    overflowY: 'auto',
  },
  drawerHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 20px 16px',
    borderBottom: '1px solid var(--border)',
  },
  closeBtn: {
    background: 'var(--bg-input)', border: '1px solid var(--border)',
    color: 'var(--text-muted)', width: '32px', height: '32px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  drawerUser: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '16px 20px',
    background: 'var(--bg-card)',
    borderBottom: '1px solid var(--border)',
  },
  drawerAvatar: {
    width: '42px', height: '42px', borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '1rem', flexShrink: 0,
  },
  drawerNav: { display: 'flex', flexDirection: 'column', padding: '12px', flex: 1 },
  drawerLink: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '13px 16px', borderRadius: '10px',
    color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem',
    marginBottom: '4px',
  },
  drawerLogout: {
    width: '100%', padding: '13px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: 'var(--danger)', borderRadius: '10px',
    fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
  },
};
