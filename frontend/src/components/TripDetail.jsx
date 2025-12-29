import React, { useState, useEffect } from 'react';

const TripDetail = ({ trip, onBack }) => {
    const [tab, setTab] = useState('budget');
    const [destinations, setDestinations] = useState([]);
    const [transport, setTransport] = useState([]);
    const [stays, setStays] = useState([]);
    const [activities, setActivities] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [adding, setAdding] = useState(null);

    useEffect(() => {
        loadContent();
    }, [trip._id]);

    async function loadContent() {
        const urls = [
            `http://localhost:5001/api/destinations/${trip._id}`,
            `http://localhost:5001/api/transport/trip/${trip._id}`,
            `http://localhost:5001/api/stays/trip/${trip._id}`,
            `http://localhost:5001/api/activities/${trip._id}`,
            `http://localhost:5001/api/expenses/${trip._id}`
        ];

        try {
            const results = await Promise.all(urls.map(url => fetch(url).then(r => r.json())));
            setDestinations(results[0]);
            setTransport(results[1]);
            setStays(results[2]);
            setActivities(results[3]);
            setExpenses(results[4]);
        } catch (e) {
            console.error(e);
        }
    }

    const stayTotal = stays.reduce((sum, s) => sum + (s.cost || 0), 0);
    const transitTotal = transport.reduce((sum, t) => sum + (t.cost || 0), 0);
    const miscTotal = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const grandTotal = stayTotal + transitTotal + miscTotal;

    return (
        <div className="trip-flow-detail animate-fade-in">
            {adding && (
                <div className="overlay">
                    <div className="glass-card modal">
                        <h3>Add New {adding}</h3>
                        <AddForm
                            type={adding}
                            tripId={trip._id}
                            onClose={() => setAdding(null)}
                            onSuccess={() => { setAdding(null); loadContent(); }}
                        />
                    </div>
                </div>
            )}

            <div className="detail-hero glass-card">
                <div className="hero-nav">
                    <button className="back-link" onClick={onBack}>← Back to Dashboard</button>
                    <span className={`status ${trip.status}`}>{trip.status}</span>
                </div>
                <h2 className="title">{trip.title}</h2>
                <p className="desc">{trip.description}</p>

                <div className="budget-overview">
                    <div className="stat">
                        <label>Planned Budget</label>
                        <div className="val">${trip.budget}</div>
                    </div>
                    <div className="stat">
                        <label>Actual Costs</label>
                        <div className="val cost">${grandTotal}</div>
                    </div>
                    <div className="stat">
                        <label>Remaining</label>
                        <div className={`val ${trip.budget - grandTotal < 0 ? 'over' : 'safe'}`}>
                            ${trip.budget - grandTotal}
                        </div>
                    </div>
                </div>
            </div>

            <nav className="tab-menu">
                {['budget', 'itinerary', 'cities', 'flights', 'hotels'].map(t => (
                    <button key={t} className={`tab-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </nav>

            <div className="tab-pane glass-card">
                {tab === 'budget' && (
                    <div className="cost-dashboard">
                        <h3>Expense Summary</h3>
                        <div className="cost-grid">
                            <div className="cost-card">
                                <h4>Accommodations</h4>
                                <div className="total">${stayTotal}</div>
                            </div>
                            <div className="cost-card">
                                <h4>Transportation</h4>
                                <div className="total">${transitTotal}</div>
                            </div>
                            <div className="cost-card">
                                <h4>Miscellaneous</h4>
                                <div className="total">${miscTotal}</div>
                            </div>
                        </div>

                        <div className="recent-costs">
                            <h4>Expended Items</h4>
                            {expenses.length === 0 ? <p className="empty">No expenses logged.</p> :
                                expenses.map(e => (
                                    <div key={e._id} className="cost-row">
                                        <span>{e.title}</span>
                                        <span className="price">${e.amount}</span>
                                    </div>
                                ))
                            }
                            <button className="btn-add" onClick={() => setAdding('expense')}>+ Log Expense</button>
                        </div>
                    </div>
                )}

                {tab === 'itinerary' && (
                    <div className="timeline-pane">
                        <h3>Schedule</h3>
                        {activities.length === 0 ? <p className="empty">Nothing planned yet.</p> :
                            activities.map(act => (
                                <div key={act._id} className="plan-item">
                                    <div className="time">{act.timeSlot || 'Day'}</div>
                                    <div className="info">
                                        <h4>{act.title}</h4>
                                        {act.location && <p>📍 {act.location}</p>}
                                    </div>
                                </div>
                            ))
                        }
                        <button className="btn-add" onClick={() => setAdding('activity')}>+ Add to Schedule</button>
                    </div>
                )}

                {tab === 'cities' && (
                    <div className="places-pane">
                        <h3>Destinations</h3>
                        <div className="place-grid">
                            {destinations.map(d => (
                                <div key={d._id} className="place-card">
                                    <h4>{d.name}</h4>
                                    <p>{d.country}</p>
                                </div>
                            ))}
                        </div>
                        <button className="btn-add" onClick={() => setAdding('dest')}>+ Add City</button>
                    </div>
                )}

                {tab === 'flights' && (
                    <div className="transit-pane">
                        <h3>Transit</h3>
                        {transport.map(t => (
                            <div key={t._id} className="transit-row">
                                <span className="type">{t.type}</span>
                                <span className="route">{t.departureLocation} → {t.arrivalLocation}</span>
                                <span className="cost">${t.cost}</span>
                            </div>
                        ))}
                        <button className="btn-add" onClick={() => setAdding('transport')}>+ Add Transit</button>
                    </div>
                )}

                {tab === 'hotels' && (
                    <div className="stays-pane">
                        <h3>Stays</h3>
                        {stays.map(s => (
                            <div key={s._id} className="stay-row">
                                <div className="stay-info">
                                    <h4>{s.name}</h4>
                                    <p>{s.address}</p>
                                </div>
                                <span className="cost">${s.cost}</span>
                            </div>
                        ))}
                        <button className="btn-add" onClick={() => setAdding('stay')}>+ Add Stay</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const AddForm = ({ type, tripId, onClose, onSuccess }) => {
    const [data, setData] = useState({ type: 'Flight', category: 'General', priority: 'medium' });

    async function save(e) {
        e.preventDefault();
        let entity = type === 'todo' ? 'todos' : type === 'expense' ? 'expenses' : type + 's';
        if (type === 'activity') entity = 'activities';
        if (type === 'dest') entity = 'destinations';

        try {
            await fetch(`http://localhost:5001/api/${entity}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tripId, ...data })
            });
            onSuccess();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form onSubmit={save} className="add-form">
            {type === 'activity' && (
                <>
                    <input className="large" placeholder="What are we doing?" onChange={e => setData({ ...data, title: e.target.value })} required />
                    <div className="row">
                        <input type="date" onChange={e => setData({ ...data, date: e.target.value })} />
                        <input placeholder="TimeSlot" onChange={e => setData({ ...data, timeSlot: e.target.value })} />
                    </div>
                </>
            )}
            {type === 'dest' && (
                <>
                    <input className="large" placeholder="City Name" onChange={e => setData({ ...data, name: e.target.value })} required />
                    <input placeholder="Country" onChange={e => setData({ ...data, country: e.target.value })} />
                </>
            )}
            {type === 'transport' && (
                <>
                    <div className="selector">
                        {['Flight', 'Train', 'Bus', 'Car'].map(m => (
                            <button key={m} type="button" className={data.type === m ? 'active' : ''} onClick={() => setData({ ...data, type: m })}>{m}</button>
                        ))}
                    </div>
                    <div className="row">
                        <input placeholder="From" onChange={e => setData({ ...data, departureLocation: e.target.value })} />
                        <input placeholder="To" onChange={e => setData({ ...data, arrivalLocation: e.target.value })} />
                    </div>
                    <input type="number" placeholder="Cost" onChange={e => setData({ ...data, cost: e.target.value })} />
                </>
            )}
            {type === 'stay' && (
                <>
                    <input className="large" placeholder="Place Name" onChange={e => setData({ ...data, name: e.target.value })} required />
                    <input placeholder="Address" onChange={e => setData({ ...data, address: e.target.value })} />
                    <input type="number" placeholder="Cost" onChange={e => setData({ ...data, cost: e.target.value })} />
                </>
            )}
            {type === 'expense' && (
                <>
                    <input className="large" placeholder="What did you buy?" onChange={e => setData({ ...data, title: e.target.value })} required />
                    <input type="number" placeholder="Cost" onChange={e => setData({ ...data, amount: e.target.value })} />
                </>
            )}
            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Discard</button>
                <button type="submit" className="btn btn-primary">Save Item</button>
            </div>
        </form>
    );
};

export default TripDetail;
