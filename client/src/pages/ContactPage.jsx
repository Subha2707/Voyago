import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import toast from 'react-hot-toast';
import {
  Headset,
  Mail,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Wallet,
  MapPin,
  ChevronLeft,
  Send,
  User,
} from 'lucide-react';

const FAQS = [
  {
    q: 'How do I plan a trip?',
    a: 'Head to Plan Trip, enter your destination, dates, travellers and budget, and Voyago will build a day-by-day itinerary with a cost estimate.',
  },
  {
    q: 'How accurate are the budget estimates?',
    a: 'Estimates use live exchange rates plus curated city data. They are indicative ranges, not exact quotes, and vary with season.',
  },
  {
    q: 'Why did my Google sign-in get skipped?',
    a: 'If you used the same email to register with a password first, sign in with that password. Google-only sign-in creates a fresh profile.',
  },
  {
    q: 'I did not receive my password reset email.',
    a: 'If the email was not delivered, the app shows a recovery code on screen. Use that code to reset your password immediately.',
  },
  {
    q: 'How does Surprise Me work?',
    a: 'Give us your budget, departure city and travel dates, and we match destinations dynamically that fit your constraints.',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [faqSearch, setFaqSearch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return toast.error('Please fill in all fields.');
    }
    setSending(true);
    // No backend endpoint required yet: open the visitor's mail client.
    const subject = encodeURIComponent(`Voyago Support — ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`);
    window.location.href = `mailto:support@voyago.com?subject=${subject}&body=${body}`;
    setTimeout(() => setSending(false), 300);
    toast.success('Opening your email app to send the message.');
  };

  const faqs = FAQS.filter(
    (f) =>
      !faqSearch ||
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="landing-layout">
      <Navbar />

      <main className="container section">
        <button onClick={() => window.history.back()} className="btn btn-ghost btn-sm flex-center gap-1 mb-4">
          <ChevronLeft size={14} /> Back
        </button>

        <div className="section-header text-center" style={{ maxWidth: '680px', margin: '0 auto 40px' }}>
          <h1 className="text-4xl font-extrabold mb-3 flex-center gap-2">
            <Headset className="text-violet" /> Contact &amp; Help Desk
          </h1>
          <p className="text-muted">
            Need a hand? Browse our FAQs, reach out via email, or start a chat. We're here to help you travel smarter.
          </p>
        </div>

        <div className="grid-3 gap-8">
          {/* Contact form */}
          <div className="glass-card form-bg-card" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Mail size={18} className="text-violet" /> Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <div className="form-input-wrapper">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rahul"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  rows="5"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what you need help with..."
                  className="form-input"
                  style={{ minHeight: '120px', resize: 'vertical' }}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={sending}>
                <Send size={16} /> {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* FAQ + channels */}
          <div className="flex flex-col gap-6" style={{ gridColumn: 'span 2' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MessageCircle size={18} className="text-violet" /> Frequently Asked Questions
              </h3>
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search questions..."
                className="form-input mb-4"
              />
              <div className="flex flex-col gap-4">
                {faqs.length === 0 && <p className="text-muted text-sm">No results found. Try a different keyword.</p>}
                {faqs.map((f, i) => (
                  <details key={i} className="legal-card" style={{ cursor: 'pointer' }}>
                    <summary className="font-semibold text-sm" style={{ cursor: 'pointer' }}>{f.q}</summary>
                    <p className="text-sm text-muted mt-2" style={{ paddingLeft: '0' }}>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="grid-3 gap-4">
              {[
                { icon: Mail, title: 'Email Us', text: 'support@voyago.com', href: 'mailto:support@voyago.com' },
                { icon: MapPin, title: 'Bugs & Feedback', text: 'Report an issue', href: '/' },
                { icon: Sparkles, title: 'AI Assistant', text: 'Try the in-trip chat', href: '/plan' },
              ].map((c, i) => (
                <a key={i} href={c.href} className="glass-card flex flex-col items-start gap-2 animate-fade-in" style={{ padding: '20px', textDecoration: 'none' }}>
                  <c.icon size={20} className="text-violet" />
                  <span className="font-bold text-sm">{c.title}</span>
                  <span className="text-xs text-muted">{c.text}</span>
                </a>
              ))}
            </div>

            <div className="glass-card flex items-start gap-3 p-4" style={{ borderRadius: '12px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <ShieldCheck size={18} className="text-success shrink-0 mt-0.5" />
              <p className="text-xs text-muted">
                Your data stays private. Voyago only stores the details needed to plan your trips, and you can review our{' '}
                <Link to="/privacy" className="underline">Privacy Policy</Link> and{' '}
                <Link to="/terms" className="underline">Terms of Service</Link> anytime.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}