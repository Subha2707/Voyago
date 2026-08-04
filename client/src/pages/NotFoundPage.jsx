import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="landing-layout">
      <Navbar />

      <main className="container section flex-center" style={{ minHeight: '60vh' }}>
        <div className="glass-card text-center animate-fade-in" style={{ maxWidth: '480px', padding: '48px 32px' }}>
          <div
            className="flex-center text-violet mx-auto mb-6"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.3)',
              margin: '0 auto 24px',
            }}
          >
            <Compass size={32} />
          </div>

          <h1 className="text-5xl font-extrabold mb-2 text-glow">404</h1>
          <h2 className="text-xl font-bold mb-3">Looks like you've wandered off the map</h2>
          <p className="text-muted text-sm mb-8">
            The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/" className="btn btn-primary flex-center gap-2">
              <Home size={16} /> Back to Home
            </Link>
            <button onClick={() => window.history.back()} className="btn btn-ghost flex-center gap-2">
              <ArrowLeft size={16} /> Go Back
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}