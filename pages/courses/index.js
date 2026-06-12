// pages/courses/index.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/shared/Navbar';
import { getCourses } from '../../lib/db';
import { useAuth } from '../../lib/AuthContext';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => { fetchCourses(); }, []);

  useEffect(() => {
    let result = courses;
    if (search) result = result.filter(c =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.teacher?.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== 'All') result = result.filter(c => c.category === category);
    setFiltered(result);
  }, [search, category, courses]);

  const fetchCourses = async () => {
    const data = await getCourses();
    setCourses(data);
    setFiltered(data);
    setLoading(false);
  };

  const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))];

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: 'clamp(24px, 4vw, 40px) 24px' }}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '6px' }}>
              Explore <span className="gradient-text">Courses</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {courses.length} course{courses.length !== 1 ? 's' : ''} available — all free
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={S.filters}>
          <input
            type="text"
            className="input-field"
            placeholder="🔍 Search courses or teachers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: '380px', fontSize: '0.9rem' }}
          />
          <div style={S.categoryBtns}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  ...S.catBtn,
                  background: category === cat ? 'var(--accent)' : 'var(--bg-card)',
                  color: category === cat ? 'white' : 'var(--text-secondary)',
                  border: category === cat ? '1px solid var(--accent)' : '1px solid var(--border)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>🔍</div>
            <p>No courses found. Try a different search.</p>
          </div>
        ) : (
          <div style={S.grid}>
            {filtered.map(course => (
              <CourseCard key={course.id} course={course} isLoggedIn={!!user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course, isLoggedIn }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
      <div style={S.card}>
        {/* Thumbnail */}
        <div style={S.thumbWrap}>
          {course.thumbnailUrl && !imgError ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              style={S.thumb}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={S.thumbPlaceholder}>
              <span style={{ fontSize: '3rem' }}>📚</span>
            </div>
          )}
          {/* Free badge */}
          <div style={S.thumbOverlay}>
            <span style={S.freeBadge}>✓ Free</span>
          </div>
          <div style={S.categoryTag}>{course.category || 'General'}</div>
        </div>

        {/* Info */}
        <div style={S.cardBody}>
          <h3 style={S.cardTitle}>{course.title}</h3>
          <p style={S.cardTeacher}>👨‍🏫 {course.teacher}</p>
          <p style={S.cardDesc}>
            {course.description?.slice(0, 90)}{course.description?.length > 90 ? '...' : ''}
          </p>

          <div style={S.cardFooter}>
            <div style={S.lectureCount}>
              📖 {course.lectures?.length || 0} lectures
            </div>
            <div style={S.freeTag}>🎓 Free Access</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

const S = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  filters: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginBottom: '28px',
  },
  categoryBtns: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  catBtn: {
    padding: '7px 14px',
    borderRadius: '20px',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
    gap: '20px',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'block',
    height: '100%',
  },
  thumbWrap: {
    position: 'relative',
    aspectRatio: '16/9',
    overflow: 'hidden',
    background: 'var(--bg-secondary)',
  },
  thumb: { width: '100%', height: '100%', objectFit: 'cover' },
  thumbPlaceholder: {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-input))',
  },
  thumbOverlay: { position: 'absolute', top: '10px', right: '10px' },
  freeBadge: {
    background: 'var(--success)',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  categoryTag: {
    position: 'absolute', bottom: '10px', left: '10px',
    background: 'rgba(0,0,0,0.7)', color: 'var(--accent-light)',
    padding: '3px 10px', borderRadius: '20px',
    fontSize: '0.75rem', fontWeight: 600, backdropFilter: 'blur(4px)',
  },
  cardBody: { padding: '16px 20px 20px' },
  cardTitle: { fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.3 },
  cardTeacher: { fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' },
  cardDesc: { fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px', minHeight: '38px' },
  cardFooter: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: '12px', borderTop: '1px solid var(--border)',
  },
  lectureCount: { fontSize: '0.8rem', color: 'var(--text-secondary)' },
  freeTag: { fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'var(--success)', fontSize: '0.88rem' },
};
