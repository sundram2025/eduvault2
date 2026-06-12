// pages/admin/courses/edit/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../lib/AuthContext';
import { getCourse, updateCourse } from '../../../../lib/db';
import { storage } from '../../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AdminSidebarComponent } from '../../index';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES = ['Marketing/Business','AI/Technology','Finance','Personal Development','Design','Programming','Health','Other'];

export default function EditCourse() {
  const router = useRouter();
  const { id } = router.query;
  const { userProfile, loading } = useAuth();
  const [form, setForm] = useState({ title:'', teacher:'', description:'', category:'', thumbnailUrl:'' });
  const [lectures, setLectures] = useState([]);
  const [newLecture, setNewLecture] = useState({ title:'', driveUrl:'', duration:'', description:'' });
  const [thumbMode, setThumbMode] = useState('url');
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbFilePreview, setThumbFilePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && userProfile?.role !== 'admin') router.push('/auth/admin-login');
    if (id) fetchCourse();
  }, [id, loading, userProfile]);

  const fetchCourse = async () => {
    const course = await getCourse(id);
    if (course) {
      setForm({
        title: course.title || '',
        teacher: course.teacher || '',
        description: course.description || '',
        category: course.category || 'Marketing/Business',
        thumbnailUrl: course.thumbnailUrl || '',
      });
      setLectures(course.lectures || []);
    }
  };

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleThumbFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return; }
    setThumbFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setThumbFilePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const addLecture = () => {
    if (!newLecture.title || !newLecture.driveUrl) return toast.error('Title and Drive URL required');
    setLectures([...lectures, { ...newLecture, id: uuidv4() }]);
    setNewLecture({ title:'', driveUrl:'', duration:'', description:'' });
    toast.success('Lecture added ✓');
  };

  const removeLecture = (idx) => setLectures(lectures.filter((_, i) => i !== idx));

  const moveLecture = (index, direction) => {
    const newList = [...lectures];
    const target = index + direction;
    if (target < 0 || target >= newList.length) return;
    [newList[index], newList[target]] = [newList[target], newList[index]];
    setLectures(newList);
  };

  const handleSave = async () => {
    if (!form.title || !form.teacher) return toast.error('Title and teacher required');
    setSaving(true);
    try {
      let thumbnailUrl = form.thumbnailUrl.trim();
      if (thumbMode === 'upload' && thumbFile) {
        const storageRef = ref(storage, `thumbnails/${uuidv4()}`);
        await uploadBytes(storageRef, thumbFile);
        thumbnailUrl = await getDownloadURL(storageRef);
      }
      await updateCourse(id, { ...form, thumbnailUrl, lectures, isFree: true });
      toast.success('Course updated! ✅');
      router.push('/admin/courses');
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
    setSaving(false);
  };

  const previewUrl = thumbMode === 'url' ? form.thumbnailUrl : thumbFilePreview;

  return (
    <div className="admin-layout">
      <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <AdminSidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} active="/admin/courses" />

      <div className="admin-main">
        <div style={S.pageHeader}>
          <h1 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)' }}>✏️ Edit Course</h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={() => router.back()}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <span className="spinner" style={{ width:18,height:18,borderWidth:2 }} /> : '💾 Save Changes'}
            </button>
          </div>
        </div>

        <div style={S.grid}>
          {/* Left */}
          <div>
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1rem' }}>📋 Course Info</h3>
              <div className="form-group">
                <label className="label">Course Title *</label>
                <input name="title" type="text" className="input-field" value={form.title} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label className="label">Teacher Name *</label>
                <input name="teacher" type="text" className="input-field" value={form.teacher} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea name="description" className="input-field" value={form.description} onChange={handleFormChange} rows={4} style={{ resize:'vertical' }} />
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
              <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>🖼️ Thumbnail</h3>
              <div style={S.tabBar}>
                {['url','upload'].map(m => (
                  <button key={m} onClick={() => setThumbMode(m)}
                    style={{ ...S.tabBtn, ...(thumbMode === m ? S.tabBtnActive : {}) }}>
                    {m === 'url' ? '🔗 Image URL' : '📁 Upload File'}
                  </button>
                ))}
              </div>

              {thumbMode === 'url' ? (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Image URL</label>
                  <input name="thumbnailUrl" type="url" className="input-field"
                    placeholder="https://example.com/image.jpg"
                    value={form.thumbnailUrl} onChange={handleFormChange} />
                </div>
              ) : (
                <label htmlFor="thumbEdit" style={S.uploadArea}>
                  {thumbFilePreview ? (
                    <img src={thumbFilePreview} alt="preview" style={{ width:'100%', borderRadius:'8px', maxHeight:'180px', objectFit:'cover' }} />
                  ) : (
                    <>
                      <div style={{ fontSize:'2rem', marginBottom:'8px' }}>🖼️</div>
                      <p style={{ color:'var(--text-secondary)' }}>Click to upload new image</p>
                      <p style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>Max 5MB</p>
                    </>
                  )}
                </label>
              )}
              <input id="thumbEdit" type="file" accept="image/*" onChange={handleThumbFileChange} style={{ display:'none' }} />

              {previewUrl && (
                <div style={{ marginTop:'12px' }}>
                  <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'6px' }}>Current thumbnail:</p>
                  <img src={previewUrl} alt="thumbnail" style={{ width:'100%', borderRadius:'8px', objectFit:'cover', aspectRatio:'16/9', border:'1px solid var(--border)' }}
                    onError={e => { e.target.style.display='none'; }} />
                </div>
              )}
            </div>
          </div>

          {/* Right: Lectures */}
          <div className="card">
            <h3 style={{ marginBottom: '20px', fontSize: '1rem' }}>📖 Lectures ({lectures.length})</h3>
            <div style={S.lectureForm}>
              <h4 style={{ fontSize:'0.88rem', color:'var(--text-secondary)', marginBottom:'12px' }}>+ Add New Lecture</h4>
              <div className="form-group">
                <label className="label">Title *</label>
                <input type="text" className="input-field" placeholder="Lecture title"
                  value={newLecture.title} onChange={e => setNewLecture({ ...newLecture, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="label">Drive URL *</label>
                <input type="url" className="input-field" placeholder="https://drive.google.com/..."
                  value={newLecture.driveUrl} onChange={e => setNewLecture({ ...newLecture, driveUrl: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="label">Duration</label>
                <input type="text" className="input-field" placeholder="e.g. 30 min"
                  value={newLecture.duration} onChange={e => setNewLecture({ ...newLecture, duration: e.target.value })} />
              </div>
              <button className="btn btn-outline" onClick={addLecture} style={{ width:'100%', justifyContent:'center' }}>
                + Add Lecture
              </button>
            </div>

            <div style={{ marginTop: '16px' }}>
              {lectures.length === 0 && (
                <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', textAlign:'center', padding:'16px' }}>
                  No lectures yet. Add one above.
                </p>
              )}
              {lectures.map((lecture, i) => (
                <div key={i} style={S.lectureItem}>
                  <span style={S.lectureNum}>{i + 1}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'0.88rem', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {lecture.title}
                    </div>
                    <div style={{ fontSize:'0.74rem', color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {lecture.driveUrl}
                    </div>
                    {lecture.duration && <div style={{ fontSize:'0.74rem', color:'var(--accent-light)' }}>{lecture.duration}</div>}
                  </div>
                  <div style={{ display:'flex', gap:'4px', flexShrink:0 }}>
                    <button onClick={() => moveLecture(i, -1)} style={S.iconBtn}>↑</button>
                    <button onClick={() => moveLecture(i, 1)} style={S.iconBtn}>↓</button>
                    <button onClick={() => removeLecture(i)} style={{ ...S.iconBtn, color:'var(--danger)' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  pageHeader: {
    display:'flex', justifyContent:'space-between', alignItems:'center',
    marginBottom:'28px', flexWrap:'wrap', gap:'12px', paddingTop:'8px',
  },
  grid: {
    display:'grid',
    gridTemplateColumns:'repeat(auto-fill, minmax(min(100%, 400px), 1fr))',
    gap:'24px', alignItems:'start',
  },
  tabBar: {
    display:'flex', gap:'4px', marginBottom:'16px',
    background:'var(--bg-input)', border:'1px solid var(--border)',
    borderRadius:'var(--radius)', padding:'4px',
  },
  tabBtn: {
    flex:1, padding:'7px 12px', borderRadius:'8px',
    fontSize:'0.82rem', fontWeight:600, border:'none',
    cursor:'pointer', background:'transparent', color:'var(--text-secondary)',
    transition:'all 0.2s',
  },
  tabBtnActive: { background:'var(--accent)', color:'white' },
  uploadArea: {
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
    border:'2px dashed var(--border)', borderRadius:'var(--radius)',
    padding:'24px', textAlign:'center', cursor:'pointer', minHeight:'130px',
  },
  lectureForm: {
    background:'var(--bg-input)', border:'1px solid var(--border)',
    borderRadius:'var(--radius)', padding:'14px',
  },
  lectureItem: {
    display:'flex', alignItems:'center', gap:'10px', padding:'10px',
    background:'var(--bg-input)', borderRadius:'8px', marginBottom:'8px',
    border:'1px solid var(--border)',
  },
  lectureNum: {
    width:'24px', height:'24px', borderRadius:'50%', background:'var(--accent)',
    color:'white', display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:'0.72rem', fontWeight:700, flexShrink:0,
  },
  iconBtn: {
    background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-secondary)',
    width:'28px', height:'28px', borderRadius:'6px', cursor:'pointer',
    display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem',
  },
};
