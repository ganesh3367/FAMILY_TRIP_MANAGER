import React, { useState, useEffect } from 'react';
import './App.css';
import TripDetail from './components/TripDetail';
import './components/TripDetail.css';
import LandingPage from './components/LandingPage';
import './components/LandingPage.css';

function App() {
  const [view, setView] = useState('landing');
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (view !== 'landing') loadTrips();
  }, [view]);

  async function loadTrips() {
    try {
      const res = await fetch('http://localhost:5001/api/trips');
      if (!res.ok) throw new Error('Database connection failed');
      const data = await res.json();
      setTrips(data);
      setError(null);
    } catch (err) {
      setError('System offline. Ensure database is connected.');
    }
  }

  const filtered = trips.filter(t => {
    const statusMatch = filter === 'all' || t.status === filter;
    const archiveMatch = showArchived ? t.isArchived : !t.isArchived;
    return statusMatch && archiveMatch;
  });

  return (
    <div className="app-container">
      <nav className="glass-nav">
        <div className="nav-content">
          <div className="brand" onClick={() => setView('landing')}>TripFlow</div>
          <div className="nav-menu">
            {view === 'landing' ? (
              <>
                <a href="#features" className="nav-item">Features</a>
                <a href="#workflow" className="nav-item">Workflow</a>
                <button className="nav-item active" onClick={() => setView('dashboard')}>Get Started</button>
              </>
            ) : (
              <>
                <button className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>Trips</button>
                <button className="nav-item">Explore</button>
                <button className={`nav-item ${view === 'detail' ? 'active' : ''}`}>Detail</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="content-area">
        {error && <div className="connection-error">{error}</div>}

        {view === 'landing' && (
          <div className="landing-wrapper animate-fade-in-long">
            <LandingPage onGetStarted={() => setView('dashboard')} />
          </div>
        )}

        {view === 'dashboard' && (
          <div className="dashboard animate-fade-in">
            <header className="page-header">
              <h1>{showArchived ? 'Archive' : 'Active Trips'}</h1>
              <div className="header-logic">
                <button className="btn btn-secondary" onClick={() => setShowArchived(!showArchived)}>
                  {showArchived ? 'Active' : 'Archived'}
                </button>
                <button className="btn btn-primary" onClick={() => setIsAddingTrip(true)}>Add Trip</button>
              </div>
            </header>

            <div className="filter-pills">
              {['all', 'upcoming', 'ongoing', 'completed'].map(f => (
                <button key={f} className={`pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="trip-grid">
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <h3>No journeys yet</h3>
                  <p>Ready to start a new adventure?</p>
                </div>
              ) : (
                filtered.map(trip => (
                  <div key={trip._id} className="trip-card glass-card" onClick={() => { setActiveTrip(trip); setView('detail'); }}>
                    <div className="card-top">
                      <span className={`badge ${trip.status}`}>{trip.status}</span>
                    </div>
                    <h3>{trip.title}</h3>
                    <div className="card-footer">
                      <span className="price-tag">${trip.budget}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'detail' && activeTrip && (
          <TripDetail trip={activeTrip} onBack={() => { setView('dashboard'); loadTrips(); }} />
        )}
      </main>

      {isAddingTrip && (
        <AddTripModal onClose={() => setIsAddingTrip(false)} onSuccess={() => { loadTrips(); setIsAddingTrip(false); }} />
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5001/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content">
        <h2>Plan New Trip</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Trip Title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="form-row">
            <input
              type="date"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={e => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
          <input
            type="number"
            placeholder="Budget"
            value={formData.budget}
            onChange={e => setFormData({ ...formData, budget: e.target.value })}
          />
          <div className="form-actions">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Trip</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
