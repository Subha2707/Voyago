import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Cloud,
  Package,
  MessageCircle,
  RefreshCw,
  Send,
  Sun,
  Droplets,
  Wind,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Plane,
  Train,
  Bus,
  Route,
  Clock,
} from 'lucide-react';
import { TripResultSkeleton } from '../components/common/Loader';
import { useCurrencyStore } from '../store/currencyStore';

export default function TripResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const format = useCurrencyStore((s) => s.format);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itinerary, setItinerary] = useState([]);
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const [regeneratingDay, setRegeneratingDay] = useState(null);

  const [forecast, setForecast] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [aqi, setAqi] = useState(null);

  const [packingList, setPackingList] = useState(null);
  const [packingLoading, setPackingLoading] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const days = (() => {
    if (!trip?.startDate || !trip?.endDate) return 3;
    const s = new Date(trip.startDate);
    const e = new Date(trip.endDate);
    return Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
  })();

  //  Load the trip 
  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/trips/${id}`);
        setTrip(response.data.trip);
      } catch (err) {
        toast.error('Could not load this trip.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id, navigate]);

  //  Generate itinerary once trip is loaded 
  useEffect(() => {
    if (!trip) return;

    if (trip.generatedItinerary?.length > 0) {
      setItinerary(trip.generatedItinerary);
      return;
    }

    const fetchItinerary = async () => {
      setItineraryLoading(true);
      try {
        const response = await api.post('/ai/itinerary', {
          destination: trip.destination,
          days,
          interests: trip.interests || [],
          travelers: trip.travelers,
        });
        setItinerary(response.data.itinerary);
      } catch (err) {
        toast.error('Could not generate itinerary.');
      } finally {
        setItineraryLoading(false);
      }
    };
    fetchItinerary();
  }, [trip]);

  // Fetch weather forecast 
  useEffect(() => {
    if (!trip?.destination) return;

    const fetchWeather = async () => {
      setWeatherLoading(true);
      try {
        const response = await api.get(`/weather/forecast/${trip.destination}`, {
          params: {
            startDate: trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : '',
            endDate: trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : '',
          },
        });
        setForecast(response.data.forecast);
      } catch (err) {
        // Fail silently — weather is a nice-to-have
      } finally {
        setWeatherLoading(false);
      }
    };

    const fetchAQI = async () => {
      try {
        const response = await api.get(`/weather/aqi/${trip.destination}`);
        setAqi(response.data);
      } catch (err) {
        // AQI is a nice-to-have
      }
    };

    fetchWeather();
    fetchAQI();
  }, [trip?.destination]);

  // Regenerate a single day 
  const handleRegenerateDay = async (dayPlan) => {
    setRegeneratingDay(dayPlan.day);
    try {
      const response = await api.post('/ai/regenerate', {
        destination: trip.destination,
        dayNumber: dayPlan.day,
        currentPlan: dayPlan,
      });
      setItinerary((prev) =>
        prev.map((d) => (d.day === dayPlan.day ? response.data.dayPlan : d))
      );
      toast.success(`Day ${dayPlan.day} refreshed!`);
    } catch (err) {
      toast.error('Failed to regenerate this day.');
    } finally {
      setRegeneratingDay(null);
    }
  };

  // Generate packing list on demand 
  const handleGeneratePackingList = async () => {
    setPackingLoading(true);
    try {
      const weatherSummary = forecast.length > 0
        ? `${forecast[0].description}, ${forecast[0].temp_max}°C / ${forecast[0].temp_min}°C, humidity ${forecast[0].humidity}%`
        : '';
      const response = await api.post('/ai/packing-list', {
        destination: trip.destination,
        days,
        interests: trip.interests || [],
        weatherSummary,
        startDate: trip.startDate,
      });
      setPackingList(response.data.packingList);
    } catch (err) {
      toast.error('Failed to generate packing list.');
    } finally {
      setPackingLoading(false);
    }
  };

  // Chatbot 
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', content: chatInput };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const currencyState = useCurrencyStore.getState();
      const response = await api.post('/ai/chat', {
        message: userMsg.content,
        cityName: trip.destination,
        history: chatHistory,
        currency: currencyState.currency,
        currencyRate: currencyState.rates[currencyState.currency] || 1,
      });
      setChatHistory((prev) => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (err) {
      toast.error('The assistant is unavailable right now.');
    } finally {
      setChatLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getAQIBg = (level) => {
    const map = { 1: '#10b981', 2: '#f59e0b', 3: '#f97316', 4: '#ef4444', 5: '#991b1b' };
    return map[level] || '#6b7280';
  };

  const getModeColor = (mode) => {
    const map = { flight: 'rgba(99,102,241,0.2)', train: 'rgba(16,185,129,0.2)', bus: 'rgba(245,158,11,0.2)' };
    return map[mode] || 'rgba(255,255,255,0.1)';
  };

  const getModeIcon = (mode) => {
    if (mode === 'flight') return <Plane size={18} />;
    if (mode === 'train') return <Train size={18} />;
    if (mode === 'bus') return <Bus size={18} />;
    return null;
  };

  const journeyLegs = trip?.estimatedBudget?.transport?.journey || [];
  const journeyTotalHrs = journeyLegs.reduce((s, l) => s + (l.durationHrs || 0), 0);

  if (loading) return <TripResultSkeleton />;
  if (!trip) return null;

  return (
    <div className="landing-layout">
      <Navbar />

      <main className="container section">
        {/* Header */}
        <button onClick={() => navigate('/dashboard')} className="btn btn-ghost btn-sm flex-center gap-1 mb-4">
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold flex items-center gap-2">
              <MapPin className="text-violet" /> {trip.destination}
            </h1>
            <p className="text-muted mt-2">
              {trip.source ? `From ${trip.source} · ` : ''}
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)} · {days} days
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center glass-card" style={{ padding: '8px 16px' }}>
              <span className="text-xs text-muted block flex items-center gap-1"><Users size={12} /> Travelers</span>
              <span className="font-bold text-violet">{trip.travelers}</span>
            </div>
            {trip.estimatedBudget?.total && (
              <div className="text-center glass-card" style={{ padding: '8px 16px' }}>
                <span className="text-xs text-muted block flex items-center gap-1"><Wallet size={12} /> Est. Budget</span>
                <span className="font-bold text-cyan">
                  {format(trip.estimatedBudget.total.min)} - {format(trip.estimatedBudget.total.max)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Cost Breakdown */}
        {trip.estimatedBudget?.total && (
          <div className="glass-card mb-8" style={{ padding: '24px' }}>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Wallet className="text-violet" size={18} /> Budget Breakdown
            </h3>
            <div className="grid-4 gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {[
                { label: 'Transport', v: trip.estimatedBudget.transport, extra: trip.estimatedBudget.transport?.mode },
                { label: 'Stay', v: trip.estimatedBudget.stay, extra: trip.estimatedBudget.stay?.tier },
                { label: 'Food', v: trip.estimatedBudget.food },
                { label: 'Local Transport', v: trip.estimatedBudget.localTransport },
              ].map((row, idx) => (
                row.v && (
                  <div key={idx} className="glass-card text-center" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                    <span className="text-xs text-muted uppercase tracking-wider">{row.label}</span>
                    <div className="font-bold text-lg mt-1">{format(row.v.min)} - {format(row.v.max)}</div>
                    {row.extra && <span className="text-xxs text-violet capitalize">{row.extra}</span>}
                  </div>
                )
              ))}
            </div>
            {trip.estimatedBudget.transport?.bookingLink && (
              <a
                href={trip.estimatedBudget.transport.bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm mt-6 flex-center gap-1"
                style={{ width: 'fit-content' }}
              >
                Book Transport <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}

        {/* Journey Plan */}
        {journeyLegs.length > 0 && (
          <div className="glass-card mb-8" style={{ padding: '24px' }}>
            <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
              <Route className="text-violet" size={18} /> Journey Plan
            </h3>
            <p className="text-xs text-muted mb-4">
              {journeyLegs.length > 1
                ? 'There is no direct connection for this route — here is the step-by-step journey.'
                : 'Direct connection for this route.'}{' '}
              Costs are per person (one way) and vary by season.
            </p>
            <div className="flex flex-col gap-3">
              {journeyLegs.map((leg, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3"
                  style={{ borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '10px', background: getModeColor(leg.mode), color: 'var(--text-primary)' }}>
                    {getModeIcon(leg.mode)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">
                      {leg.from ? (
                        <>
                          ${leg.from}
                          <ArrowRight size={16} className="mx-1 text-muted" />
                          ${leg.to}
                        </>
                      ) : (leg.to)}
                    </div>
                    <div className="text-xxs text-muted capitalize">
                      {leg.mode} · ~{leg.durationHrs || '?'} hrs{leg.seeded ? '' : ' · estimated'}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-cyan text-right">
                    {format(leg.min)} - {format(leg.max)}
                  </div>
                  {leg.bookingLink && (
                    <a
                      href={leg.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm flex-center"
                      title="Book this leg"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              ))}
              <div className="flex justify-between text-sm mt-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-muted flex items-center gap-1"><Clock size={13} /> Total travel time (one way)</span>
                <span className="font-bold">~{journeyTotalHrs} hrs</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Round-trip transport ({trip.travelers} traveler(s))</span>
                <span className="font-bold text-cyan">
                  {format(trip.estimatedBudget.transport.min)} - {format(trip.estimatedBudget.transport.max)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Weather Forecast */}
        <div className="glass-card mb-8" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center flex-wrap gap-2 mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Cloud className="text-violet" size={18} /> Weather Forecast
            </h3>
            {days > 7 && forecast.length > 0 && (
              <span className="badge text-xs" style={{ padding: '6px 12px', borderRadius: '16px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}>
                Your trip is {days} days — only the next 7-day forecast is available.
              </span>
            )}
          </div>
          {weatherLoading && <p className="text-muted text-sm">Loading forecast...</p>}
          {!weatherLoading && forecast.length > 0 && (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
              {forecast.map((day, idx) => (
                <div key={idx} className="glass-card text-center" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                  <span className="text-xs text-muted block">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</span>
                  {day.estimated && <span className="text-xxs text-amber font-bold">Est.</span>}
                  <Sun className="text-cyan mx-auto my-2" size={20} />
                  <span className="font-bold block">{day.temp_max}° / {day.temp_min}°</span>
                  <span className="text-xxs text-muted capitalize">{day.description}</span>
                  <div className="flex justify-center gap-2 mt-2 text-xxs text-muted">
                    <span className="flex items-center gap-1"><Droplets size={10} /> {day.humidity}%</span>
                    <span className="flex items-center gap-1"><Wind size={10} /> {day.wind}km/h</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!weatherLoading && forecast.length === 0 && (
            <p className="text-muted text-sm">Weather data isn't available for this destination right now.</p>
          )}

          {/* AQI */}
          {aqi && (
            <div className="flex items-center gap-4 mt-6 p-4" style={{ borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <div
                className="flex-center font-bold"
                style={{ width: '52px', height: '52px', borderRadius: '12px', background: getAQIBg(aqi.aqi), color: '#fff' }}
              >
                {aqi.aqi}
              </div>
              <div>
                <div className="font-bold flex items-center gap-2">
                  Air Quality Index <span className="badge text-xs" style={{ padding: '3px 10px', borderRadius: '16px', background: getAQIBg(aqi.aqi) }}>{aqi.level}</span>
                </div>
                <p className="text-xs text-muted mt-1">
                  PM2.5: {aqi.components?.pm2_5} µg/m³ · PM10: {aqi.components?.pm10} µg/m³ · CO: {aqi.components?.co}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Itinerary */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="text-violet" size={18} /> Day-by-Day Itinerary
          </h3>

          {itineraryLoading && (
            <div className="glass-card text-center p-12">
              <p className="text-muted">Crafting your personalized itinerary...</p>
            </div>
          )}

          {!itineraryLoading && itinerary.length > 0 && (
            <div className="flex flex-col gap-6">
              {itinerary.map((dayPlan) => (
                <div key={dayPlan.day} className="glass-card" style={{ padding: '24px' }}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold flex items-center gap-2">
                      <span
                        className="flex-center font-bold text-sm text-violet"
                        style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)' }}
                      >
                        {dayPlan.day}
                      </span>
                      Day {dayPlan.day}
                    </h4>
                    <button
                      onClick={() => handleRegenerateDay(dayPlan)}
                      className="btn btn-ghost btn-sm flex-center gap-1"
                      disabled={regeneratingDay === dayPlan.day}
                    >
                      <RefreshCw size={14} className={regeneratingDay === dayPlan.day ? 'animate-spin' : ''} />
                      {regeneratingDay === dayPlan.day ? 'Regenerating...' : 'Regenerate'}
                    </button>
                  </div>

                  <div className="grid-3 gap-4 mb-4">
                    <div>
                      <span className="text-xs text-violet font-bold uppercase tracking-wider">Morning</span>
                      <p className="text-sm text-muted mt-1">{dayPlan.morning}</p>
                    </div>
                    <div>
                      <span className="text-xs text-violet font-bold uppercase tracking-wider">Afternoon</span>
                      <p className="text-sm text-muted mt-1">{dayPlan.afternoon}</p>
                    </div>
                    <div>
                      <span className="text-xs text-violet font-bold uppercase tracking-wider">Evening</span>
                      <p className="text-sm text-muted mt-1">{dayPlan.evening}</p>
                    </div>
                  </div>

                  {dayPlan.meals && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(Array.isArray(dayPlan.meals) ? dayPlan.meals : [dayPlan.meals]).map((meal, i) => (
                        <span key={i} className="badge bg-secondary-dark text-xs" style={{ padding: '6px 12px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)' }}> {meal}
                        </span>
                      ))}
                    </div>
                  )}

                  {dayPlan.tips && (
                    <div className="flex items-start gap-2 p-3 mt-2" style={{ borderRadius: '8px', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.2)' }}>
                      <AlertTriangle size={14} className="text-cyan shrink-0 mt-1" />
                      <p className="text-xs text-muted">{dayPlan.tips}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Packing List */}
        <div className="glass-card mb-8" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Package className="text-violet" size={18} /> Packing List
            </h3>
            {!packingList && (
              <button onClick={handleGeneratePackingList} className="btn btn-secondary btn-sm" disabled={packingLoading}>
                {packingLoading ? 'Generating...' : 'Generate Packing List'}
              </button>
            )}
          </div>

          {packingList && (
            <div className="grid-3 gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              {Object.entries(packingList).map(([category, items]) => (
                <div key={category}>
                  <h4 className="font-bold text-sm capitalize mb-2 text-violet">{category}</h4>
                  <ul className="text-xs text-muted flex flex-col gap-1" style={{ paddingLeft: '16px' }}>
                    {items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {!packingList && !packingLoading && (
            <p className="text-muted text-sm">Generate a custom packing list based on your destination and interests.</p>
          )}
        </div>

        {/* AI Chat Assistant */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <button
            onClick={() => setChatOpen((o) => !o)}
            className="flex justify-between items-center w-full"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <MessageCircle className="text-violet" size={18} /> Ask Voyago AI
            </h3>
            <span className="text-xs text-muted">{chatOpen ? 'Hide' : 'Show'}</span>
          </button>

          {chatOpen && (
            <div className="mt-6 animate-fade-in">
              <div
                className="flex flex-col gap-3 mb-4"
                style={{ maxHeight: '320px', overflowY: 'auto', padding: '4px' }}
              >
                {chatHistory.length === 0 && (
                  <p className="text-muted text-xs text-center p-4">
                    Ask about safety, costs, food, or local attractions in {trip.destination}.
                  </p>
                )}
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`glass-card ${msg.role === 'user' ? 'text-right' : ''}`}
                    style={{
                      padding: '12px 16px',
                      maxWidth: '80%',
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.role === 'user' ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))}
                {chatLoading && <p className="text-muted text-xs">Voyago AI is thinking...</p>}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="e.g. Is it safe for solo travelers?"
                  className="form-input"
                  style={{ marginBottom: 0 }}
                />
                <button type="submit" className="btn btn-primary flex-center" disabled={chatLoading}>
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}