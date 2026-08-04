import React from 'react';
import LegalLayout from '../components/common/LegalLayout';

const sections = [
  {
    title: '1. Information We Collect',
    body: 'We collect the information you provide directly when you create an account, such as your name, email address, and phone number. When you plan trips, we also store the trip details you enter â€” destinations, dates, traveller counts, interests, and budget preferences â€” so you can revisit them from your dashboard.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'Your information is used to provide and improve Voyago services: generating trip plans, budgets, itineraries, and packing lists; personalising your experience; sending service-related communications; and maintaining the security of your account. We do not sell your personal data to third parties.',
  },
  {
    title: '3. AI & Third-Party Data Sources',
    body: 'To power features like itineraries, weather forecasts, and safety information, we may share the destination names you search with third-party providers (such as our AI model provider and weather/geocoding APIs). We share only what is necessary to deliver the requested feature and never your password or payment details.',
  },
  {
    title: '4. Data Storage & Security',
    body: 'Passwords are hashed before storage, and access is protected using JWT-based authentication. Your saved trips are private to your account. While we take reasonable measures to protect your data, no method of transmission over the internet is 100% secure.',
  },
  {
    title: '5. Cookies',
    body: 'Voyago uses cookies and similar technologies to keep you signed in and remember your preferences. You can control cookies through your browser settings. See our Cookie Policy for details.',
  },
  {
    title: '6. Your Rights',
    body: 'You may access, correct, or delete your account and personal data at any time. To request deletion of your data, contact us and we will remove your account and associated information, subject to legal retention requirements.',
  },
  {
    title: '7. Children\'s Privacy',
    body: 'Voyago is not directed to children under 13, and we do not knowingly collect personal information from children. If you believe a child has provided us personal data, please contact us and we will delete it.',
  },
  {
    title: '8. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of Voyago after changes constitutes acceptance of the revised policy.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="August 4, 2026"
      intro="This policy explains what information Voyago collects, how we use it, and the choices you have."
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