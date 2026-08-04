import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.png';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputRefs = useRef([]);

  // Countdown timer for code resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Focus helper
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasteData.length === 6 && pasteData.every((char) => !isNaN(char))) {
      setOtp(pasteData);
      inputRefs.current[5].focus();
    }
  };

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    if (otp.every((val) => val !== '') && otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      return setError('Please enter the full 6-digit code');
    }

    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp: code });
      // Store short-lived resetToken
      sessionStorage.setItem('resetToken', data.resetToken);
      toast.success('OTP verified successfully!');
      navigate('/reset-password');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Try again.');
      toast.error('Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setOtp(Array(6).fill(''));
    inputRefs.current[0].focus();
    setTimer(60);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('New code sent! Check your email.');
    } catch (err) {
      toast.error('Failed to resend code');
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
          <h2>Verify Code</h2>
          <p className="text-muted">
            We generated a 6-digit verification code for: <br />
            <strong>{email || 'your email'}</strong>
          </p>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <div className="auth-form">
          <div className="otp-inputs-container flex justify-between gap-2 my-6">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={(el) => (inputRefs.current[index] = el)}
                className="otp-input-field text-center font-mono text-2xl"
                style={{
                  width: '45px',
                  height: '50px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                }}
                required
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            className="btn btn-primary w-full"
            disabled={loading || otp.some((val) => val === '')}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="text-center mt-6 text-xs text-muted">
            {timer > 0 ? (
              <span>Resend code in {timer}s</span>
            ) : (
              <button onClick={handleResend} className="resend-otp-btn text-violet hover:underline">
                Resend Code
              </button>
            )}
          </div>
        </div>

        <div className="auth-footer text-center mt-6">
          <Link to="/forgot-password" className="back-to-login">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </div>
    </div>
  );
}
