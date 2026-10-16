import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [now, setNow] = useState(new Date());

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      toast.success('You have been logged out successfully');
      navigate('/login');
    } catch {
      navigate('/login');
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  const initials = user?.fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—';

  return (
    <div className="home-page">
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-brand-icon">🔐</div>
          <span className="navbar-brand-name">SecureAuth</span>
        </div>

        <div className="navbar-actions">
          <div style={{
            color: 'var(--text-subtle)',
            fontSize: '12px',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {now.toLocaleTimeString()}
          </div>
          <button
            id="logout-btn"
            className="btn-logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {loggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="home-hero">
        <div className="home-avatar">{initials}</div>
        <p className="home-welcome">Welcome back 👋</p>
        <h1 className="home-name">{user?.fullName || 'User'}</h1>
        <p className="home-tagline">
          You're securely authenticated. Here's your profile overview.
        </p>
      </div>

      {/* ── Info Cards ── */}
      <div className="home-cards">
        <div className="info-card" id="card-email">
          <div className="info-card-icon icon-blue">✉️</div>
          <div className="info-card-label">Email Address</div>
          <div className="info-card-value">{user?.email || '—'}</div>
        </div>

        <div className="info-card" id="card-mobile">
          <div className="info-card-icon icon-green">📱</div>
          <div className="info-card-label">Mobile Number</div>
          <div className="info-card-value">{user?.mobileNumber || '—'}</div>
        </div>

        <div className="info-card" id="card-member-since">
          <div className="info-card-icon icon-pink">📅</div>
          <div className="info-card-label">Member Since</div>
          <div className="info-card-value">{memberSince}</div>
        </div>

        <div className="info-card" id="card-status">
          <div className="info-card-icon icon-gold">🛡️</div>
          <div className="info-card-label">Account Status</div>
          <div className="info-card-value" style={{ color: 'var(--success)' }}>
            ● Active &amp; Verified
          </div>
        </div>
      </div>
    </div>
  );
}
