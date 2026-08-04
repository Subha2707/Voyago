import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  GitCompare,
  MapPin,
  Shield,
  Wallet,
  Utensils,
  ArrowRight,
  Trophy,
} from 'lucide-react';
import { allCities } from '../data/cities';
import { useCurrencyStore } from '../store/currencyStore';

export default function ComparePage() {
  const navigate = useNavigate();
  const format = useCurrencyStore((s) => s.format);
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleCompare = async (e) => {
    e.preventDefault();

    if (!city1 || !city2) {
      return toast.error('Please enter both destinations to compare');
    }
    if (city1.toLowerCase() === city2.toLowerCase()) {
      return toast.error('Please choose two different cities');
    }

    setLoading(true);
    setData(null);

    try {
      const response = await api.post('/compare', { city1, city2 });
      setData(response.data);
      toast.success(`Comparing ${response.data.city1.cityName} vs ${response.data.city2.cityName}`);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Comparison failed. Try different city names.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const getSafetyColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="landing-layout">
      <Navbar />

      <main className="container section">
        <div className="section-header text-center" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
          <h1 className="text-4xl font-extrabold mb-3 flex-center gap-2">
            <GitCompare className="text-violet" /> Compare Destinations
          </h1>
          <p className="text-muted">
            Torn between two cities? Compare cost of living, safety, and food expenses side by side to decide.
          </p>
        </div>

        {/* Compare Form */}
        <div className="glass-card" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto 40px' }}>
          <form onSubmit={handleCompare} className="flex items-end gap-4 flex-wrap">
            <div className="form-group flex-1" style={{ minWidth: '200px', marginBottom: 0 }}>
              <label className="form-label">Destination 1</label>
              <div className="form-input-wrapper">
                <MapPin size={16} className="input-icon" />
                <input
                  type="text"
                  placeholder="e.g. Goa"
                  value={city1}
                  onChange={(e) => setCity1(e.target.value)}
                  list="compare-cities-1"
                  className="form-input"
                  required
                />
                <datalist id="compare-cities-1">
                  {allCities.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="flex-center font-bold text-muted" style={{ padding: '0 4px 12px' }}>VS</div>

            <div className="form-group flex-1" style={{ minWidth: '200px', marginBottom: 0 }}>
              <label className="form-label">Destination 2</label>
              <div className="form-input-wrapper">
                <MapPin size={16} className="input-icon" />
                <input
                  type="text"
                  placeholder="e.g. Manali"
                  value={city2}
                  onChange={(e) => setCity2(e.target.value)}
                  list="compare-cities-2"
                  className="form-input"
                  required
                />
                <datalist id="compare-cities-2">
                  {allCities.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginBottom: 0 }}>
              {loading ? 'Comparing...' : 'Compare'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="text-center p-10">
            <div className="loader-spinner mx-auto" style={{ margin: '0 auto 16px' }}></div>
            <p className="font-bold">{city1} <span className="text-violet">vs</span> {city2}</p>
            <p className="text-muted text-sm mt-2">
              {`Researching cities and building a comparison... (can take a few seconds for new destinations)`}
            </p>
          </div>
        )}

        {!loading && data && (
          <div className="animate-fade-in">
            {/* Head to head header */}
            <div className="grid-2 gap-8 mb-8">
              {[data.city1, data.city2].map((city, idx) => (
                <div key={city._id || idx} className="glass-card text-center" style={{ padding: '24px' }}>
                  <h2 className="text-2xl font-bold">{city.cityName}</h2>
                  <p className="text-xs text-muted mt-1">{city.region ? `${city.region}, ` : ''}{city.country}</p>
                  <button
                    onClick={() => navigate(`/plan?dest=${city.cityName}`)}
                    className="btn btn-secondary btn-sm mt-4 flex-center gap-1"
                    style={{ margin: '16px auto 0' }}
                  >
                    Plan Trip Here <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Cost Comparison */}
            <div className="glass-card mb-8" style={{ padding: '24px' }}>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Wallet className="text-violet" size={18} /> Cost of Living Comparison
              </h3>

              <div className="flex flex-col gap-4">
                {[
                  { label: 'Budget Hotel / Night', v1: data.city1.avgHotelCost.budget, v2: data.city2.avgHotelCost.budget },
                  { label: 'Mid-Tier Hotel / Night', v1: data.city1.avgHotelCost.mid, v2: data.city2.avgHotelCost.mid },
                  { label: 'Luxury Hotel / Night', v1: data.city1.avgHotelCost.luxury, v2: data.city2.avgHotelCost.luxury },
                  { label: 'Street Food / Day', v1: data.city1.avgFoodCostPerDay.streetFood, v2: data.city2.avgFoodCostPerDay.streetFood },
                  { label: 'Restaurant Food / Day', v1: data.city1.avgFoodCostPerDay.restaurant, v2: data.city2.avgFoodCostPerDay.restaurant },
                ].map((row, idx) => {
                  const max = Math.max(row.v1, row.v2) || 1;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-xs text-muted mb-1">
                        <span>{row.label}</span>
                      </div>
                      <div className="grid-2 gap-4 items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-secondary-dark" style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                            <div
                              className="bg-violet"
                              style={{
                                width: `${(row.v1 / max) * 100}%`,
                                height: '100%',
                                background: row.v1 <= row.v2 ? '#10b981' : 'var(--accent-violet)',
                                marginLeft: 'auto',
                              }}
                            ></div>
                          </div>
                          <strong className="text-xs" style={{ minWidth: '70px', textAlign: 'right' }}>{format(row.v1)}</strong>
                        </div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs" style={{ minWidth: '70px' }}>{format(row.v2)}</strong>
                          <div className="w-full bg-secondary-dark" style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                            <div
                              className="bg-violet"
                              style={{
                                width: `${(row.v2 / max) * 100}%`,
                                height: '100%',
                                background: row.v2 <= row.v1 ? '#10b981' : 'var(--accent-violet)',
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex-center gap-2 mt-6 p-3" style={{ borderRadius: '8px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <Trophy size={16} className="text-success" />
                <span className="text-sm">
                  <strong className="text-success">{data.comparison.cost.cheaperCity}</strong> is more budget-friendly overall.
                </span>
              </div>
            </div>

            {/* Safety Comparison */}
            <div className="glass-card mb-8" style={{ padding: '24px' }}>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Shield className="text-violet" size={18} /> Safety Comparison
              </h3>

              <div className="grid-2 gap-8">
                {[data.city1, data.city2].map((city, idx) => (
                  <div key={idx} className="flex flex-col gap-4">
                    <h4 className="font-bold text-sm">{city.cityName}</h4>
                    {[
                      { label: 'General Safety', v: city.safetyScore },
                      { label: 'Solo Traveler Safety', v: city.soloTravelerSafety },
                      { label: 'Women Safety', v: city.womenSafety },
                    ].map((row, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs text-muted mb-1">
                          <span>{row.label}</span>
                          <strong>{row.v}/10</strong>
                        </div>
                        <div className="w-full bg-secondary-dark" style={{ height: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>
                          <div style={{ width: `${row.v * 10}%`, height: '100%', borderRadius: '4px', background: getSafetyColor(row.v) }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex-center gap-2 mt-6 p-3" style={{ borderRadius: '8px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <Trophy size={16} className="text-success" />
                <span className="text-sm">
                  <strong className="text-success">{data.comparison.safety.saferCity}</strong> scores higher on overall safety.
                </span>
              </div>
            </div>

            {/* Cuisine side by side */}
            <div className="grid-2 gap-8">
              {[data.city1, data.city2].map((city, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '24px' }}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Utensils className="text-violet" size={18} /> {city.cityName} Cuisine
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {city.cuisine.map((c, i) => (
                      <span key={i} className="badge bg-secondary-dark text-xs" style={{ padding: '6px 12px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)' }}>
                        🍲 {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !data && (
          <div className="text-center p-12 glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3>💡 Enter two destinations above</h3>
            <p className="text-muted text-sm mt-2">
              We'll pull cost, safety, and cuisine data to help you decide where to go.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}