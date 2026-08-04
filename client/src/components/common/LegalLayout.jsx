import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LegalLayout({ title, updated, intro, children }) {
  return (
    <div className="landing-layout">
      <Navbar />
      <main className="container section" style={{ maxWidth: '860px' }}>
        <div className="glass-card legal-card" style={{ padding: '40px' }}>
          <span className="badge bg-secondary-dark text-xs" style={{ padding: '4px 12px', borderRadius: '16px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd' }}>
            Last updated: {updated}
          </span>
          <h1 className="text-3xl font-extrabold mt-4 mb-2">{title}</h1>
          <p className="text-muted text-sm mb-6">{intro}</p>
          <div className="legal-content flex flex-col gap-6">
            {children}
          </div>
          <div className="mt-10 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Link to="/" className="btn btn-secondary btn-sm">← Back to Home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}