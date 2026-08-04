import axios from 'axios';

const RESEND_API_URL = 'https://api.resend.com/emails';

/**
 * Resend (free tier) integration via its REST API — no extra npm dependency.
 * Requires RESEND_API_KEY and a verified sender (RESEND_FROM).
 */
export const isEmailConfigured = () =>
  !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM);

export const sendOtpEmail = async ({ to, name = '', otp }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    throw new Error('Resend is not configured. Set RESEND_API_KEY and RESEND_FROM.');
  }

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0f0f2a; border-radius: 12px; color: #f1f5f9;">
      <div style="font-size: 22px; font-weight: 800; margin-bottom: 16px;">Voyago</div>
      <p style="font-size: 14px; line-height: 1.6;">Hi${name ? ` ${name}` : ''},</p>
      <p style="font-size: 14px; line-height: 1.6;">You requested a password reset. Use this one-time code to continue:</p>
      <div style="margin: 20px 0; padding: 16px; text-align: center; background: #1a1a3a; border-radius: 10px; letter-spacing: 8px; font-size: 30px; font-weight: 800;">${otp}</div>
      <p style="font-size: 12px; color: #94a3b8; line-height: 1.6;">This code expires in <strong>10 minutes</strong>. If you did not request a password reset, you can safely ignore this email.</p>
    </div>
  `;

  await axios.post(
    RESEND_API_URL,
    { from, to, subject: 'Voyago — Your password reset code', html },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );
};
