import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function getStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)           score++;
  if (/[A-Z]/.test(pwd))        score++;
  if (/[a-z]/.test(pwd))        score++;
  if (/[0-9]/.test(pwd))        score++;
  if (/[@$!%*?&]/.test(pwd))    score++;
  const labels = ['', 'Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
  const colors = ['', '#fb7185', '#fb923c', '#fcd34d', '#6ee7b7', '#34d399'];
  return { score, label: labels[score] || '', color: colors[score] || '' };
}

const EyeIcon = ({ open }) => open
  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

export default function Signup() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [form, setForm]         = useState({
    fullName: '', email: '', mobileNumber: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors]     = useState({});
  const [showPwd, setShowPwd]   = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [loading, setLoading]   = useState(false);

  const strength = getStrength(form.password);

  function validate() {
    const errs = {};
    if (!form.fullName.trim())                      errs.fullName      = 'Full name is required';
    else if (form.fullName.trim().length < 2)       errs.fullName      = 'Must be at least 2 characters';
    if (!form.email)                                errs.email         = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))     errs.email         = 'Enter a valid email address';
    if (!form.mobileNumber)                         errs.mobileNumber  = 'Mobile number is required';
    else if (!/^[0-9]{10}$/.test(form.mobileNumber)) errs.mobileNumber = 'Must be exactly 10 digits';
    if (!form.password)                             errs.password      = 'Password is required';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(form.password))
      errs.password = 'Min 8 chars · 1 uppercase · 1 lowercase · 1 number · 1 special char (@$!%*?&)';
    if (!form.confirmPassword)                      errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;                            // prevent double-submit & toast spam
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await authService.signup(form);
      if (res.success) {
        if (res.token && res.user) {
          login(res.token, res.user);
          toast.success(res.message || 'Account created successfully!');
          navigate('/home');
        } else {
          toast.success(res.message || 'Account created successfully! Please sign in.');
          navigate('/login');
        }
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
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
    <div className="auth-page">
      <div className="orb-extra" />

      <div className="auth-card" style={{ maxWidth: 520 }}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🔐</div>
          <span className="auth-logo-text">SecureAuth</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join us today — it's completely free</p>

        <form className="auth-form" id="signup-form" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="signup-fullname">Full Name</label>
            <div className="input-wrapper">
              <input
                id="signup-fullname"
                type="text"
                name="fullName"
                className={`form-input${errors.fullName ? ' error' : ''}`}
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
              />
              <span className="input-icon">👤</span>
            </div>
            {errors.fullName && <span className="form-error">⚠ {errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="signup-email">Email Address</label>
            <div className="input-wrapper">
              <input
                id="signup-email"
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

          {/* Mobile */}
          <div className="form-group">
            <label htmlFor="signup-mobile">Mobile Number</label>
            <div className="input-wrapper">
              <input
                id="signup-mobile"
                type="tel"
                name="mobileNumber"
                className={`form-input${errors.mobileNumber ? ' error' : ''}`}
                placeholder="10-digit number"
                value={form.mobileNumber}
                onChange={handleChange}
                maxLength={10}
                autoComplete="tel"
              />
              <span className="input-icon">📱</span>
            </div>
            {errors.mobileNumber && <span className="form-error">⚠ {errors.mobileNumber}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <div className="input-wrapper">
              <input
                id="signup-password"
                type={showPwd ? 'text' : 'password'}
                name="password"
                className={`form-input${errors.password ? ' error' : ''}`}
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <span className="input-icon">🔒</span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPwd(s => !s)}
                id="toggle-signup-password-btn"
              >
                <EyeIcon open={showPwd} />
              </button>
            </div>
            {errors.password && <span className="form-error">⚠ {errors.password}</span>}
            {form.password && !errors.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{ width: `${(strength.score / 5) * 100}%`, background: strength.color }}
                  />
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="signup-confirm-password">Confirm Password</label>
            <div className="input-wrapper">
              <input
                id="signup-confirm-password"
                type={showCPwd ? 'text' : 'password'}
                name="confirmPassword"
                className={`form-input${errors.confirmPassword ? ' error' : ''}`}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <span className="input-icon">🔒</span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCPwd(s => !s)}
                id="toggle-confirm-password-btn"
              >
                <EyeIcon open={showCPwd} />
              </button>
            </div>
            {errors.confirmPassword && <span className="form-error">⚠ {errors.confirmPassword}</span>}
          </div>

          <button
            id="signup-submit-btn"
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link" id="goto-login-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
