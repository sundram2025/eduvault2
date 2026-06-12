// pages/admin/users.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/AuthContext';
import { getUsers, blockUser, updateUser } from '../../lib/db';
import { AdminSidebarComponent } from './index';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [dataLoading, setDataLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && userProfile?.role !== 'admin') router.push('/auth/admin-login');
    if (!loading && userProfile?.role === 'admin') fetchUsers();
  }, [loading, userProfile]);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
    setDataLoading(false);
  };

  const handleBlock = async (uid, isBlocked) => {
    try {
      await blockUser(uid, isBlocked);
      toast.success(isBlocked ? 'User blocked' : 'User unblocked');
      fetchUsers();
    } catch { toast.error('Action failed'); }
  };

  const handleRoleChange = async (uid, role) => {
    try {
      await updateUser(uid, { role });
      toast.success(`Role updated to ${role}`);
      fetchUsers();
    } catch { toast.error('Failed to update role'); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const students = users.filter(u => u.role !== 'admin');
  const admins = users.filter(u => u.role === 'admin');
  const blocked = users.filter(u => u.isBlocked);

  return (
    <div className="admin-layout">
      <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <AdminSidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} active="/admin/users" />

      <div className="admin-main">
        <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', marginBottom: '24px', paddingTop: '8px' }}>👥 User Management</h1>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '24px' }}>
          {[
            { label: 'Total Users', value: users.length, color: 'var(--accent-light)' },
            { label: 'Students', value: students.length, color: 'var(--text-primary)' },
            { label: 'Admins', value: admins.length, color: 'var(--gold)' },
            { label: 'Blocked', value: blocked.length, color: 'var(--danger)' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="🔍 Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: '360px' }}
          />
        </div>

        {/* Table */}
        {dataLoading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><p>No users found.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={S.avatar}>{u.name?.[0]?.toUpperCase() || '?'}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.phone || '—'}</td>
                    <td>
                      <select
                        value={u.role || 'student'}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        style={{
                          background: 'var(--bg-input)', border: '1px solid var(--border)',
                          color: u.role === 'admin' ? 'var(--gold)' : 'var(--text-secondary)',
                          padding: '4px 8px', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer',
                        }}
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: '12px',
                        fontSize: '0.75rem', fontWeight: 700,
                        background: u.isBlocked ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
                        color: u.isBlocked ? 'var(--danger)' : 'var(--success)',
                        border: `1px solid ${u.isBlocked ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
                      }}>
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {u.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </td>
                    <td>
                      <button
                        onClick={() => handleBlock(u.id, !u.isBlocked)}
                        className={u.isBlocked ? 'btn btn-success' : 'btn btn-danger'}
                        style={{ padding: '5px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                      >
                        {u.isBlocked ? '🔓 Unblock' : '🔒 Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  avatar: {
    width: '34px', height: '34px', borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
  },
};
