import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api, { GOOGLE_AUTH_URL } from '../services/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail, AlertTriangle } from 'lucide-react';
import logo from '../assets/logo.png';

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

export default function LoginPage() {
  const { setAuth, isAuthenticated } = useAuthStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Checks if redirected due to inactivity
  const reason = searchParams.get('reason');

  useEffect(() => {
    if (reason === 'inactivity') {
      toast.error('You were logged out due to inactivity');
    }
  }, [reason]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please fill in all fields');
    }
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth({ user: data.user, accessToken: data.accessToken });
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, show full-page warning alert modal
  if (isAuthenticated) {
    return (
      <div className="auth-page flex-center">
        <div className="auth-card glass-card text-center" style={{ padding: '40px' }}>
          <AlertTriangle className="text-amber" size={48} style={{ marginBottom: '16px' }} />
          <h2>You are already logged in</h2>
          <p className="text-muted" style={{ margin: '12px 0 24px' }}>
            There is no need to log in again. You can go straight to your dashboard.
          </p>
          <div className="flex-center" style={{ gap: '16px' }}>
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
            <button
              onClick={() => {
                useAuthStore.getState().clearAuth();
                toast.success('Logged out');
                navigate('/login');
              }}
              className="btn btn-ghost"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page flex-center">
      <div className="auth-card glass-card">
        <div className="auth-header text-center">
          <Link to="/" className="auth-logo justify-center">
            <img src={logo} alt="Voyago" className="logo-img" />
            <span>Voyago</span>
          </Link>
          <h2>Welcome Back</h2>
          <p className="text-muted">Enter your credentials to access your trips</p>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <div className="form-input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="flex justify-between items-center" style={{ marginBottom: '6px' }}>
              <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>
                Password
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>
            <div className="form-input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-6" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-divider mt-6">
          <span>or continue with</span>
        </div>

        <button
          type="button"
          className="btn-google w-full"
          onClick={() => {
            setError('');
            window.location.href = GOOGLE_AUTH_URL;
          }}
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        <div className="auth-footer text-center mt-6">
          <p className="text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
