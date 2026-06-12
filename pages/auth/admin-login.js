// pages/auth/admin-login.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setTimeout(async () => {
        const { getDoc, doc } = await import('firebase/firestore');
        const { db, auth } = await import('../../lib/firebase');
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.data()?.role === 'admin') {
          toast.success('Admin access granted 🛡️');
          router.push('/admin');
        } else {
          toast.error('You do not have admin privileges');
          const { signOut } = await import('firebase/auth');
          signOut(auth);
        }
      }, 800);
    } catch (err) {
      toast.error('Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div style={S.page}>
      <style>{`
        @media (max-width: 480px) {
          .auth-card { padding: 28px 20px !important; }
        }
      `}</style>
      <div style={S.bg} />
      <div className="auth-card" style={S.card}>
        <div style={S.adminBadge}>🛡️ Admin Access</div>
        <h1 style={S.title}>Admin Portal</h1>
        <p style={S.sub}>Restricted access for administrators only</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Admin Email</label>
            <input
              type="email" className="input-field"
              placeholder="admin@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="label">Admin Password</label>
            <input
              type="password" className="input-field"
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" disabled={loading} style={S.submitBtn}>
            {loading ? <span className="spinner" style={{ width:20,height:20,borderWidth:2,borderTopColor:'#1a1000',display:'inline-block' }} /> : '🔐 Admin Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'20px', fontSize:'0.85rem', color:'var(--text-muted)' }}>
          <Link href="/auth/login" style={{ color:'var(--text-secondary)' }}>← Back to Student Login</Link>
        </p>

        <div style={S.setupNote}>
          <strong>Setup:</strong> Register normally, then set <code>role: "admin"</code> in Firestore for that user document.
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px', position:'relative' },
  bg: { position:'fixed', inset:0, background:'radial-gradient(ellipse at center, rgba(245,200,66,0.08) 0%, transparent 60%)', pointerEvents:'none' },
  card: { background:'var(--bg-card)', border:'1px solid rgba(245,200,66,0.3)', borderRadius:'var(--radius-lg)', padding:'40px', width:'100%', maxWidth:'420px' },
  adminBadge: { display:'inline-block', background:'rgba(245,200,66,0.1)', border:'1px solid rgba(245,200,66,0.3)', color:'var(--gold)', padding:'6px 16px', borderRadius:'20px', fontSize:'0.85rem', fontWeight:700, marginBottom:'20px' },
  title: { fontSize:'clamp(1.3rem, 4vw, 1.6rem)', marginBottom:'6px' },
  sub: { color:'var(--text-secondary)', marginBottom:'28px', fontSize:'0.9rem' },
  submitBtn: {
    width:'100%', background:'linear-gradient(135deg, #f5c842, #f0a500)',
    color:'#1a1000', border:'none', borderRadius:'var(--radius)',
    padding:'14px', fontWeight:700, fontSize:'0.95rem', cursor:'pointer',
    marginTop:'8px', display:'flex', alignItems:'center', justifyContent:'center',
    fontFamily:'DM Sans, sans-serif',
  },
  setupNote: { marginTop:'24px', background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'12px 16px', fontSize:'0.8rem', color:'var(--text-secondary)', lineHeight:1.6 },
};
