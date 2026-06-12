// pages/admin/courses/add.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../lib/AuthContext';
import { addCourse } from '../../../lib/db';
import { storage } from '../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AdminSidebarComponent } from '../index';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES = ['Marketing/Business', 'AI/Technology', 'Finance', 'Personal Development', 'Design', 'Programming', 'Health', 'Other'];

export default function AddCourse() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', teacher: '', description: '', category: 'Marketing/Business',
    thumbnailUrl: '', // URL-based thumbnail
  });
  const [lectures, setLectures] = useState([]);
  const [newLecture, setNewLecture] = useState({ title: '', driveUrl: '', duration: '', description: '' });
  const [thumbMode, setThumbMode] = useState('url'); // 'url' or 'upload'
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleThumbFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return; }
    setThumbnail(file);
    const reader = new FileReader();
    reader.onload = (ev) => setThumbPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const addLecture = () => {
    if (!newLecture.title || !newLecture.driveUrl) return toast.error('Title and Drive URL required');
    setLectures([...lectures, { ...newLecture, id: uuidv4() }]);
    setNewLecture({ title: '', driveUrl: '', duration: '', description: '' });
    toast.success('Lecture added ✓');
  };

  const removeLecture = (id) => setLectures(lectures.filter(l => l.id !== id));

  const moveLecture = (index, direction) => {
    const newList = [...lectures];
    const target = index + direction;
    if (target < 0 || target >= newList.length) return;
    [newList[index], newList[target]] = [newList[target], newList[index]];
    setLectures(newList);
  };

  const handleSave = async () => {
    if (!form.title || !form.teacher) return toast.error('Title and teacher are required');
    setSaving(true);
    try {
      let thumbnailUrl = form.thumbnailUrl.trim();

      // If file upload chosen
      if (thumbMode === 'upload' && thumbnail) {
        const storageRef = ref(storage, `thumbnails/${uuidv4()}`);
        await uploadBytes(storageRef, thumbnail);
        thumbnailUrl = await getDownloadURL(storageRef);
      }

      await addCourse({
        title: form.title,
        teacher: form.teacher,
        description: form.description,
        category: form.category,
        thumbnailUrl,
        lectures,
        isFree: true,
      });

      toast.success('Course created! 🎉');
      router.push('/admin/courses');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create course');
    }
    setSaving(false);
  };

  const previewUrl = thumbMode === 'url' ? form.thumbnailUrl : thumbPreview;

  return (
    <div className="admin-layout">
      <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <AdminSidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} active="/admin/courses" />

      <div className="admin-main">
        <div style={S.pageHeader}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', marginBottom: '4px' }}>+ Add New Course</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fill in course details below</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={() => router.back()}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : '💾 Save Course'}
            </button>
          </div>
        </div>

        <div style={S.grid}>
          {/* Left: Course Info */}
          <div>
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1rem' }}>📋 Course Information</h3>

              <div className="form-group">
                <label className="label">Course Title *</label>
                <input name="title" type="text" className="input-field" placeholder="e.g., Low Cost Marketing Amplifier" value={form.title} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label className="label">Teacher Name *</label>
                <input name="teacher" type="text" className="input-field" placeholder="e.g., Dr. Vivek Bindra" value={form.teacher} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea name="description" className="input-field" placeholder="Course description..." value={form.description} onChange={handleFormChange} rows={4} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="label">Category</label>
                <select name="category" className="input-field" value={form.category} onChange={handleFormChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="card">
              <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>🖼️ Course Thumbnail</h3>

              {/* Mode selector */}
              <div style={S.tabBar}>
                <button
                  onClick={() => setThumbMode('url')}
                  style={{ ...S.tabBtn, ...(thumbMode === 'url' ? S.tabBtnActive : {}) }}
                >
                  🔗 Image URL
                </button>
                <button
                  onClick={() => setThumbMode('upload')}
                  style={{ ...S.tabBtn, ...(thumbMode === 'upload' ? S.tabBtnActive : {}) }}
                >
                  📁 Upload File
                </button>
              </div>

              {thumbMode === 'url' ? (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Thumbnail Image URL</label>
                  <input
                    name="thumbnailUrl"
                    type="url"
                    className="input-field"
                    placeholder="https://example.com/thumbnail.jpg"
                    value={form.thumbnailUrl}
                    onChange={handleFormChange}
                  />
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Paste any public image URL (Google Drive, Imgur, etc.)
                  </p>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="thumbUpload"
                    style={S.uploadArea}
                  >
                    {thumbPreview ? (
                      <img src={thumbPreview} alt="Thumbnail" style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', maxHeight: '180px' }} />
                    ) : (
                      <>
                        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🖼️</div>
                        <p style={{ color: 'var(--text-secondary)' }}>Click to upload thumbnail</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Recommended: 1280×720px, max 5MB</p>
                      </>
                    )}
                  </label>
                  <input id="thumbUpload" type="file" accept="image/*" onChange={handleThumbFileChange} style={{ display: 'none' }} />
                </div>
              )}

              {/* Preview */}
              {previewUrl && (
                <div style={{ marginTop: '12px' }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Preview:</p>
                  <img
                    src={previewUrl}
                    alt="Thumbnail preview"
                    style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', aspectRatio: '16/9', border: '1px solid var(--border)' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right: Lectures */}
          <div>
            <div className="card">
              <h3 style={{ marginBottom: '20px', fontSize: '1rem' }}>📖 Lectures</h3>

              {/* Add Lecture Form */}
              <div style={S.lectureForm}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '14px', color: 'var(--text-secondary)' }}>+ Add Lecture</h4>
                <div className="form-group">
                  <label className="label">Lecture Title *</label>
                  <input type="text" className="input-field" placeholder="e.g., Introduction to Marketing" value={newLecture.title} onChange={e => setNewLecture({ ...newLecture, title: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="label">Google Drive Link *</label>
                  <input type="url" className="input-field" placeholder="https://drive.google.com/..." value={newLecture.driveUrl} onChange={e => setNewLecture({ ...newLecture, driveUrl: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="label">Duration</label>
                  <input type="text" className="input-field" placeholder="e.g., 45 min" value={newLecture.duration} onChange={e => setNewLecture({ ...newLecture, duration: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="label">Description (optional)</label>
                  <input type="text" className="input-field" placeholder="Brief description..." value={newLecture.description} onChange={e => setNewLecture({ ...newLecture, description: e.target.value })} />
                </div>
                <button className="btn btn-outline" onClick={addLecture} style={{ width: '100%', justifyContent: 'center' }}>
                  + Add Lecture
                </button>
              </div>

              {/* Lecture List */}
              <div style={{ marginTop: '20px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {lectures.length} lecture{lectures.length !== 1 ? 's' : ''} added
                </p>
                {lectures.map((lecture, i) => (
                  <div key={lecture.id} style={S.lectureItem}>
                    <span style={S.lectureNum}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lecture.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lecture.driveUrl}
                      </div>
                      {lecture.duration && <div style={{ fontSize: '0.74rem', color: 'var(--accent-light)' }}>{lecture.duration}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      <button onClick={() => moveLecture(i, -1)} style={S.iconBtn} title="Move up">↑</button>
                      <button onClick={() => moveLecture(i, 1)} style={S.iconBtn} title="Move down">↓</button>
                      <button onClick={() => removeLecture(lecture.id)} style={{ ...S.iconBtn, color: 'var(--danger)' }} title="Remove">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  pageHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '28px', flexWrap: 'wrap', gap: '12px', paddingTop: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))',
    gap: '24px', alignItems: 'start',
  },
  tabBar: {
    display: 'flex', gap: '4px', marginBottom: '16px',
    background: 'var(--bg-input)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '4px',
  },
  tabBtn: {
    flex: 1, padding: '7px 12px', borderRadius: '8px',
    fontSize: '0.82rem', fontWeight: 600, border: 'none',
    cursor: 'pointer', background: 'transparent', color: 'var(--text-secondary)',
    transition: 'all 0.2s',
  },
  tabBtnActive: { background: 'var(--accent)', color: 'white' },
  uploadArea: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    border: '2px dashed var(--border)', borderRadius: 'var(--radius)',
    padding: '24px', textAlign: 'center', cursor: 'pointer',
    minHeight: '130px', transition: 'border-color 0.2s',
  },
  lectureForm: {
    background: 'var(--bg-input)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '16px',
  },
  lectureItem: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
    background: 'var(--bg-input)', borderRadius: '8px', marginBottom: '8px',
    border: '1px solid var(--border)',
  },
  lectureNum: {
    width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
  },
  iconBtn: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    color: 'var(--text-secondary)', width: '28px', height: '28px',
    borderRadius: '6px', cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem',
  },
};
