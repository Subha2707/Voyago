import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Calendar,
  Users,
  Compass,
  Sparkles,
  GitCompare,
  Trash2,
  ExternalLink,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { CardSkeleton } from '../components/common/Loader';
import { useCurrencyStore } from '../store/currencyStore';

export default function DashboardPage() {
  const navigate = useNavigate();
  const format = useCurrencyStore((s) => s.format);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({ totalPlanned: 0, exploredCount: 0, savedBudget: 0 });

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await api.get('/trips');
      const { trips } = response.data;
      setTrips(trips);

      // Compute simple stats
      const flowA = trips.filter((t) => t.flow === 'A').length;
      const flowB = trips.filter((t) => t.flow === 'B').length;
      const flowC = trips.filter((t) => t.flow === 'C').length;

      const totalSavedBudget = trips.reduce((acc, curr) => acc + (curr.budget || 0), 0);

      setStats({
        totalPlanned: flowA + flowC,
        exploredCount: flowB,
        savedBudget: totalSavedBudget,
      });
    } catch (err) {
      toast.error('Failed to load trips.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this trip plan?')) return;

    try {
      await api.delete(`/trips/${id}`);
      toast.success('Trip plan deleted successfully.');
      fetchTrips();
    } catch (err) {
      toast.error('Failed to delete trip.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="landing-layout">
      <Navbar />

      <main className="container section">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">My Travel Dashboard</h1>
            <p className="text-muted">Manage your planned trips and explore history.</p>
          </div>
          <Link to="/plan" className="btn btn-primary flex-center gap-1">
            <Plus size={16} /> Plan New Trip
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid-3 gap-6 mb-10">
          <div className="glass-card text-center" style={{ padding: '24px' }}>
            <h3 className="text-3xl font-extrabold text-violet">{stats.totalPlanned}</h3>
            <p className="text-xs text-muted mt-1 uppercase tracking-wider">Trips Planned</p>
          </div>
          <div className="glass-card text-center" style={{ padding: '24px' }}>
            <h3 className="text-3xl font-extrabold text-cyan">{stats.exploredCount}</h3>
            <p className="text-xs text-muted mt-1 uppercase tracking-wider">Cities Explored</p>
          </div>
          <div className="glass-card text-center" style={{ padding: '24px' }}>
            <h3 className="text-3xl font-extrabold text-emerald">
              {format(stats.savedBudget, { decimals: 0 })}
            </h3>
            <p className="text-xs text-muted mt-1 uppercase tracking-wider">Total Saved Budget</p>
          </div>
        </div>

        {/* Saved Trips Grid */}
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp size={18} className="text-violet" /> Saved Travel Plans
        </h2>

        {loading && (
          <div className="grid-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}

        {!loading && trips.length > 0 && (
          <div className="grid-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip._id}
                onClick={() => {
                  if (trip.flow === 'B') {
                    navigate(`/explore?city=${trip.destination}`);
                  } else {
                    navigate(`/trip/${trip._id}`);
                  }
                }}
                className="trip-card glass-card flex flex-col justify-between cursor-pointer hover:border-violet"
                style={{ padding: '24px', height: '100%', minHeight: '220px' }}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="badge bg-secondary-dark text-xxs font-bold uppercase tracking-widest text-violet" style={{ padding: '4px 8px', borderRadius: '4px' }}>
                      {trip.flow === 'A' ? 'Fixed Plan' : trip.flow === 'B' ? 'Exploration' : 'Surprise'}
                    </span>
                    <button
                      onClick={(e) => handleDelete(trip._id, e)}
                      className="text-muted hover:text-danger"
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold mt-2">{trip.destination}</h3>
                  {trip.flow !== 'B' && (
                    <p className="text-xs text-muted mt-1">From: {trip.source || 'Default source'}</p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  {trip.flow !== 'B' ? (
                    <div className="flex flex-col gap-1 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} /> {trip.travelers} traveler(s)
                      </span>
                      {trip.budget !== undefined && (
                        <span className="text-violet font-semibold mt-1">
                          Budget: {format(trip.budget, { decimals: 0 })}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted">Exploration entry</span>
                  )}
                  <div className="flex justify-end mt-4">
                    <span className="text-xs text-violet font-bold flex items-center gap-1">
                      View Details <ExternalLink size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && trips.length === 0 && (
          <div className="text-center p-12 glass-card">
            <h3>No trips saved yet</h3>
            <p className="text-muted text-sm mt-2 mb-6">
              Start planning your first destination using Flow A (Fixed Planner) or Flow C (Surprise Me Finder).
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/plan" className="btn btn-primary">
                Plan a Trip
              </Link>
              <Link to="/explore" className="btn btn-secondary">
                Explore Destinations
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
