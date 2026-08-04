import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const resetToken = sessionStorage.getItem('resetToken');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'Weak', color: '#ef4444' });

  // Redirect if no token is available
  useEffect(() => {
    if (!resetToken) {
      toast.error('Session expired. Please request another reset code.');
      navigate('/forgot-password');
    }
  }, [resetToken, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      return setError('Please fill in all fields');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 8) {
      return setError('Password must be at least 8 characters long');
    }

    setError('');
    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        resetToken,
        newPassword: password,
      });
      sessionStorage.removeItem('resetToken');
      toast.success('Password updated successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Try again.');
      toast.error('Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page flex-center">
      <div className="auth-card glass-card">
        <div className="auth-header text-center">
          <Link to="/" className="auth-logo justify-center">
            <img src={logo} alt="Voyago" className="logo-img" />
            <span>Voyago</span>
          </Link>
          <h2>Set New Password</h2>
          <p className="text-muted">Enter a strong new password for your account</p>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              New Password
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
              Confirm New Password
            </label>
            <div className="form-input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-6" disabled={loading}>
            {loading ? 'Updating Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
