// pages/courses/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/shared/Navbar';
import { getCourse } from '../../lib/db';
import { useAuth } from '../../lib/AuthContext';

export default function CoursePage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLecture, setActiveLecture] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => { if (id) fetchData(); }, [id]);

  const fetchData = async () => {
    const c = await getCourse(id);
    setCourse(c);
    if (c?.lectures?.length > 0) setActiveLecture(c.lectures[0]);
    setLoading(false);
  };

  const getDriveEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/file\/d\/([^/]+)/)?.[1];
      return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
    }
    return url;
  };

  if (loading) return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div className="spinner" />
      </div>
    </div>
  );

  if (!course) return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2>Course not found</h2>
        <Link href="/courses" className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Courses</Link>
      </div>
    </div>
  );

  const isFolderLink = activeLecture?.driveUrl?.includes('folders');

  return (
    <div>
      <style>{`
        @media (max-width: 900px) {
          .course-layout { grid-template-columns: 1fr !important; }
          .course-sidebar { order: -1; }
        }
        @media (max-width: 640px) {
          .lecture-sidebar-btn { display: flex !important; }
        }
      `}</style>

      <Navbar />

      <div className="container" style={{ padding: 'clamp(16px, 3vw, 32px) 24px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <Link href="/courses" style={{ color: 'var(--text-muted)' }}>Courses</Link>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-secondary)', wordBreak: 'break-word' }}>{course.title}</span>
        </div>

        <div
          className="course-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '20px',
            alignItems: 'start',
          }}
        >
          {/* Main Content */}
          <div style={{ minWidth: 0 }}>
            {/* Video Player */}
            <div style={S.playerWrap}>
              {user && activeLecture ? (
                isFolderLink ? (
                  <div style={S.centeredContent}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📂</div>
                    <h3 style={{ marginBottom: '8px' }}>Course Materials</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
                      This lecture uses a Google Drive folder.
                    </p>
                    <a
                      href={activeLecture.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      📂 Open Materials
                    </a>
                  </div>
                ) : (
                  <iframe
                    src={getDriveEmbedUrl(activeLecture.driveUrl)}
                    style={S.iframe}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title={activeLecture.title}
                  />
                )
              ) : (
                <div style={S.centeredContent}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔐</div>
                  <h2 style={{ marginBottom: '8px', fontSize: '1.4rem' }}>Sign In to Watch</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '300px', textAlign: 'center', fontSize: '0.9rem' }}>
                    Create a free account to access all lectures instantly.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link href="/auth/signup" className="btn btn-primary">
                      ✨ Sign Up Free
                    </Link>
                    <Link href="/auth/login" className="btn btn-outline">
                      🔐 Login
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Active Lecture Title */}
            {user && activeLecture && (
              <div style={S.lectureInfo}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <h2 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', flex: 1 }}>{activeLecture.title}</h2>
                  {/* Mobile: toggle lecture list */}
                  <button
                    className="lecture-sidebar-btn"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                      display: 'none',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    📋 {sidebarOpen ? 'Hide Lectures' : 'All Lectures'}
                  </button>
                </div>
                {activeLecture.description && (
                  <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.9rem' }}>
                    {activeLecture.description}
                  </p>
                )}
              </div>
            )}

            {/* Mobile Lecture List (shows inline on small screens) */}
            {sidebarOpen && user && (
              <div style={{ ...S.lectureCard, marginTop: '16px' }}>
                <h3 style={{ marginBottom: '14px', fontSize: '0.95rem' }}>📋 Course Content</h3>
                <LectureList
                  lectures={course.lectures}
                  activeLecture={activeLecture}
                  onSelect={(l) => { setActiveLecture(l); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="course-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Course Info Card */}
            <div className="card" style={{ padding: '20px' }}>
              {course.thumbnailUrl && !imgError && (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  style={{ width: '100%', borderRadius: '10px', marginBottom: '16px', aspectRatio: '16/9', objectFit: 'cover' }}
                  onError={() => setImgError(true)}
                />
              )}
              <h1 style={{ fontSize: '1.05rem', marginBottom: '8px', lineHeight: 1.3 }}>{course.title}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>👨‍🏫 {course.teacher}</p>
              <p style={{ color: 'var(--accent-light)', fontSize: '0.82rem', marginBottom: '14px' }}>🏷️ {course.category}</p>

              {/* Access badge */}
              <div style={S.accessBadge}>
                {user ? '✅ Full Access — Free' : '🔓 Free for all students'}
              </div>

              {!user && (
                <Link
                  href="/auth/signup"
                  className="btn btn-primary"
                  style={{ display: 'flex', justifyContent: 'center', padding: '13px', marginTop: '14px', width: '100%' }}
                >
                  🚀 Start Learning Free
                </Link>
              )}

              {!user && (
                <Link
                  href="/auth/login"
                  className="btn btn-outline"
                  style={{ display: 'flex', justifyContent: 'center', padding: '11px', marginTop: '10px', width: '100%', fontSize: '0.85rem' }}
                >
                  Already have an account? Login
                </Link>
              )}

              <div style={S.courseMeta}>
                <div style={S.metaItem}><span>📖</span>{course.lectures?.length || 0} Lectures</div>
                <div style={S.metaItem}><span>⭐</span>Expert Level</div>
                <div style={S.metaItem}><span>📱</span>Mobile Friendly</div>
                <div style={S.metaItem}><span>🆓</span>Always Free</div>
              </div>
            </div>

            {/* Lectures List Card (desktop) */}
            <div style={S.lectureCard}>
              <h3 style={{ marginBottom: '14px', fontSize: '0.95rem' }}>📋 Course Content</h3>
              <LectureList
                lectures={course.lectures}
                activeLecture={activeLecture}
                onSelect={user ? (l) => {
                  setActiveLecture(l);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } : null}
                locked={!user}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LectureList({ lectures, activeLecture, onSelect, locked }) {
  if (!lectures?.length) {
    return <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No lectures added yet.</p>;
  }

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
      {lectures.map((lecture, i) => (
        <div
          key={i}
          onClick={() => !locked && onSelect?.(lecture)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '8px',
            marginBottom: '4px',
            transition: 'background 0.2s',
            cursor: locked ? 'default' : 'pointer',
            background: activeLecture?.title === lecture.title ? 'var(--bg-card-hover)' : 'transparent',
            opacity: locked ? 0.6 : 1,
            border: activeLecture?.title === lecture.title ? '1px solid var(--border-light)' : '1px solid transparent',
          }}
        >
          <span style={{
            width: '24px', height: '24px', borderRadius: '50%',
            background: activeLecture?.title === lecture.title ? 'var(--accent)' : 'var(--bg-input)',
            border: '1px solid var(--border)',
            color: activeLecture?.title === lecture.title ? 'white' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
          }}>
            {locked ? '🔒' : activeLecture?.title === lecture.title ? '▶' : i + 1}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '0.86rem', fontWeight: 500,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {lecture.title}
            </div>
            {lecture.duration && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lecture.duration}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const S = {
  playerWrap: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%', // 16:9 ratio
    background: '#000',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    border: '1px solid var(--border)',
  },
  iframe: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    border: 'none',
  },
  centeredContent: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '24px',
    textAlign: 'center',
  },
  lectureInfo: {
    marginTop: '16px',
    padding: '16px 20px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
  },
  lectureCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
  },
  accessBadge: {
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.3)',
    color: 'var(--success)',
    padding: '8px 14px',
    borderRadius: 'var(--radius)',
    fontSize: '0.85rem',
    fontWeight: 600,
    textAlign: 'center',
  },
  courseMeta: {
    marginTop: '16px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  metaItem: {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '0.78rem', color: 'var(--text-secondary)',
    background: 'var(--bg-input)', padding: '8px 10px', borderRadius: '8px',
  },
};
