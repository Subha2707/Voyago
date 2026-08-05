import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail, User, Phone, CheckSquare, Square } from 'lucide-react';
import logo from '../assets/logo.png';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength checker
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'Weak', color: '#ef4444' });

  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, text: 'Empty', color: '#64748b' });
      return;
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let text = 'Weak';
    let color = '#ef4444';

    if (score === 2) {
      text = 'Fair';
      color = '#f59e0b';
    } else if (score === 3) {
      text = 'Good';
      color = '#3b82f6';
    } else if (score === 4) {
      text = 'Strong';
      color = '#10b981';
    }

    setPasswordStrength({ score, text, color });
  }, [password]);

  const handlePhoneChange = (e) => {
    // Numeric-only validation
    const val = e.target.value.replace(/[^0-9]/g, '');
    setPhone(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password || !confirmPassword) {
      return setError('Please fill in all fields');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (!agreed) {
      return setError('You must agree to the Terms of Service and Privacy Policy');
    }
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', { name, email, phone, password });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page flex-center">
      <div className="auth-card glass-card form-bg-card">
        <div className="auth-header text-center">
          <Link to="/" className="auth-logo justify-center">
            <img src={logo} alt="Voyago" className="logo-img" />
            <span>Voyago</span>
          </Link>
          <h2>Create Your Account</h2>
          <p className="text-muted">Register to save your travel plans</p>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <div className="form-input-wrapper">
              <User size={16} className="input-icon" />
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

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
            <label className="form-label" htmlFor="phone">
              Phone Number
            </label>
            <div className="form-input-wrapper">
              <Phone size={16} className="input-icon" />
              <input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={handlePhoneChange}
                maxLength="15"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="form-input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 8 characters"
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

            {/* Strength indicator */}
            {password && (
              <div className="password-strength-container mt-2">
                <div className="flex justify-between items-center text-xs text-muted mb-1">
                  <span>Password Strength:</span>
                  <span style={{ color: passwordStrength.color, fontWeight: 'bold' }}>{passwordStrength.text}</span>
                </div>
                <div className="password-strength-bar">
                  <div
                    className="password-strength-fill"
                    style={{
                      width: `${(passwordStrength.score / 4) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="form-input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="checkbox-group mt-4" onClick={() => setAgreed(!agreed)}>
            <div className="checkbox-icon">
              {agreed ? <CheckSquare size={18} className="text-violet" /> : <Square size={18} />}
            </div>
            <span className="checkbox-label text-xs text-muted">
              I agree to the{' '}
              <Link to="/terms" className="auth-link" onClick={(e) => e.stopPropagation()}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="auth-link" onClick={(e) => e.stopPropagation()}>
                Privacy Policy
              </Link>
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-6"
            disabled={loading || !agreed}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer text-center mt-6">
          <p className="text-muted">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
