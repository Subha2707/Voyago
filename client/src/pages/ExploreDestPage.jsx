import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Compass,
  MapPin,
  Calendar,
  Shield,
  Utensils,
  Car,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { popularCities } from '../data/cities';
import { useCurrencyStore } from '../store/currencyStore';

export default function ExploreDestPage() {
  const navigate = useNavigate();
  const format = useCurrencyStore((s) => s.format);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleSearch = async (city) => {
    const searchCity = city || query;
    if (!searchCity) return toast.error('Please enter a destination name');

    setLoading(true);
    setData(null);
    setSelectedMonth(null);

    try {
      // Fetch details
      const response = await api.post('/trips/explore', { destination: searchCity });
      setData(response.data);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Could not find city data.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const getSafetyColor = (score) => {
    if (score >= 8) return '#10b981'; // Green
    if (score >= 6) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  return (
    <div className="landing-layout">
      <Navbar />

      <main className="container section">
        <div className="section-header text-center" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
          <h1 className="text-4xl font-extrabold mb-3">Explore Destinations</h1>
          <p className="text-muted">
            Find the best time to visit, tourist spots, local cuisines, safety scores, and transport tips for your dream city.
          </p>

          {/* Search bar */}
          <div className="explore-search-bar flex gap-2 mt-8">
            <div className="form-input-wrapper flex-1">
              <MapPin size={16} className="input-icon" />
              <input
                type="text"
                placeholder="Where to? (e.g. Bali, Goa, Paris)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                list="explore-popular-list"
                className="form-input"
                style={{ marginBottom: 0 }}
              />
              <datalist id="explore-popular-list">
                {popularCities.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <button onClick={() => handleSearch()} className="btn btn-primary">
              Explore
            </button>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['Goa', 'Manali', 'Bali', 'Paris', 'Singapore', 'Vietnam'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setQuery(c);
                  handleSearch(c);
                }}
                className="badge bg-secondary-dark text-xs cursor-pointer hover:border-violet"
                style={{ padding: '6px 12px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', background: 'rgba(255,255,255,0.03)' }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center p-10 animate-fade-in">
            <div className="loader-spinner mx-auto" style={{ margin: '0 auto 16px' }}></div>
            <p className="font-bold">Exploring {query || 'your destination'}</p>
            <p className="text-muted text-sm mt-2">
              Gathering details on attractions, costs, safety, and the best time to visit...
            </p>
          </div>
        )}

        {data && (
          <div className="explore-results-wrapper animate-fade-in">
            {/* Header info */}
            <div className="glass-card flex justify-between items-center flex-wrap gap-4 mb-8" style={{ padding: '24px' }}>
              <div>
                <h2 className="text-3xl font-bold">{data.cityData.cityName}</h2>
                <p className="text-muted">{data.cityData.region ? `${data.cityData.region}, ` : ''}{data.cityData.country}</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center glass-card" style={{ padding: '8px 16px' }}>
                  <span className="text-xs text-muted block">Currency</span>
                  <span className="font-bold text-violet">{data.cityData.currency}</span>
                </div>
                <div className="text-center glass-card" style={{ padding: '8px 16px' }}>
                  <span className="text-xs text-muted block">Safety Score</span>
                  <span className="font-bold" style={{ color: getSafetyColor(data.cityData.safetyScore) }}>
                    {data.cityData.safetyScore}/10
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/plan?dest=${data.cityData.cityName}`)}
                  className="btn btn-primary flex-center gap-2"
                >
                  Plan Trip Here <Compass size={16} />
                </button>
              </div>
            </div>

            <div className="grid-3 gap-8">
              {/* Best Time to Visit (Flow B Specific) */}
              <div className="col-span-2 glass-card" style={{ padding: '24px', gridColumn: 'span 2' }}>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="text-violet" size={18} /> Best Time to Visit
                </h3>
                <p className="text-muted text-sm mb-4">
                  Select a highlighted month below to see crowding, pricing details, and weather advice.
                </p>

                <div className="grid-4 gap-2 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  {data.cityData.bestMonths.map((m, idx) => {
                    const isRec = m.crowdLevel !== 'High' && m.priceLevel !== 'High';
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedMonth(m)}
                        className="month-btn glass-card flex flex-col justify-center items-center text-center cursor-pointer hover:border-violet"
                        style={{
                          padding: '12px',
                          border: selectedMonth?.month === m.month ? '1px solid var(--accent-violet)' : isRec ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.05)',
                          background: isRec ? 'rgba(16,185,129,0.02)' : 'rgba(255,255,255,0.01)',
                        }}
                      >
                        <span className="font-bold">{m.month}</span>
                        <span className="text-xs text-muted mt-1">{m.tempRange || 'Mild'}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedMonth ? (
                  <div className="month-details-card glass-card p-4 animate-fade-in" style={{ border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.02)' }}>
                    <h4 className="font-bold mb-2 text-violet">{selectedMonth.month} Details</h4>
                    <p className="text-sm mb-2"><strong>Reasoning:</strong> {selectedMonth.reason}</p>
                    <div className="flex gap-4 text-xs mt-2 text-muted">
                      <span>👤 Crowd Level: <strong className="text-primary">{selectedMonth.crowdLevel}</strong></span>
                      <span>💰 Price Level: <strong className="text-primary">{selectedMonth.priceLevel}</strong></span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 text-sm text-muted glass-card">
                    💡 Click on any month button above to view detailed weather and pricing breakdown.
                  </div>
                )}
              </div>

              {/* Safety Breakdown */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="text-violet" size={18} /> Safety Score Details
                </h3>
                <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>General Safety</span>
                      <strong>{data.cityData.safetyScore}/10</strong>
                    </div>
                    <div className="w-full bg-secondary-dark rounded-full" style={{ height: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="bg-violet rounded-full"
                        style={{ width: `${data.cityData.safetyScore * 10}%`, height: '100%', background: getSafetyColor(data.cityData.safetyScore), borderRadius: '4px' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Solo Traveler Safety</span>
                      <strong>{data.cityData.soloTravelerSafety}/10</strong>
                    </div>
                    <div className="w-full bg-secondary-dark rounded-full" style={{ height: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="bg-violet rounded-full"
                        style={{ width: `${data.cityData.soloTravelerSafety * 10}%`, height: '100%', background: getSafetyColor(data.cityData.soloTravelerSafety), borderRadius: '4px' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Women Traveler Safety</span>
                      <strong>{data.cityData.womenSafety}/10</strong>
                    </div>
                    <div className="w-full bg-secondary-dark rounded-full" style={{ height: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="bg-violet rounded-full"
                        style={{ width: `${data.cityData.womenSafety * 10}%`, height: '100%', background: getSafetyColor(data.cityData.womenSafety), borderRadius: '4px' }}
                      ></div>
                    </div>
                  </div>

                  <div className="dev-mode-banner flex items-start gap-2 p-2 mt-4" style={{ borderRadius: '4px', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertCircle className="text-danger shrink-0" size={16} />
                    <div className="text-xs text-muted">
                      Local Police contact is <strong>{data.cityData.emergencyContacts?.police || '112'}</strong>. Emergency services number is <strong>{data.cityData.emergencyContacts?.ambulance || '102'}</strong>.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attractions and Cuisine details */}
            <div className="grid-2 gap-8 mt-8">
              {/* Attractions */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="text-violet" size={18} /> Top Attractions
                </h3>
                <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {data.cityData.attractions.map((a, idx) => (
                    <div key={idx} className="attraction-item flex gap-3 border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      <div className="badge bg-secondary-dark text-xs self-start" style={{ padding: '4px 8px', borderRadius: '4px' }}>
                        {a.type}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{a.name}</h4>
                        <p className="text-xs text-muted mt-1">{a.description}</p>
                        {a.entryFeeINR !== undefined && (
                          <span className="text-xs text-violet mt-1 block">Entry Fee: {a.entryFeeINR === 0 ? 'Free' : format(a.entryFeeINR)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Food and Transport */}
              <div className="glass-card flex flex-col gap-6" style={{ padding: '24px' }}>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Utensils className="text-violet" size={18} /> Local Cuisine Highlights
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.cityData.cuisine.map((c, idx) => (
                      <span key={idx} className="badge bg-secondary-dark text-xs" style={{ padding: '6px 12px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)' }}>
                        🍲 {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Car className="text-violet" size={18} /> Local Transport Guide
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.cityData.localTransportOptions.map((opt, idx) => (
                      <span key={idx} className="badge bg-secondary-dark text-xs" style={{ padding: '6px 12px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)' }}>
                        🚲 {opt}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted mt-4">
                    Average cost for local transport is approx <strong>{format(data.cityData.localTransportCostPerDay)}/day</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
