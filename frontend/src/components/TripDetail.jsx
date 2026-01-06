import React, { useState, useEffect, useRef } from 'react';
import MapComponent from './MapComponent';
import WeatherWidget from './WeatherWidget';
import {
    Calendar,
    DollarSign,
    MapPin,
    Activity,
    Plane,
    Hotel,
    ChevronLeft,
    Plus,
    X,
    Cloud,
    Trash2,
    Clock,
    Tag,
    Navigation,
    ShoppingBag,
    ArrowRight
} from 'lucide-react';
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from '@react-google-maps/api';

const TripDetail = ({ trip, onBack }) => {
    const [activeTab, setActiveTab] = useState('budget');
    const [data, setData] = useState({
        destinations: [],
        transport: [],
        stays: [],
        activities: [],
        expenses: []
    });
    const [isAdding, setIsAdding] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: mapsKey || ""
    });

    useEffect(() => {
        loadTripData();
    }, [trip._id]);

    // Pull all related info for this trip
    const loadTripData = async () => {
        const sections = ['destinations', 'transport', 'stays', 'activities', 'expenses'];
        const results = {};

        try {
            await Promise.all(sections.map(async (key) => {
                let url = `${API_BASE_URL}/api/${key}`;
                // Special mapping for tripId query param
                if (key === 'destinations' || key === 'activities' || key === 'expenses') {
                    url += `/${trip._id}`;
                } else {
                    url += `/trip/${trip._id}`;
                }
                const res = await fetch(url);
                const fetchedData = await res.json();
                results[key] = Array.isArray(fetchedData) ? fetchedData : [];
            }));
            setData({
                destinations: results.destinations || [],
                transport: results.transport || [],
                stays: results.stays || [],
                activities: results.activities || [],
                expenses: results.expenses || []
            });
        } catch (err) {
            console.error('Data pull failed:', err);
        }
    };

    // Calculate totals for the budget view
    const totals = {
        stays: data.stays.reduce((acc, s) => acc + (Number(s.cost) || 0), 0),
        transport: data.transport.reduce((acc, t) => acc + (Number(t.cost) || 0), 0),
        misc: data.expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0)
    };
    const totalSpent = totals.stays + totals.transport + totals.misc;

    const handleDeleteTrip = async () => {
        if (!window.confirm("Delete this entire journey? This action cannot be undone.")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/trips/${trip._id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Delete failed');
            onBack(); // Go back to dashboard
        } catch (err) {
            console.error(err);
            alert("Failed to delete trip.");
        }
    };

    return (
        <div className="trip-details animate-fade">
            {isAdding && (
                <div className="side-overlay" onClick={() => setIsAdding(null)}>
                    <div className="side-panel" onClick={e => e.stopPropagation()}>
                        <header className="panel-header">
                            <h2>Add {isAdding.charAt(0).toUpperCase() + isAdding.slice(1)}</h2>
                            <button className="close-panel" onClick={() => setIsAdding(null)}><X size={20} /></button>
                        </header>
                        <AddForm
                            type={isAdding}
                            tripId={trip._id}
                            isLoaded={isLoaded}
                            onSuccess={() => { setIsAdding(null); loadTripData(); }}
                            onClose={() => setIsAdding(null)}
                        />
                    </div>
                </div>
            )}

            <header className="detail-header">
                <div className="header-top-row">
                    <button className="back-button" onClick={onBack}>
                        <ChevronLeft size={20} />
                        Back to Timeline
                    </button>
                    <button className="delete-trip-btn" onClick={handleDeleteTrip} title="Delete Entire Trip">
                        <Trash2 size={18} />
                        Delete Trip
                    </button>
                </div>
                <div className="header-main">
                    <h1>{trip.title}</h1>
                    <div className="trip-meta">
                        <span className={`status-pill ${trip.status}`}>{trip.status}</span>
                        <span className="date-sep">•</span>
                        <span>{new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </header>

            <div className="detail-grid">
                <aside className="detail-sidebar">
                    <nav className="tab-nav">
                        {[
                            { id: 'budget', label: 'Financials', icon: <DollarSign size={18} /> },
                            { id: 'itinerary', label: 'Itinerary', icon: <Calendar size={18} /> },
                            { id: 'cities', label: 'Places', icon: <MapPin size={18} /> },
                            { id: 'map', label: 'Map View', icon: <Navigation size={18} /> },
                            { id: 'transport', label: 'Transport', icon: <Plane size={18} /> },
                            { id: 'hotels', label: 'Stays', icon: <Hotel size={18} /> }
                        ].map(t => (
                            <button
                                key={t.id}
                                className={`tab-button ${activeTab === t.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(t.id)}
                            >
                                {t.icon}
                                {t.label}
                            </button>
                        ))}
                    </nav>

                    <div className="overall-budget-card">
                        <label>Total Budget</label>
                        <div className="budget-val big">${trip.budget}</div>
                        <div className="budget-progress">
                            <div className="progress-bar">
                                <div
                                    className={`progress-fill ${totalSpent > trip.budget ? 'over' : ''}`}
                                    style={{ width: `${Math.min((totalSpent / trip.budget) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <span>${totalSpent} spent ({Math.round((totalSpent / trip.budget) * 100)}%)</span>
                        </div>
                    </div>
                </aside>

                <main className="detail-content">
                    {activeTab === 'budget' && (
                        <div className="pane-viewSection">
                            <div className="pane-header">
                                <h2>Financial Breakdown</h2>
                                <button className="add-small" onClick={() => setIsAdding('expense')}>+ Add Expense</button>
                            </div>

                            <div className="summary-cards">
                                <div className="summary-card">
                                    <Hotel className="card-icon" />
                                    <div className="card-info">
                                        <label>Accommodations</label>
                                        <div className="value">${totals.stays}</div>
                                    </div>
                                </div>
                                <div className="summary-card">
                                    <Plane className="card-icon" />
                                    <div className="card-info">
                                        <label>Transportation</label>
                                        <div className="value">${totals.transport}</div>
                                    </div>
                                </div>
                                <div className="summary-card">
                                    <Tag className="card-icon" />
                                    <div className="card-info">
                                        <label>Miscellaneous</label>
                                        <div className="value">${totals.misc}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="expense-list">
                                <h3>Logged Expenses</h3>
                                {data.expenses.length === 0 ? (
                                    <div className="empty-section">No extra expenses recorded yet.</div>
                                ) : (
                                    data.expenses.map(e => (
                                        <div key={e._id} className="expense-row">
                                            <div className="expense-main">
                                                <span className="dot"></span>
                                                <div className="expense-text">
                                                    <div className="title">{e.title}</div>
                                                    <div className="meta">{e.category}</div>
                                                </div>
                                            </div>
                                            <div className="amount">${e.amount}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'itinerary' && (
                        <div className="pane-viewSection">
                            <div className="pane-header">
                                <h2>Itinerary Timeline</h2>
                                <button className="add-small" onClick={() => setIsAdding('activity')}>+ Plan Activity</button>
                            </div>

                            <div className="activity-timeline">
                                {data.activities.length === 0 ? (
                                    <div className="empty-section">Nothing planned yet. Start of by adding an activity.</div>
                                ) : (
                                    data.activities.map(act => (
                                        <div key={act._id} className="timeline-item">
                                            <div className="time-col">
                                                <div className="day">
                                                    {act.date ? new Date(act.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Anytime'}
                                                </div>
                                                <div className="slot">{act.timeSlot}</div>
                                            </div>
                                            <div className="content-card">
                                                <div className="card-header">
                                                    <h4>{act.title}</h4>
                                                    <span className={`priority ${act.priority}`}>{act.priority}</span>
                                                </div>
                                                <div className="card-body">
                                                    {act.location && <div className="loc"><MapPin size={14} /> {act.location}</div>}
                                                    {act.notes && <p className="notes">{act.notes}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'cities' && (
                        <div className="pane-viewSection">
                            <div className="pane-header">
                                <h2>Destinations</h2>
                                <button className="add-small" onClick={() => setIsAdding('dest')}>+ Add City</button>
                            </div>
                            <div className="cities-grid">
                                {data.destinations.map(d => (
                                    <div key={d._id} className="city-card">
                                        <div className="city-info">
                                            <h3>{d.name}</h3>
                                            <p>{d.country}</p>
                                        </div>
                                        <div className="city-extra">
                                            <WeatherWidget city={d.name} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'map' && (
                        <div className="pane-viewSection full-pane">
                            <div className="pane-header">
                                <h2>Trip Journey Visualization</h2>
                            </div>
                            <MapComponent destinations={data.destinations} isLoaded={isLoaded} />
                        </div>
                    )}

                    {activeTab === 'transport' && (
                        <div className="pane-viewSection">
                            <div className="pane-header">
                                <h2>Transportation</h2>
                                <button className="add-small" onClick={() => setIsAdding('transport')}>+ Add Transport</button>
                            </div>
                            <div className="transport-stack">
                                {data.transport.map(t => (
                                    <div key={t._id} className="transport-card">
                                        <div className="icon"><Plane size={24} /></div>
                                        <div className="info">
                                            <div className="type">{t.type}</div>
                                            <div className="route">{t.departureLocation} → {t.arrivalLocation}</div>
                                        </div>
                                        <div className="cost">${t.cost}</div>
                                    </div>
                                ))}
                                {data.transport.length === 0 && <div className="empty-section">No transport logs yet.</div>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'hotels' && (
                        <div className="pane-viewSection">
                            <div className="pane-header">
                                <h2>Accommodations</h2>
                                <button className="add-small" onClick={() => setIsAdding('stay')}>+ Add Stay</button>
                            </div>
                            <div className="stays-grid">
                                {data.stays.map(s => (
                                    <div key={s._id} className="stay-card">
                                        <h3>{s.name}</h3>
                                        <p className="addr">{s.address}</p>
                                        <div className="stay-footer">
                                            <span>{new Date(s.checkIn).toLocaleDateString()}</span>
                                            <span className="stay-cost">${s.cost}</span>
                                        </div>
                                    </div>
                                ))}
                                {data.stays.length === 0 && <div className="empty-section">No stays recorded yet.</div>}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const AddForm = ({ type, tripId, isLoaded, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        type: 'Flight',
        category: 'General',
        priority: 'medium',
        date: '',
        timeSlot: 'Morning',
        distance: '',
        duration: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const destRef = useRef(null);
    const originRef = useRef(null);

    // Google Places Autocomplete setup
    const onPlaceChanged = () => {
        if (destRef.current) {
            const place = destRef.current.getPlace();
            if (place.geometry) {
                const countryObj = place.address_components?.find(c => c.types.includes('country'));
                const country = countryObj ? countryObj.long_name : '';

                setFormData(prev => ({
                    ...prev,
                    name: place.name,
                    formatted_address: place.formatted_address,
                    country: country, // Added country extraction
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                }));
            }
        }
    };

    const onOriginChanged = () => {
        if (originRef.current) {
            const place = originRef.current.getPlace();
            setFormData(prev => ({ ...prev, origin: place.formatted_address }));
        }
    };

    // Auto-calculate travel metrics if origin/dest are set
    const fetchTravelStats = async () => {
        if (!isLoaded || !formData.origin || !formData.name) return;

        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [formData.origin],
            destinations: [formData.name],
            travelMode: 'DRIVING'
        }, (response, status) => {
            if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
                const element = response.rows[0].elements[0];
                setFormData(prev => ({
                    ...prev,
                    distance: element.distance.text,
                    duration: element.duration.text
                }));
            }
        });
    };

    async function handleSave(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Map simplified types to collection names
        let endpoint = type === 'todo' ? 'todos' : type === 'expense' ? 'expenses' : type;
        if (type === 'activity') endpoint = 'activities';
        if (type === 'stay') endpoint = 'stays';
        if (type === 'dest') endpoint = 'destinations';

        try {
            const res = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tripId, ...formData })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to save');
            }
            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSave} className="premium-side-form">
            {error && <div className="system-notice warning">{error}</div>}

            {type === 'activity' && (
                <div className="form-fields-stack">
                    <div className="form-field">
                        <label>Activity Title</label>
                        <input className="premium-input" required placeholder="Museum visit, Dinner, etc." value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="form-field">
                        <label>Date & Time</label>
                        <div className="form-row">
                            <input type="date" className="premium-input flex-1" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            <select className="premium-input flex-1" value={formData.timeSlot} onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}>
                                <option>Morning</option>
                                <option>Afternoon</option>
                                <option>Evening</option>
                                <option>Night</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-field">
                        <label>Priority</label>
                        <div className="option-shelf">
                            {['low', 'medium', 'high'].map(p => (
                                <button type="button" key={p} className={`shelf-pill ${formData.priority === p ? 'selected' : ''}`} onClick={() => setFormData({ ...formData, priority: p })}>{p}</button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {type === 'dest' && (
                <div className="form-fields-stack">
                    <div className="form-field">
                        <label>Destination City</label>
                        {isLoaded ? (
                            <Autocomplete onLoad={ref => destRef.current = ref} onPlaceChanged={onPlaceChanged}>
                                <input className="premium-input" placeholder="Search for a city..." required />
                            </Autocomplete>
                        ) : (
                            <input className="premium-input" placeholder="City name" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        )}
                    </div>
                    <div className="form-field">
                        <label>Traveling from</label>
                        {isLoaded ? (
                            <Autocomplete onLoad={ref => originRef.current = ref} onPlaceChanged={onOriginChanged}>
                                <input className="premium-input" placeholder="Origin city..." onBlur={fetchTravelStats} />
                            </Autocomplete>
                        ) : (
                            <input className="premium-input" placeholder="Origin" />
                        )}
                    </div>
                    {(formData.distance || formData.duration) && (
                        <div className="travel-metrics-badge glass-card animate-slide-up">
                            <div className="metric">
                                <span className="label">Distance</span>
                                <span className="val">{formData.distance}</span>
                            </div>
                            <div className="divider"></div>
                            <div className="metric">
                                <span className="label">Travel Time</span>
                                <span className="val">{formData.duration}</span>
                            </div>
                        </div>
                    )}
                    <div className="mini-map-container glass-card">
                        {isLoaded && mapsKey ? (
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '1.5rem' }}
                                center={formData.lat ? { lat: Number(formData.lat), lng: Number(formData.lng) } : { lat: 20, lng: 0 }}
                                zoom={formData.lat ? 10 : 2}
                                options={{ disableDefaultUI: true }}
                            >
                                {formData.lat && <Marker position={{ lat: Number(formData.lat), lng: Number(formData.lng) }} />}
                            </GoogleMap>
                        ) : (
                            <div className="map-placeholder">
                                <div className="setup-hint">
                                    <MapPin size={32} />
                                    <h4>Map Experience Restricted</h4>
                                    <p>Please configure your Google Maps API key to enable interactive routing and city suggestions.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {type === 'transport' && (
                <div className="form-fields-stack">
                    <div className="form-field">
                        <label>Transport Mode</label>
                        <div className="option-shelf">
                            {['Flight', 'Train', 'Car', 'Bus'].map(m => (
                                <button type="button" key={m} className={`shelf-pill ${formData.type === m ? 'selected' : ''}`} onClick={() => setFormData({ ...formData, type: m })}>{m}</button>
                            ))}
                        </div>
                    </div>
                    <div className="form-field">
                        <label>Route</label>
                        <div className="form-row">
                            <input className="premium-input flex-1" placeholder="Departure" value={formData.departureLocation || ''} onChange={e => setFormData({ ...formData, departureLocation: e.target.value })} />
                            <input className="premium-input flex-1" placeholder="Arrival" value={formData.arrivalLocation || ''} onChange={e => setFormData({ ...formData, arrivalLocation: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-field">
                        <label>Cost ($)</label>
                        <input type="number" className="premium-input" value={formData.cost || 0} onChange={e => setFormData({ ...formData, cost: e.target.value })} />
                    </div>
                </div>
            )}

            {type === 'stay' && (
                <div className="form-fields-stack">
                    <div className="form-field">
                        <label>Accommodation Name</label>
                        <input className="premium-input" required placeholder="Hotel, AirBnB, etc." value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="form-field">
                        <label>Address</label>
                        <input className="premium-input" placeholder="Full address..." value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    </div>
                    <div className="form-field">
                        <label>Cost per stay ($)</label>
                        <input type="number" className="premium-input" value={formData.cost || 0} onChange={e => setFormData({ ...formData, cost: e.target.value })} />
                    </div>
                </div>
            )}

            {type === 'expense' && (
                <div className="form-fields-stack">
                    <div className="form-field">
                        <label>Expense Name</label>
                        <input className="premium-input" required placeholder="Souvenirs, Food, etc." value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="form-field">
                        <label>Amount ($)</label>
                        <input type="number" className="premium-input" required value={formData.amount || 0} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                    </div>
                    <div className="form-field">
                        <label>Category</label>
                        <select className="premium-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                            <option>Food</option>
                            <option>Shopping</option>
                            <option>Transport</option>
                            <option>General</option>
                        </select>
                    </div>
                </div>
            )}

            <button type="submit" className="action-button primary" disabled={loading} style={{ width: '100%', marginTop: 'auto' }}>
                {loading ? 'Saving...' : 'Add to Trip'}
            </button>
        </form>
    );
};

export default TripDetail;
