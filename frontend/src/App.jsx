import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Type, FileText, X, Plus, Trash2, ArrowRight } from 'lucide-react';
import './App.css';
import TripDetail from './components/TripDetail';
import './components/TripDetail.css';
import LandingPage from './components/LandingPage';
import './components/LandingPage.css';

const App = () => {
  const [view, setView] = useState('dashboard');
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all journeys on mount
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/trips');
      if (!response.ok) throw new Error('Could not connect to database');
      const data = await response.json();
      setTrips(data);
    } catch (err) {
      console.error(err);
      setError('System offline. Please ensure the local server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (id, e) => {
    e.stopPropagation(); // Prevent navigating to detail view
    if (!window.confirm("Are you sure you want to delete this journey? All related data will be lost.")) return;

    try {
      const response = await fetch(`http://localhost:5001/api/trips/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Delete failed');
      fetchTrips(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert("Failed to delete trip. Please try again.");
    }
  };

  // Periodic check if previous fetch failed
  useEffect(() => {
    if (error) {
      const interval = setInterval(fetchTrips, 10000);
      return () => clearInterval(interval);
    }
  }, [error]);

  const displayedTrips = trips.filter(trip =>
    activeFilter === 'all' || trip.status === activeFilter
  );

  return (
    <div className="main-viewport">
      <nav className="smart-nav">
        <div className="nav-wrapper">
          <div className="logo" onClick={() => setView('landing')}>TripFlow</div>
          <div className="nav-links">
            {view === 'landing' ? (
              <>
                <a href="#features" className="nav-link">Features</a>
                <button className="nav-cta" onClick={() => setView('dashboard')}>Get Started</button>
              </>
            ) : (
              <>
                <button className={`nav-link ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>Timeline</button>
                <button className="nav-link">Explore</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="content-container">
        {error && <div className="system-notice warning">{error}</div>}

        {view === 'landing' && <LandingPage onGetStarted={() => setView('dashboard')} />}

        {view === 'dashboard' && (
          <div className="dashboard-view animate-fade">
            <header className="dashboard-header">
              <div className="header-copy">
                <h1>My Journeys</h1>
                <p>Plan, track, and enjoy your family adventures.</p>
              </div>
              <button className="action-button primary" onClick={() => setIsAddingTrip(true)}>
                <Plus size={18} />
                New Journey
              </button>
            </header>

            <div className="filter-shelf">
              {['all', 'upcoming', 'ongoing', 'completed'].map(category => (
                <button
                  key={category}
                  className={`shelf-pill ${activeFilter === category ? 'selected' : ''}`}
                  onClick={() => setActiveFilter(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div className="journeys-grid">
              {displayedTrips.length === 0 ? (
                <div className="empty-journeys">
                  <div className="empty-visual">✨</div>
                  <h2>Waitng for adventure</h2>
                  <p>Your journey list is empty. Start by planning your first trip.</p>
                  <button className="action-button secondary" onClick={() => setIsAddingTrip(true)}>Start Planning</button>
                </div>
              ) : (
                displayedTrips.map(trip => (
                  <div
                    key={trip._id}
                    className="journey-card"
                    onClick={() => { setActiveTrip(trip); setView('detail'); }}
                  >
                    <div className="card-top">
                      <span className={`status-marker ${trip.status}`}>{trip.status}</span>
                    </div>

                    <div className="card-body">
                      <div className="date-range">
                        {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        &nbsp;—&nbsp;
                        {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h3>{trip.title}</h3>
                    </div>

                    <div className="card-details">
                      <div className="card-actions">
                        <button className="delete-btn" title="Delete Journey" onClick={(e) => handleDeleteTrip(trip._id, e)}>
                          <Trash2 size={16} />
                        </button>
                        <button className="view-details">
                          View Details
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'detail' && activeTrip && (
          <TripDetail trip={activeTrip} onBack={() => { setView('dashboard'); fetchTrips(); }} />
        )}
      </div>

      {isAddingTrip && (
        <AddTripModal onClose={() => setIsAddingTrip(false)} onSuccess={() => { fetchTrips(); setIsAddingTrip(false); }} />
      )}
    </div>
  );
}


function AddTripModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return setError('A title is required for your journey.');

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save trip');
      }

      onSuccess();
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Something went wrong while saving your journey.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="premium-modal animate-fade" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        <div className="modal-header">
          <h2>Start New Journey</h2>
          <p>Tell us about your upcoming adventure.</p>
        </div>

        {error && <div className="system-notice warning">{error}</div>}

        <form onSubmit={handleSubmit} className="premium-form">
          <div className="form-group">
            <label>Trip Title</label>
            <input
              autoFocus
              className="premium-input-large"
              placeholder="e.g. Summer in Tokyo"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="premium-input"
              placeholder="Tell a bit about the purpose or theme..."
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Start date</label>
              <input
                type="date"
                className="premium-input"
                required
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="form-group flex-1">
              <label>End date</label>
              <input
                type="date"
                className="premium-input"
                required
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Estimated Budget ($)</label>
            <input
              type="number"
              className="premium-input"
              value={formData.budget}
              onChange={e => setFormData({ ...formData, budget: e.target.value })}
            />
          </div>

          <footer className="modal-footer">
            <button type="button" className="action-button secondary" onClick={onClose}>Discard</button>
            <button type="submit" className="action-button primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Trip'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default App;
