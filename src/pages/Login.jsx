import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

const EyeIcon = ({ open }) => open
  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

export default function Login() {
  const navigate   = useNavigate();
  const { login }  = useAuth();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFP, setShowFP]   = useState(false);

  function validate() {
    const errs = {};
    if (!form.email)                              errs.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))   errs.email    = 'Enter a valid email address';
    if (!form.password)                           errs.password = 'Password is required';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;                          // prevent double-submit
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await authService.login(form);
      if (res.success) {
        login(res.token, res.user);
        toast.success(res.message || 'Welcome to Home Page!');
        navigate('/home');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  return (
    <>
      <div className="auth-page">
        <div className="orb-extra" />

        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">🔐</div>
            <span className="auth-logo-text">SecureAuth</span>
          </div>

          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          <form className="auth-form" id="login-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="input-wrapper">
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className={`form-input${errors.email ? ' error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                <span className="input-icon">✉️</span>
              </div>
              {errors.email && <span className="form-error">⚠ {errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <label htmlFor="login-password">Password</label>
                <button
                  type="button"
                  className="auth-link"
                  style={{ background:'none', border:'none', cursor:'pointer', fontSize:'12px', padding:0, fontWeight:600 }}
                  onClick={() => setShowFP(true)}
                  id="forgot-password-btn"
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-wrapper">
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  className={`form-input${errors.password ? ' error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <span className="input-icon">🔑</span>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPwd(s => !s)}
                  id="toggle-password-btn"
                >
                  <EyeIcon open={showPwd} />
                </button>
              </div>
              {errors.password && <span className="form-error">⚠ {errors.password}</span>}
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link" id="goto-signup-link">Create one</Link>
          </div>
        </div>
      </div>

      {showFP && <ForgotPasswordModal onClose={() => setShowFP(false)} />}
    </>
  );
}
