import axios from 'axios';
import crypto from 'crypto';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPES = 'openid email profile';

/**
 * Build the exact redirect_uri that must be registered in the Google Cloud
 * Console. Derived from the incoming request so the SAME code works locally
 * (http://localhost:5000) and on Render (https://<app>.onrender.com).
 */
export const getRedirectUri = (req) => {
  const base = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
  return `${base.replace(/\/$/, '')}/api/auth/google/callback`;
};

export const isGoogleConfigured = () =>
  !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const generateOAuthState = () => crypto.randomBytes(24).toString('hex');

export const getGoogleAuthUrl = (state, redirectUri) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES,
    state,
    access_type: 'online',
    prompt: 'select_account',
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
};

/**
 * Exchange the authorization code for an id_token / access_token.
 * Performed server-side so GOOGLE_CLIENT_SECRET is never exposed.
 */
export const exchangeCodeForToken = async (code, redirectUri) => {
  const { data } = await axios.post(
    GOOGLE_TOKEN_URL,
    new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return data; // { access_token, id_token, expires_in, token_type }
};

/**
 * Decode the (Google-issued) ID token payload. The token comes straight from
 * Google's token endpoint over a server-to-server HTTPS exchange authenticated
 * with the client secret, so the payload is trusted. We still validate the
 * audience + verified email below.
 */
export const decodeIdToken = (idToken) => {
  const [, payload] = idToken.split('.');
  if (!payload) throw new Error('Malformed Google ID token.');
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
};
