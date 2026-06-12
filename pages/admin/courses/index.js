// pages/admin/courses/index.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../../lib/AuthContext';
import { getCourses, deleteCourse } from '../../../lib/db';
import { AdminSidebarComponent } from '../index';
import toast from 'react-hot-toast';

export default function AdminCourses() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && userProfile?.role !== 'admin') router.push('/auth/admin-login');
    if (!loading && userProfile?.role === 'admin') fetchCourses();
  }, [loading, userProfile]);

  const fetchCourses = async () => {
    const data = await getCourses();
    setCourses(data);
    setDataLoading(false);
  };

  const handleDelete = async () => {
    try {
      await deleteCourse(deleteId);
      toast.success('Course deleted');
      setDeleteId(null);
      fetchCourses();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="admin-layout">
      <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <AdminSidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} active="/admin/courses" />

      <div className="admin-main">
        <div style={S.pageHeader}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', marginBottom: '4px' }}>📚 Course Management</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{courses.length} courses</p>
          </div>
          <Link href="/admin/courses/add" className="btn btn-primary" style={{ flexShrink: 0 }}>
            + Add New Course
          </Link>
        </div>

        {dataLoading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
            <h3 style={{ marginBottom: '8px' }}>No courses yet</h3>
            <Link href="/admin/courses/add" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Create First Course
            </Link>
          </div>
        ) : (
          <div style={S.grid}>
            {courses.map(course => (
              <div key={course.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--bg-input)', overflow: 'hidden' }}>
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div style={{
                    width: '100%', height: '100%',
                    display: course.thumbnailUrl ? 'none' : 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
                  }}>📚</div>
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '0.93rem', marginBottom: '6px', lineHeight: 1.3 }}>{course.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    👨‍🏫 {course.teacher}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent-light)', marginBottom: '10px' }}>
                    🏷️ {course.category}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    <span>📖 {course.lectures?.length || 0} lectures</span>
                    <span>👥 {course.enrollments || 0} enrolled</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      href={`/admin/courses/edit/${course.id}`}
                      className="btn btn-outline"
                      style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: '0.82rem' }}
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      style={{ flex: 1, padding: '8px', fontSize: '0.82rem' }}
                      onClick={() => setDeleteId(course.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="overlay">
          <div className="modal" style={{ maxWidth: '380px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ marginBottom: '8px' }}>Delete Course?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-outline" onClick={() => setDeleteId(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} style={{ flex: 1, justifyContent: 'center' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Keep exporting AdminSidebar for backward compat (used in other admin pages)
export function AdminSidebar() {
  return <AdminSidebarComponent open={true} onClose={() => {}} />;
}

const S = {
  pageHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '28px', flexWrap: 'wrap', gap: '12px',
    paddingTop: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
    gap: '20px',
  },
};
