import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, FileText } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LegalLayout({ title, updated, intro, children }) {
  return (
    <div className="landing-layout">
      <Navbar />

      <main className="container section" style={{ maxWidth: '860px' }}>
        <div className="glass-card legal-card" style={{ padding: '40px' }}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="badge bg-secondary-dark text-xs"
              style={{ padding: '4px 12px', borderRadius: '16px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd' }}
            >
              Last updated: {updated}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-2">
            <FileText className="text-violet" size={22} /> {title}
          </h1>
          <p className="text-muted text-sm mb-6" style={{ borderLeft: '3px solid rgba(124,58,237,0.4)', paddingLeft: '14px' }}>
            {intro}
          </p>
          <div className="mb-8 flex flex-wrap items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
            <Link to="/" className="btn btn-secondary btn-sm flex-center gap-1">
              <ChevronLeft size={14} /> Back to Home
            </Link>
            <Link to="/contact" className="btn btn-ghost btn-sm">
              Need help? Contact Us
            </Link>
          </div>
          <div className="legal-content flex flex-col gap-6">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}