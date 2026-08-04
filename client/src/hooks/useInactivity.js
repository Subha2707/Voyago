import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import api from '../services/api';

export function useInactivity(timeoutMs = 5 * 60 * 1000) {
  const { isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (!isAuthenticated) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        await api.post('/auth/logout');
      } catch (err) {
        console.error('Logout error on inactivity:', err);
      }
      clearAuth();
      navigate('/login?reason=inactivity');
      toast.error('You have been logged out due to 5 minutes of inactivity');
    }, timeoutMs);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const handleEvent = () => resetTimer();

    events.forEach((e) => window.addEventListener(e, handleEvent));
    resetTimer();

    return () => {
      clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, handleEvent));
    };
  }, [isAuthenticated]);
}
