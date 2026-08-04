import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import logo from '../assets/logo.png';

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const error = searchParams.get('error');

    if (error) {
      let msg = 'Google sign-in failed. Please try again.';
      if (error === 'unverified_email') msg = 'Your Google email is not verified.';
      toast.error(msg);
      navigate('/login', { replace: true });
      return;
    }

    const accessToken = searchParams.get('accessToken');
    const userId = searchParams.get('userId');

    if (!accessToken || !userId) {
      toast.error('Invalid sign-in response. Please try again.');
      navigate('/login', { replace: true });
      return;
    }

    const completeLogin = async () => {
      // Store the session immediately, then refresh with full profile via /auth/me.
      setAuth({
        user: {
          id: userId,
          name: searchParams.get('name') || '',
          email: searchParams.get('email') || '',
        },
        accessToken,
      });

      try {
        const { data } = await api.get('/auth/me');
        setAuth({ user: data.user, accessToken });
      } catch {
        // fall back to the profile passed in the URL
      }

      toast.success('Signed in with Google!');
      navigate('/dashboard', { replace: true });
    };

    completeLogin();
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="auth-page flex-center">
      <div className="auth-card glass-card text-center" style={{ padding: '40px' }}>
        <img src={logo} alt="Voyago" className="logo-img" style={{ margin: '0 auto 16px' }} />
        <Loader2 className="animate-spin text-violet mx-auto" size={28} style={{ marginBottom: '12px' }} />
        <h2>Signing you in with Google</h2>
        <p className="text-muted mt-2">Please wait a moment...</p>
      </div>
    </div>
  );
}