// pages/auth/signup.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await signup(form.email, form.password, form.name, form.phone);
      toast.success('Account created! Welcome to EduVault 🎉');
      router.push('/courses');
    } catch (err) {
      toast.error(err.message.includes('email-already-in-use') ? 'Email already registered' : 'Signup failed. Try again.');
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

        <h1 style={S.title}>Create Account</h1>
        <p style={S.sub}>Start your free learning journey today 🎓</p>

        {/* Free access highlight */}
        <div style={S.freeBadge}>✅ 100% Free — No payment required</div>

        <form onSubmit={handleSubmit}>
          {[
            { name:'name', label:'Full Name *', type:'text', placeholder:'Your full name' },
            { name:'email', label:'Email Address *', type:'email', placeholder:'you@example.com' },
            { name:'phone', label:'Phone Number', type:'tel', placeholder:'+91 XXXXX XXXXX' },
            { name:'password', label:'Password *', type:'password', placeholder:'Min. 6 characters' },
            { name:'confirm', label:'Confirm Password *', type:'password', placeholder:'Re-enter password' },
          ].map(f => (
            <div key={f.name} className="form-group">
              <label className="label">{f.label}</label>
              <input
                name={f.name} type={f.type} className="input-field"
                placeholder={f.placeholder}
                value={form[f.name]} onChange={handleChange}
                autoComplete={f.name === 'confirm' ? 'new-password' : f.name}
              />
            </div>
          ))}

          <button
            type="submit" className="btn btn-primary" disabled={loading}
            style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:'0.95rem', marginTop:'8px' }}
          >
            {loading ? <span className="spinner" style={{ width:20,height:20,borderWidth:2 }} /> : '🚀 Create Free Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', fontSize:'0.9rem', color:'var(--text-secondary)', marginTop:'20px' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color:'var(--accent-light)', fontWeight:600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px', position:'relative' },
  bg: { position:'fixed', inset:0, background:'radial-gradient(ellipse at center, rgba(108,99,255,0.1) 0%, transparent 60%)', pointerEvents:'none' },
  card: { background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'40px', width:'100%', maxWidth:'440px', position:'relative' },
  logo: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'28px', fontSize:'1.4rem' },
  logoText: { fontFamily:'Syne, sans-serif', fontWeight:800, background:'linear-gradient(135deg, #6c63ff, #f5c842)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' },
  title: { fontSize:'clamp(1.3rem, 4vw, 1.6rem)', marginBottom:'6px' },
  sub: { color:'var(--text-secondary)', marginBottom:'16px', fontSize:'0.9rem' },
  freeBadge: {
    background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)',
    color:'var(--success)', padding:'8px 14px', borderRadius:'var(--radius)',
    fontSize:'0.85rem', fontWeight:600, textAlign:'center', marginBottom:'20px',
  },
};
