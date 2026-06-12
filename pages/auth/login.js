// pages/auth/login.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 🎉');
      setTimeout(() => {
        router.push(router.query.redirect || '/dashboard');
      }, 500);
    } catch (err) {
      toast.error(
        err.message.includes('user-not-found') ? 'Account not found' :
        err.message.includes('wrong-password') ? 'Incorrect password' :
        'Login failed. Try again.'
      );
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
        <Link href="/" style={S.logo}>
          <span>⚡</span>
          <span style={S.logoText}>EduVault</span>
        </Link>

        <h1 style={S.title}>Welcome Back</h1>
        <p style={S.sub}>Sign in to continue your learning journey</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Email Address</label>
            <input
              type="email" className="input-field"
              placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input
              type="password" className="input-field"
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit" className="btn btn-primary" disabled={loading}
            style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:'0.95rem', marginTop:'8px' }}
          >
            {loading ? <span className="spinner" style={{ width:20,height:20,borderWidth:2 }} /> : '🔐 Sign In'}
          </button>
        </form>

        <div style={{ textAlign:'center', margin:'20px 0', color:'var(--text-muted)', fontSize:'0.85rem' }}>or</div>

        <p style={S.switchText}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" style={{ color:'var(--accent-light)', fontWeight:600 }}>Create one free</Link>
        </p>
        <p style={S.adminNote}>
          🛡️ Admin?{' '}
          <Link href="/auth/admin-login" style={{ color:'var(--gold)' }}>Admin Login</Link>
        </p>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px', position:'relative' },
  bg: { position:'fixed', inset:0, background:'radial-gradient(ellipse at center, rgba(108,99,255,0.1) 0%, transparent 60%)', pointerEvents:'none' },
  card: { background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'40px', width:'100%', maxWidth:'420px', position:'relative', animation:'fadeInUp 0.4s ease' },
  logo: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'28px', fontSize:'1.4rem' },
  logoText: { fontFamily:'Syne, sans-serif', fontWeight:800, background:'linear-gradient(135deg, #6c63ff, #f5c842)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' },
  title: { fontSize:'clamp(1.3rem, 4vw, 1.6rem)', marginBottom:'6px' },
  sub: { color:'var(--text-secondary)', marginBottom:'28px', fontSize:'0.9rem' },
  switchText: { textAlign:'center', fontSize:'0.9rem', color:'var(--text-secondary)', marginBottom:'12px' },
  adminNote: { textAlign:'center', fontSize:'0.85rem', color:'var(--text-muted)' },
};
