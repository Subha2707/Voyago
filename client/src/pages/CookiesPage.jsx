import React from 'react';
import LegalLayout from '../components/common/LegalLayout';

const sections = [
  {
    title: '1. What Are Cookies?',
    body: 'Cookies are small text files stored on your device when you visit a website. They help sites remember your preferences and keep you signed in across pages.',
  },
  {
    title: '2. Cookies We Use',
    body: 'Voyago uses essential cookies to maintain your login session and remember your theme and form preferences. These cookies are required for core features like saving trips and viewing your dashboard to work correctly.',
  },
  {
    title: '3. Authentication Cookies',
    body: 'When you sign in, we store an access token and a refresh token in cookies. These let you stay authenticated while you use the app and are securely set with HTTP-only attributes where supported.',
  },
  {
    title: '4. Analytics & Third-Party Cookies',
    body: 'We may use third-party services that set cookies to help us understand how Voyago is used and to improve performance. These do not personally identify you.',
  },
  {
    title: '5. Managing Cookies',
    body: 'You can control or delete cookies through your browser settings. Disabling essential cookies may prevent you from logging in or using certain features of Voyago.',
  },
  {
    title: '6. More Information',
    body: 'If you have questions about our use of cookies, please refer to our Privacy Policy or contact us for details.',
  },
];

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      updated="August 4, 2026"
      intro="How Voyago uses cookies and similar technologies to keep the service working and improve your experience."
    >
      {sections.map((s) => (
        <section key={s.title}>
          <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--primary-light)' }}>{s.title}</h2>
          <p className="text-sm text-muted leading-relaxed">{s.body}</p>
        </section>
      ))}
    </LegalLayout>
  );
}