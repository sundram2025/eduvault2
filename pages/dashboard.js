// pages/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/shared/Navbar';
import { useAuth } from '../lib/AuthContext';
import { getUserEnrollments, getCourse } from '../lib/db';

export default function StudentDashboard() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState({});
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
    if (!loading && user && userProfile?.role === 'admin') router.push('/admin');
  }, [user, loading, userProfile]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    const envs = await getUserEnrollments(user.uid);
    setEnrollments(envs);

    const courseMap = {};
    for (const e of envs) {
      if (!courseMap[e.courseId]) {
        const c = await getCourse(e.courseId);
        if (c) courseMap[e.courseId] = c;
      }
    }
    setCourses(courseMap);
    setDataLoading(false);
  };

  if (loading || dataLoading) return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div className="spinner" />
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: 'clamp(24px, 4vw, 40px) 24px' }}>
        {/* Welcome */}
        <div style={S.welcomeBar}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', marginBottom: '4px' }}>
              Welcome back, <span className="gradient-text">{userProfile?.name?.split(' ')[0] || 'Student'}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Continue your learning journey</p>
          </div>
          <Link href="/courses" className="btn btn-primary" style={{ flexShrink: 0 }}>
            + Explore Courses
          </Link>
        </div>

        {/* Stats */}
        <div style={S.statsGrid}>
          {[
            { icon: '📚', label: 'Enrolled Courses', value: enrollments.length },
            { icon: '🎓', label: 'Free Access', value: '100%' },
            { icon: '▶️', label: 'Learning Now', value: enrollments.length > 0 ? 'Active' : 'Start!' },
            { icon: '🏆', label: 'Status', value: 'Student' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px' }}>
              <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', color: 'var(--text-primary)' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* My Courses */}
        <div style={{ marginTop: '8px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>📚 My Courses</h2>

          {enrollments.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🎓</div>
              <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>No courses yet</h3>
              <p style={{ marginBottom: '24px', fontSize: '0.9rem' }}>
                Browse our free course library and start learning today
              </p>
              <Link href="/courses" className="btn btn-primary">Browse Free Courses</Link>
            </div>
          ) : (
            <div style={S.courseGrid}>
              {enrollments.map(enrollment => {
                const course = courses[enrollment.courseId];
                if (!course) return null;
                return (
                  <div key={enrollment.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                    {/* Thumbnail */}
                    <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                          📚
                        </div>
                      )}
                      <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: 'var(--success)', color: 'white',
                        padding: '3px 10px', borderRadius: '20px',
                        fontSize: '0.72rem', fontWeight: 700,
                      }}>
                        ✓ Enrolled
                      </div>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 style={{ fontSize: '0.93rem', marginBottom: '6px', lineHeight: 1.3 }}>{course.title}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        👨‍🏫 {course.teacher}
                      </p>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        marginBottom: '12px', fontSize: '0.8rem',
                      }}>
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>🆓 Free Access</span>
                        <span style={{ color: 'var(--text-muted)' }}>📖 {course.lectures?.length || 0} lectures</span>
                      </div>
                      <Link
                        href={`/courses/${enrollment.courseId}`}
                        className="btn btn-primary"
                        style={{ display: 'flex', justifyContent: 'center', padding: '10px', fontSize: '0.85rem', width: '100%' }}
                      >
                        ▶ Continue Learning
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Discover More */}
        {enrollments.length > 0 && (
          <div style={S.discoverBanner}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Discover More Courses</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>All courses are free — explore and keep learning</p>
            </div>
            <Link href="/courses" className="btn btn-outline" style={{ flexShrink: 0 }}>
              Browse All →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  welcomeBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
    gap: '20px',
  },
  discoverBanner: {
    marginTop: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(245,200,66,0.04))',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    flexWrap: 'wrap',
    gap: '16px',
  },
};
