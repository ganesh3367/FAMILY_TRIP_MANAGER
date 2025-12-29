import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
    return (
        <div className="landing-container">
            <header className="hero">
                <div className="hero-content">
                    <div className="badge animate-fade-in">New: Smart Itinerary Assistant ⚡️</div>
                    <h1 className="hero-title animate-fade-in">
                        Travel planning, <br />
                        <span className="title-gradient">reimagined for families.</span>
                    </h1>
                    <p className="hero-subtitle animate-fade-in-delayed">
                        Effortlessly organize multi-city adventures, track family expenses,
                        and create memories. All in one beautifully simple interface.
                    </p>
                    <div className="hero-actions animate-fade-in-delayed">
                        <button className="btn btn-primary hero-btn" onClick={onGetStarted}>
                            Plan Your First Trip
                        </button>
                        <button className="btn btn-secondary hero-btn">
                            Explore Demo
                        </button>
                    </div>
                </div>
            </header>

            <section className="stats-section animate-fade-in-delayed">
                <div className="stats-grid">
                    <div className="stat-item">
                        <h2>50k+</h2>
                        <p>Trips Planned</p>
                    </div>
                    <div className="stat-item">
                        <h2>120+</h2>
                        <p>Countries Covered</p>
                    </div>
                    <div className="stat-item">
                        <h2>4.9/5</h2>
                        <p>User Rating</p>
                    </div>
                </div>
            </section>

            <section id="features" className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Everything you need, <br /> none of the clutter.</h2>
                </div>
                <div className="features-grid">
                    <div className="feature-card glass-card">
                        <div className="feature-icon">🏨</div>
                        <h3>Stay & Transport</h3>
                        <p>Manage flights, hotels, and rentals in one unified timeline with booking IDs and reminders.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">🍱</div>
                        <h3>Daily Itineraries</h3>
                        <p>Design detailed daily schedules with time-slots, map pins, and collaborative notes.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">🧾</div>
                        <h3>Expense Tracking</h3>
                        <p>Automatic budget calculations and multi-currency support for stress-free family spending.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">👯‍♀️</div>
                        <h3>Family Sync</h3>
                        <p>Keep everyone updated with real-time sync across all your family members' devices.</p>
                    </div>
                </div>
            </section>

            <section id="workflow" className="workflow-section">
                <div className="workflow-card glass-card hero-bg-blur">
                    <div className="workflow-content">
                        <h2 className="section-title">Seamless Experience</h2>
                        <div className="workflow-steps">
                            <div className="step">
                                <div className="step-number">01</div>
                                <div>
                                    <h4>Dream & Create</h4>
                                    <p>Set your destination and dates. Duplicate past successful trips to get started in seconds.</p>
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-number">02</div>
                                <div>
                                    <h4>Book & Track</h4>
                                    <p>Add your transport legs and stays. Watch your budget update in real-time as you plan.</p>
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-number">03</div>
                                <div>
                                    <h4>Enjoy the Journey</h4>
                                    <p>Focus on the fun. Your detailed itinerary and task lists keep the logistics effortless.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <div className="footer-links">
                    <a href="#">Security</a>
                    <a href="#">Legal</a>
                    <a href="#">Support</a>
                </div>
                <p>© 2025 TripFlow Inc. Designed for families, by families.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
