import { useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const STEPS = ['email', 'otp', 'reset'];

const EyeIcon = ({ open }) => open
  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

export default function ForgotPasswordModal({ onClose }) {
  const [step, setStep]       = useState(0);   // 0=email, 1=otp, 2=reset
  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [newPwd, setNewPwd]   = useState('');
  const [confirmPwd, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [error, setError]     = useState('');

  // ── Step 1: request OTP ─────────────────────────────────────────────────
  async function handleRequestOtp(e) {
    e.preventDefault();
    setError('');
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address'); return;
    }
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      toast.success(res.message);
      setStep(1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: verify OTP ──────────────────────────────────────────────────
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');
    if (!otp || otp.length !== 6) { setError('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await authService.verifyOtp(email, otp);
      toast.success(res.message);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  // ── Step 3: reset password ──────────────────────────────────────────────
  async function handleResetPassword(e) {
    e.preventDefault();
    setError('');
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(newPwd)) {
      setError('Password must be 8+ chars with uppercase, lowercase, number & special char'); return;
    }
    if (newPwd !== confirmPwd) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await authService.resetPassword({
        email, otp, newPassword: newPwd, confirmPassword: confirmPwd,
      });
      toast.success(res.message);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  const titles    = ['Forgot Password', 'Verify OTP', 'New Password'];
  const subtitles = [
    'Enter your registered email to receive an OTP.',
    `Enter the 6-digit OTP sent to ${email}`,
    'Create a strong new password for your account.',
  ];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" id="forgot-password-modal">
        <button className="modal-close" onClick={onClose} id="modal-close-btn">✕</button>

        {/* Step indicator */}
        <div className="step-indicator">
          {STEPS.map((_, i) => (
            <div key={i} className={`step-dot${i <= step ? ' active' : ''}`} />
          ))}
        </div>

        <h2 className="modal-title">{titles[step]}</h2>
        <p className="modal-subtitle">{subtitles[step]}</p>

        {/* ── STEP 0: Email ── */}
        {step === 0 && (
          <form className="auth-form" onSubmit={handleRequestOtp} noValidate>
            <div className="form-group">
              <label htmlFor="fp-email">Email Address</label>
              <div className="input-wrapper">
                <input
                  id="fp-email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  autoComplete="email"
                />
                <span className="input-icon">✉️</span>
              </div>
              {error && <span className="form-error">⚠ {error}</span>}
            </div>
            <button id="send-otp-btn" type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending OTP…' : 'Send OTP →'}
            </button>
          </form>
        )}

        {/* ── STEP 1: OTP ── */}
        {step === 1 && (
          <form className="auth-form" onSubmit={handleVerifyOtp} noValidate>
            <div className="form-group">
              <label htmlFor="fp-otp">One-Time Password</label>
              <div className="input-wrapper">
                <input
                  id="fp-otp"
                  type="text"
                  className="form-input"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
                <span className="input-icon">🔢</span>
              </div>
              {error && <span className="form-error">⚠ {error}</span>}
            </div>
            <button id="verify-otp-btn" type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify OTP →'}
            </button>
            <button
              id="resend-otp-btn"
              type="button"
              className="btn-ghost"
              style={{ width:'100%', marginTop: 4 }}
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await authService.forgotPassword(email);
                  toast.success('OTP resent successfully');
                } catch (err) {
                  toast.error('Could not resend OTP');
                } finally {
                  setLoading(false);
                }
              }}
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* ── STEP 2: New Password ── */}
        {step === 2 && (
          <form className="auth-form" onSubmit={handleResetPassword} noValidate>
            <div className="form-group">
              <label htmlFor="fp-new-pwd">New Password</label>
              <div className="input-wrapper">
                <input
                  id="fp-new-pwd"
                  type={showPwd ? 'text' : 'password'}
                  className="form-input"
                  placeholder="New strong password"
                  value={newPwd}
                  onChange={e => { setNewPwd(e.target.value); setError(''); }}
                />
                <span className="input-icon">🔒</span>
                <button type="button" className="password-toggle" onClick={() => setShowPwd(s => !s)}>
                  <EyeIcon open={showPwd} />
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="fp-confirm-pwd">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  id="fp-confirm-pwd"
                  type={showCPwd ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Re-enter password"
                  value={confirmPwd}
                  onChange={e => { setConfirm(e.target.value); setError(''); }}
                />
                <span className="input-icon">🔒</span>
                <button type="button" className="password-toggle" onClick={() => setShowCPwd(s => !s)}>
                  <EyeIcon open={showCPwd} />
                </button>
              </div>
              {error && <span className="form-error">⚠ {error}</span>}
            </div>
            <button id="reset-password-btn" type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Resetting…' : 'Reset Password →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
