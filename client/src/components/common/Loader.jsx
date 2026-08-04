import React from 'react';

// Full page loader spinner
export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <p className="loader-text">Loading Voyago details...</p>
    </div>
  );
}

// Skeleton loader components
export function CardSkeleton() {
  return (
    <div className="skeleton-card glass-card">
      <div className="skeleton-line skeleton-title shimmer"></div>
      <div className="skeleton-line skeleton-body shimmer"></div>
      <div className="skeleton-line skeleton-body shimmer" style={{ width: '80%' }}></div>
      <div className="skeleton-line skeleton-button shimmer"></div>
    </div>
  );
}

export function TextSkeleton() {
  return (
    <div className="skeleton-text-group">
      <div className="skeleton-line shimmer" style={{ height: '24px', width: '40%', marginBottom: '16px' }}></div>
      <div className="skeleton-line shimmer" style={{ height: '14px', width: '100%', marginBottom: '8px' }}></div>
      <div className="skeleton-line shimmer" style={{ height: '14px', width: '95%', marginBottom: '8px' }}></div>
      <div className="skeleton-line shimmer" style={{ height: '14px', width: '90%', marginBottom: '8px' }}></div>
      <div className="skeleton-line shimmer" style={{ height: '14px', width: '60%' }}></div>
    </div>
  );
}

export function TripResultSkeleton() {
  return (
    <div className="container section">
      <div className="skeleton-line shimmer" style={{ height: '48px', width: '60%', marginBottom: '32px' }}></div>
      <div className="grid-3" style={{ gap: '24px', marginBottom: '32px' }}>
        <div className="skeleton-card glass-card shimmer" style={{ height: '180px' }}></div>
        <div className="skeleton-card glass-card shimmer" style={{ height: '180px' }}></div>
        <div className="skeleton-card glass-card shimmer" style={{ height: '180px' }}></div>
      </div>
      <div className="skeleton-line shimmer" style={{ height: '40px', width: '100%', marginBottom: '24px' }}></div>
      <div className="glass-card" style={{ padding: '32px', height: '400px' }}>
        <TextSkeleton />
      </div>
    </div>
  );
}
