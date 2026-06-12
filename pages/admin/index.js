// pages/admin/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../lib/AuthContext';
import { getAnalytics } from '../../lib/db';

export default function AdminDashboard() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== 'admin')) {
      router.push('/auth/admin-login');
    }
    if (!loading && userProfile?.role === 'admin') fetchData();
  }, [user, loading, userProfile]);

  const fetchData = async () => {
    const stats = await getAnalytics();
    setAnalytics(stats);
    setDataLoading(false);
  };

  if (loading || dataLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="admin-layout">
      {/* Mobile toggle button */}
      <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>

      {/* Sidebar overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <AdminSidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} active="/admin" />

      {/* Main Content */}
      <div className="admin-main">
        <div style={S.topBar}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', marginBottom: '4px' }}>Dashboard Overview</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Welcome, {userProfile?.name || 'Admin'}
            </p>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid-4" style={{ marginBottom: '28px' }}>
          {[
            { icon: '👥', label: 'Total Users', value: analytics?.totalUsers || 0, color: 'var(--accent-light)' },
            { icon: '🟢', label: 'Active Today', value: analytics?.activeUsers || 0, color: 'var(--success)' },
            { icon: '📚', label: 'Total Courses', value: analytics?.totalCourses || 0, color: 'var(--gold)' },
            { icon: '📋', label: 'Enrollments', value: analytics?.totalEnrollments || 0, color: 'var(--accent-light)' },
          ].map((s, i) => (
            <div key={i} className="card">
              <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          {/* Platform Stats */}
          <div className="card">
            <h3 style={{ marginBottom: '20px', fontSize: '1rem' }}>📊 Platform Stats</h3>
            {[
              { label: 'Total Courses', value: analytics?.totalCourses || 0 },
              { label: 'Total Students', value: analytics?.totalUsers || 0 },
              { label: 'Total Enrollments', value: analytics?.totalEnrollments || 0 },
              { label: 'Active Today', value: analytics?.activeUsers || 0 },
            ].map((s, i) => (
              <div key={i} style={S.statRow}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{s.label}</span>
                <strong style={{ color: 'var(--text-primary)' }}>{s.value}</strong>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 style={{ marginBottom: '20px', fontSize: '1rem' }}>⚡ Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/admin/courses/add" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                + Add New Course
              </Link>
              <Link href="/admin/users" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                👥 Manage Users
              </Link>
              <Link href="/admin/courses" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                📚 Manage Courses
              </Link>
              <Link href="/courses" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                🌐 View Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Admin Sidebar ──────────────────────────────────
export function AdminSidebarComponent({ open, onClose, active }) {
  const router = useRouter();
  const currentPath = active || router.pathname;

  const navItems = [
    { href: '/admin', icon: '📊', label: 'Dashboard' },
    { href: '/admin/courses', icon: '📚', label: 'Courses' },
    { href: '/admin/users', icon: '👥', label: 'Users' },
  ];

  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <Link href="/" style={sS.logo}>
        <span>⚡</span>
        <span style={sS.logoText}>EduVault</span>
      </Link>
      <p style={sS.adminTag}>🛡️ Admin Panel</p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navItems.map(item => {
          const isActive = currentPath === item.href ||
            (item.href !== '/admin' && currentPath.startsWith(item.href + '/'));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...sS.navItem,
                background: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-secondary)',
              }}
              onClick={onClose}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Link href="/" style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block' }}>
        ← Back to Site
      </Link>
    </aside>
  );
}

const sS = {
  logo: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontSize: '1.3rem', marginBottom: '6px',
    textDecoration: 'none',
  },
  logoText: {
    fontFamily: 'Syne, sans-serif', fontWeight: 800,
    background: 'linear-gradient(135deg, #6c63ff, #f5c842)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  adminTag: { fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700, marginBottom: '24px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '8px',
    fontWeight: 500, fontSize: '0.9rem', transition: 'all 0.2s',
    textDecoration: 'none',
  },
};

const S = {
  topBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '28px', flexWrap: 'wrap', gap: '12px',
    paddingTop: '8px',
  },
  statRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem',
  },
};
