import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Mail, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.png';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return setError('Please enter your email address');
    }
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      // Backend only returns devOtp when Resend is NOT configured (dev fallback).
      setDevOtp(data.devOtp || '');
      setMessage(data.message || 'If an account exists, a reset code has been sent.');
      setSubmitted(true);
      if (data.devOtp) {
        toast.success('Verification code generated (Dev Mode)');
      } else {
        toast.success('Reset code sent! Check your inbox.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      toast.error('Failed to request reset.');
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
          <h2>Forgot Password</h2>
          <p className="text-muted">Recover your password using your registered email</p>
        </div>

        {/* Dev Mode Banner (only shown when the backend is running without Resend) */}
        {devOtp && (
          <div className="dev-mode-banner flex items-start gap-2 mb-6">
            <AlertTriangle className="text-amber shrink-0" size={18} />
            <div className="text-xs text-amber-light">
              <strong>⚠️ DEV MODE ACTIVE</strong>
              <br />
              Resend is not configured, so no email was sent. Use the code shown below.
            </div>
          </div>
        )}

        {error && <div className="form-error-banner">{error}</div>}

        {!submitted ? (
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

            <button type="submit" className="btn btn-primary w-full mt-6" disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            {devOtp ? (
              <div className="otp-box-display glass-card" style={{ padding: '20px', margin: '20px 0', border: '1px solid rgba(245,158,11,0.3)' }}>
                <p className="text-xs text-muted mb-2">DEV MODE CODE GENERATED</p>
                <h1 className="text-glow text-3xl font-mono tracking-widest text-amber" style={{ margin: '8px 0' }}>
                  {devOtp}
                </h1>
                <p className="text-xs text-muted">Use this code to verify your request</p>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '20px', margin: '20px 0' }}>
                <Mail size={28} className="text-violet mx-auto" style={{ marginBottom: '8px' }} />
                <p className="text-sm text-secondary" style={{ margin: 0 }}>
                  {message}
                </p>
                <p className="text-xs text-muted mt-2">
                  The code expires in 10 minutes. Check your spam folder if you don't see it.
                </p>
              </div>
            )}

            <button
              onClick={() => navigate(`/verify-otp?email=${encodeURIComponent(email)}`)}
              className="btn btn-primary w-full mt-4"
            >
              Continue to Verify OTP <ArrowRight size={16} />
            </button>
          </div>
        )}

        <div className="auth-footer text-center mt-6">
          <Link to="/login" className="back-to-login">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
