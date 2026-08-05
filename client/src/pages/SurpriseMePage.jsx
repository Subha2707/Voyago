import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Compass,
  ArrowRight,
  TrendingUp,
  Sliders,
} from 'lucide-react';
import { CardSkeleton } from '../components/common/Loader';
import { sourceCities } from '../data/cities';
import { useCurrencyStore } from '../store/currencyStore';

export default function SurpriseMePage() {
  const navigate = useNavigate();
  const format = useCurrencyStore((s) => s.format);
  const formatCompact = useCurrencyStore((s) => s.formatCompact);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  // Form Fields
  const [source, setSource] = useState('');
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(1);
  const [budget, setBudget] = useState(50000);
  const [tolerance, setTolerance] = useState(0.15); // Default ±15% Exact
  const [hotelTier, setHotelTier] = useState('mid');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!source) {
      return toast.error('Please specify your departure location');
    }

    setLoading(true);
    setResults([]);
    setSearched(true);

    try {
      const response = await api.post('/trips/surprise', {
        location: source,
        travelDays: days,
        travelers,
        budget,
        tolerance,
        hotelTier,
      });

      setResults(response.data.matches);
      if (response.data.matches.length === 0) {
        toast.info('No destinations found within that budget range. Try adjusting budget or dates.');
      } else {
        toast.success(`Found ${response.data.matches.length} matching destinations!`);
      }
    } catch (err) {
      toast.error('Search failed. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanTrip = (city) => {
    // Navigate to PlanTripPage with pre-filled state
    navigate(`/plan?source=${source}&dest=${city}&days=${days}&travelers=${travelers}&tier=${hotelTier}`);
  };

  const formatBudget = (val) => {
    return formatCompact(val);
  };

  return (
    <div className="landing-layout">
      <Navbar />

      <main className="container section">
        <div className="section-header text-center" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
          <h1 className="text-4xl font-extrabold mb-3 flex-center gap-2">
            <Sparkles className="text-violet" /> Surprise Me!
          </h1>
          <p className="text-muted">
            Can't decide where to go? Give us your budget, departure city, and travel group details. We will find matching destinations dynamically.
          </p>
        </div>

        <div className="grid-3 gap-8">
          {/* Inputs Panel */}
          <div className="glass-card surprise-form-col form-bg-card" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sliders size={18} className="text-violet" /> Constraints Form
            </h3>

            <form onSubmit={handleSearch} className="auth-form" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Leaving From (Source)</label>
                <div className="form-input-wrapper">
                  <MapPin size={16} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Delhi, Bangalore"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    list="surprise-sources"
                    className="form-input"
                    required
                  />
                  <datalist id="surprise-sources">
                    {sourceCities.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="form-group">
                <div className="flex justify-between items-center text-sm mb-1">
                  <label className="form-label mb-0">Travel Duration</label>
                  <span className="font-bold text-violet">{days} Days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: 'var(--accent-violet)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Travelers</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                    className="btn btn-ghost"
                    style={{ padding: '6px 12px', fontSize: '18px' }}
                  >
                    -
                  </button>
                  <div className="flex-center gap-2 font-bold" style={{ minWidth: '30px' }}>
                    <Users size={16} /> {travelers}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTravelers((t) => Math.min(20, t + 1))}
                    className="btn btn-ghost"
                    style={{ padding: '6px 12px', fontSize: '18px' }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-group">
                <div className="flex justify-between items-center text-sm mb-1">
                  <label className="form-label mb-0">Total Trip Budget</label>
                  <span className="font-bold text-violet">{formatBudget(budget)}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="500000"
                  step="5000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: 'var(--accent-violet)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Budget Tolerance</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                    <input
                      type="radio"
                      name="tolerance"
                      checked={tolerance === 0.15}
                      onChange={() => setTolerance(0.15)}
                      className="accent-violet"
                    />
                    <span>Exact (±15%)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                    <input
                      type="radio"
                      name="tolerance"
                      checked={tolerance === 0.20}
                      onChange={() => setTolerance(0.20)}
                      className="accent-violet"
                    />
                    <span>Flexible (±20%)</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hotel Tier Preference</label>
                <div className="grid-3 gap-1">
                  {['budget', 'mid', 'luxury'].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setHotelTier(tier)}
                      className={`btn btn-sm capitalize ${hotelTier === tier ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
                {loading ? 'Finding Destinations...' : 'Find Matches ✨'}
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div className="col-span-2 flex flex-col gap-6 surprise-results" style={{ gridColumn: 'span 2' }}>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-violet" /> Matching Cities
            </h3>

            {loading && (
              <>
                <CardSkeleton />
                <CardSkeleton />
              </>
            )}

            {!loading && results.length > 0 && (
              <div className="flex flex-col gap-6">
                {results.map((match, index) => (
                  <div key={index} className="glass-card flex justify-between items-center flex-wrap gap-4 animate-fade-in" style={{ padding: '24px' }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex-center font-bold text-sm text-violet"
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'rgba(124,58,237,0.1)',
                            border: '1px solid rgba(124,58,237,0.3)',
                          }}
                        >
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold">{match.cityData.cityName}</h4>
                          <p className="text-xs text-muted">{match.cityData.country}</p>
                        </div>
                      </div>

                      {/* Cost fit score bar */}
                      <div className="mt-4" style={{ maxWidth: '300px' }}>
                        <div className="flex justify-between text-xs text-muted mb-1">
                          <span>Budget Fit Score</span>
                          <strong className="text-violet">{match.fitScore}%</strong>
                        </div>
                        <div className="w-full bg-secondary-dark" style={{ height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            className="bg-violet"
                            style={{ width: `${match.fitScore}%`, height: '100%' }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-muted">Estimated Cost Range</div>
                      <div className="text-lg font-extrabold text-glow text-cyan mt-1">
                        {format(match.totalMin, { decimals: 0 })} - {format(match.totalMax, { decimals: 0 })}
                      </div>
                      <div className="text-xxs text-muted mt-1">
                        Transport: ~{format(match.breakdown.transport.min, { decimals: 0 })} | Stay: ~{format(match.breakdown.stay.min, { decimals: 0 })}
                      </div>
                    </div>

                    <div className="w-full sm:w-auto">
                      <button
                        onClick={() => handlePlanTrip(match.cityData.cityName)}
                        className="btn btn-primary btn-sm flex-center gap-1 w-full"
                      >
                        Plan This Trip <Compass size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && searched && results.length === 0 && (
              <div className="text-center p-12 glass-card">
                <h3>😔 No Matches Found</h3>
                <p className="text-muted text-sm mt-2">
                  We couldn't find any destinations fitting the criteria. Consider raising your budget or selecting a more flexible tolerance.
                </p>
              </div>
            )}

            {!searched && (
              <div className="text-center p-12 glass-card">
                <h3>💡 Fill out the constraints</h3>
                <p className="text-muted text-sm mt-2">
                  Enter your departure and budget preferences on the left to reveal the best matched surprise destinations!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
