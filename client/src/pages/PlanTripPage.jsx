import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  MapPin,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  ArrowLeft,
  Plane,
  Train,
  Bus,
  Check,
} from 'lucide-react';
import { sourceCities, popularCities } from '../data/cities';
import { useCurrencyStore } from '../store/currencyStore';

export default function PlanTripPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formatCompact = useCurrencyStore((s) => s.formatCompact);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Form Fields State (prefilled from URL query params when redirected from Explore / Surprise Me)
  const [source, setSource] = useState(searchParams.get('source') || '');
  const [destination, setDestination] = useState(searchParams.get('dest') || '');
  const [transport, setTransport] = useState(searchParams.get('mode') || 'flight');
  const [routeOptions, setRouteOptions] = useState(null);
  const [routeOptionsLoading, setRouteOptionsLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const d = Number(searchParams.get('days'));
    return d > 0 ? new Date().toISOString().split('T')[0] : '';
  });
  const [endDate, setEndDate] = useState(() => {
    const d = Number(searchParams.get('days'));
    if (d > 0) {
      const end = new Date(Date.now() + (d - 1) * 86400000);
      return end.toISOString().split('T')[0];
    }
    return '';
  });
  const [travelers, setTravelers] = useState(Number(searchParams.get('travelers')) || 1);
  const [interests, setInterests] = useState([]);
  const [hotelTier, setHotelTier] = useState(searchParams.get('tier') || 'mid');

  const handleInterestToggle = (item) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const getDaysCount = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  };

  // Fetch which transport modes are actually possible for this route (backend decides).
  useEffect(() => {
    const src = source.trim();
    const dest = destination.trim();
    if (!src || !dest || src.toLowerCase() === dest.toLowerCase()) {
      setRouteOptions(null);
      return;
    }

    const timer = setTimeout(async () => {
      setRouteOptionsLoading(true);
      try {
        const res = await api.post('/routes/options', { source: src, destination: dest });
        setRouteOptions(res.data);
      } catch {
        setRouteOptions(null);
      } finally {
        setRouteOptionsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [source, destination]);

  const isModeFeasible = (m) =>
    routeOptions ? routeOptions.availableModes.some((o) => o.mode === m) : true;

  const handleModeClick = (mode, label) => {
    if (routeOptions && !isModeFeasible(mode)) {
      const reason = routeOptions.unavailableModes?.find((u) => u.mode === mode)?.reason;
      toast.error(`Not possible by ${label} for ${source} → ${destination}. ${reason || ''}`);
      return;
    }
    setTransport(mode);
  };

  const MODES = [
    { key: 'flight', label: 'Flight', Icon: Plane },
    { key: 'train', label: 'Train', Icon: Train },
    { key: 'bus', label: 'Bus', Icon: Bus },
  ];

  const validateStep = () => {
    if (step === 1) {
      if (!source) {
        toast.error('Please specify your departure location');
        return false;
      }
      if (!destination) {
        toast.error('Please specify your destination');
        return false;
      }
      if (source.toLowerCase() === destination.toLowerCase()) {
        toast.error('Departure and destination cannot be the same');
        return false;
      }
    } else if (step === 2) {
      if (!startDate || !endDate) {
        toast.error('Please select start and end dates');
        return false;
      }
      if (new Date(startDate) > new Date(endDate)) {
        toast.error('Start date cannot be after end date');
        return false;
      }
    } else if (step === 3) {
      if (interests.length === 0) {
        toast.error('Please select at least one interest');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const prevStep = () => {
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setLoadingMessage('Analyzing departure routes...');

    setTimeout(() => setLoadingMessage('Checking weather forecasts & AQI...'), 1000);
    setTimeout(() => setLoadingMessage('Calculating stay and food budgets...'), 2000);
    setTimeout(() => setLoadingMessage('Creating custom AI day-by-day plan...'), 3000);

    try {
      const response = await api.post('/trips/plan', {
        source,
        destination,
        startDate,
        endDate,
        travelers,
        interests,
        hotelTier,
        mode: transport,
      });

      const { trip } = response.data;
      toast.success('Trip planned and saved!');
      // Wait a moment so the loading screen finishes cleanly
      setTimeout(() => {
        setLoading(false);
        navigate(`/trip/${trip._id}`);
      }, 4000);
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Failed to generate trip plan. Please try again.';
      toast.error(errMsg);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader-spinner"></div>
        <p className="loader-text font-bold" style={{ fontSize: '20px', marginTop: '20px' }}>
          {loadingMessage}
        </p>
        <p className="text-muted text-xs mt-2">This will take only a few moments...</p>
      </div>
    );
  }

  return (
    <div className="landing-layout">
      <Navbar />

      <main className="container section flex justify-center">
        <div className="glass-card plan-trip-card" style={{ maxWidth: '600px', width: '100%', padding: '32px' }}>
          {/* Step Progress Bar */}
          <div className="step-progress-wrapper mb-8">
            <div className="flex justify-between items-center text-xs text-muted mb-2">
              <span>Step {step} of 4</span>
              <span>{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            <div className="step-progress-bar" style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                className="step-progress-fill"
                style={{
                  width: `${(step / 4) * 100}%`,
                  height: '100%',
                  background: 'var(--gradient-btn)',
                  transition: 'width 0.3s ease',
                }}
              ></div>
            </div>
          </div>

          {/* STEP 1: Source & Destination */}
          {step === 1 && (
            <div className="form-step-container">
              <h2 className="text-2xl font-bold mb-2">Where are you heading?</h2>
              <p className="text-muted text-sm mb-6">Choose your departure location and travel destination.</p>

              <div className="form-group">
                <label className="form-label">Leaving From (Source)</label>
                <div className="form-input-wrapper">
                  <MapPin size={16} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Delhi, Mumbai"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    list="sources-list"
                    className="form-input"
                  />
                  <datalist id="sources-list">
                    {sourceCities.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Going To (Destination)</label>
                <div className="form-input-wrapper">
                  <MapPin size={16} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Goa, Paris"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    list="destinations-list"
                    className="form-input"
                  />
                  <datalist id="destinations-list">
                    {popularCities.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Transport Mode</label>
                {routeOptionsLoading && (
                  <p className="text-xs text-muted mb-2">Checking which modes are possible for this route...</p>
                )}
                {routeOptions && routeOptions.availableModes.length > 0 && (
                  <p className="text-xs text-violet mb-3 font-semibold">
                    Possible by: {routeOptions.availableModes.map((m) => m.label).join(' · ')}
                  </p>
                )}
                {routeOptions && routeOptions.availableModes.length === 0 && (
                  <p className="text-xs text-amber mb-3">No transport option found for this route. Try a different destination.</p>
                )}
                <div className="grid-3 gap-2">
                  {MODES.map(({ key, label, Icon }) => {
                    const selected = transport === key;
                    const unavailable = routeOptions && !isModeFeasible(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleModeClick(key, label)}
                        className={`btn flex-center gap-2 ${selected ? 'btn-primary' : unavailable ? 'btn-ghost opacity-50' : 'btn-ghost'}`}
                        style={unavailable && !selected ? { cursor: 'not-allowed' } : undefined}
                        title={unavailable ? 'Not possible for this route' : undefined}
                      >
                        <Icon size={16} /> {label}
                      </button>
                    );
                  })}
                </div>
                {routeOptions && routeOptions.availableModes.length === 1 && (
                  <p className="text-xs text-amber mt-2">
                    Only {routeOptions.availableModes[0].label} is possible for {source} → {destination}.
                  </p>
                )}
                {routeOptions && routeOptions.unavailableModes?.length > 0 && (
                  <p className="text-xs text-muted mt-2">
                    Not possible: {routeOptions.unavailableModes.map((u) => u.label).join(', ')}
                  </p>
                )}
              </div>

              <button onClick={nextStep} className="btn btn-primary w-full mt-6">
                Next Step <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2: Dates & Travelers */}
          {step === 2 && (
            <div className="form-step-container">
              <h2 className="text-2xl font-bold mb-2">When are you traveling?</h2>
              <p className="text-muted text-sm mb-6">Select your travel dates and size of your group.</p>

              <div className="grid-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <div className="form-input-wrapper">
                    <Calendar size={16} className="input-icon" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <div className="form-input-wrapper">
                    <Calendar size={16} className="input-icon" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {startDate && endDate && (
                <div className="text-xs text-violet mb-4 font-semibold">
                  Trip duration: {getDaysCount()} day(s)
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Number of Travelers</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                    className="btn btn-ghost"
                    style={{ padding: '8px 16px', fontSize: '20px' }}
                  >
                    -
                  </button>
                  <div className="flex-center gap-2 font-bold" style={{ minWidth: '40px' }}>
                    <Users size={16} /> {travelers}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTravelers((t) => Math.min(20, t + 1))}
                    className="btn btn-ghost"
                    style={{ padding: '8px 16px', fontSize: '20px' }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button onClick={prevStep} className="btn btn-ghost flex-1">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={nextStep} className="btn btn-primary flex-1">
                  Next Step <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Interests & Hotel Tier */}
          {step === 3 && (
            <div className="form-step-container">
              <h2 className="text-2xl font-bold mb-2">What are your interests?</h2>
              <p className="text-muted text-sm mb-6">We will tailor your itinerary based on these preferences.</p>

              <div className="form-group">
                <label className="form-label">Select Interests</label>
                <div className="flex flex-wrap gap-2">
                  {['Heritage', 'Nature', 'Food', 'Nightlife', 'Adventure', 'Shopping', 'Relaxation'].map((tag) => {
                    const selected = interests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleInterestToggle(tag)}
                        className={`interest-tag-btn btn btn-sm rounded-full flex items-center gap-1 ${
                          selected ? 'btn-primary' : 'btn-ghost'
                        }`}
                        style={{ borderRadius: '20px' }}
                      >
                        {selected && <Check size={12} />} {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hotel Accommodation Tier</label>
                <div className="grid-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setHotelTier('budget')}
                    className={`btn btn-tier ${hotelTier === 'budget' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    Budget <span className="text-xs text-muted">{formatCompact(1000)}-{formatCompact(2000)}/nt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHotelTier('mid')}
                    className={`btn btn-tier ${hotelTier === 'mid' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    Mid-Range <span className="text-xs text-muted">{formatCompact(3000)}-{formatCompact(5000)}/nt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHotelTier('luxury')}
                    className={`btn btn-tier ${hotelTier === 'luxury' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    Luxury <span className="text-xs text-muted">{formatCompact(8000)}+/nt</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button onClick={prevStep} className="btn btn-ghost flex-1">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={nextStep} className="btn btn-primary flex-1">
                  Next Step <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div className="form-step-container">
              <h2 className="text-2xl font-bold mb-2">Review Details</h2>
              <p className="text-muted text-sm mb-6">Verify everything is correct before generating.</p>

              <div className="review-box glass-card mb-6" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex justify-between border-b pb-2 mb-2 text-sm" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <span className="text-muted">Route:</span>
                  <span className="font-semibold">{source} → {destination}</span>
                </div>
                <div className="flex justify-between border-b pb-2 mb-2 text-sm" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <span className="text-muted">Transport:</span>
                  <span className="font-semibold capitalize">{transport}</span>
                </div>
                <div className="flex justify-between border-b pb-2 mb-2 text-sm" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <span className="text-muted">Dates:</span>
                  <span className="font-semibold">{startDate} to {endDate} ({getDaysCount()} days)</span>
                </div>
                <div className="flex justify-between border-b pb-2 mb-2 text-sm" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <span className="text-muted">Travelers:</span>
                  <span className="font-semibold">{travelers} person(s)</span>
                </div>
                <div className="flex justify-between border-b pb-2 mb-2 text-sm" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <span className="text-muted">Stay:</span>
                  <span className="font-semibold capitalize">{hotelTier} Tier</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  <span className="text-muted text-xs w-full mb-1">Interests:</span>
                  {interests.map((tag) => (
                    <span key={tag} className="badge bg-secondary-dark text-xs" style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button onClick={prevStep} className="btn btn-ghost flex-1">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleSubmit} className="btn btn-primary flex-1">
                  Generate Plan <Compass size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
