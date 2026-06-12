// pages/404.js
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '24px' }}>
      <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🔍</div>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '3rem', marginBottom: '8px' }}>404</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>This page doesn&apos;t exist.</p>
      <Link href="/" className="btn btn-primary">← Back to Home</Link>
    </div>
  );
}
