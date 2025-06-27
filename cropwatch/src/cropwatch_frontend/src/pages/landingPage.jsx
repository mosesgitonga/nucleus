import React from "react";
import "./landingPage.css";

const LandingPage = () => {
    return (
        <div className="landing-container">
            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <h1 className="hero-title">🌾 Nucleus Smart Farming</h1>
                    <p className="hero-subtitle">
                        Diagnose. Predict. Protect. <br />
                        AI-powered plant disease detection meets blockchain transparency—empowering farmers, protecting harvests.
                    </p>
                    <div className="hero-cta">
                        <a href="/predict" className="cta-button primary">
                            🚀 Try Diagnosis
                        </a>
                        <a href="/map" className="cta-button secondary">
                            🗺️ View Outbreak Map
                        </a>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-number">40%</div>
                            <div className="stat-label">Crop Loss Prevented</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Real-Time AI Support</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">100%</div>
                            <div className="stat-label">Blockchain-Secured Insights</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE CHALLENGE */}
            <section className="problem-solution">
                <div className="container">
                    <div className="section-grid">
                        <div className="problem-card">
                            <div className="card-icon">🚨</div>
                            <h2 className="card-title">The Challenge</h2>
                            <p className="card-text">
                                Every year, millions of farmers across Africa lose up to <strong>40% of their crops</strong> due to undiagnosed plant diseases. Most don’t have access to agronomists, labs, or localized treatment advice.
                            </p>
                            <ul className="problem-list">
                                <li>❌ No access to crop experts</li>
                                <li>❌ Delayed interventions</li>
                                <li>❌ Poor data on regional outbreaks</li>
                                <li>❌ Language and literacy gaps in advisory services</li>
                            </ul>
                        </div>

                        <div className="solution-card">
                            <div className="card-icon">💡</div>
                            <h2 className="card-title">The Solution: Nucleus</h2>
                            <p className="card-text">
                                Nucleus empowers farmers to instantly detect crop diseases using AI and contributes this data to a decentralized blockchain network built on the Internet Computer (ICP). Together, we create a real-time map of plant health across Kenya.
                            </p>
                            <ul className="solution-list">
                                <li>✅ Instant AI image diagnosis</li>
                                <li>✅ Swahili + English support</li>
                                <li>✅ SMS alerts on disease outbreaks</li>
                                <li>✅ Blockchain-verified, open-access data</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="tech-showcase">
                <div className="container">
                    <h2 className="section-title">🔬 Under the Hood</h2>
                    <p className="section-subtitle">
                        A fusion of machine learning, mobile-first UX, and Web3 infrastructure.
                    </p>
                    <div className="tech-grid">
                        <div className="tech-card">
                            <div className="tech-icon">🧠</div>
                            <h3>AI Diagnosis</h3>
                            <p>Upload a photo. Our CNN model trained on thousands of plant images gives instant results.</p>
                        </div>
                        <div className="tech-card">
                            <div className="tech-icon">⛓️</div>
                            <h3>ICP Smart Contracts</h3>
                            <p>We store disease data securely on the blockchain—transparent, immutable, open for analysis.</p>
                        </div>
                        <div className="tech-card">
                            <div className="tech-icon">📍</div>
                            <h3>Geo Disease Tracking</h3>
                            <p>Each diagnosis is tagged by location to build an up-to-date national disease map.</p>
                        </div>
                        <div className="tech-card">
                            <div className="tech-icon">📲</div>
                            <h3>SMS Alert System</h3>
                            <p>Nearby farmers get notified immediately when outbreaks happen in their region.</p>
                        </div>
                    </div>

                    <div className="tech-details">
                        <div className="tech-badge">📦 FastAPI + PyTorch</div>
                        <div className="tech-badge">🌐 Internet Computer (ICP)</div>
                        <div className="tech-badge">🔍 Decentralized Observability</div>
                        <div className="tech-badge">📡 Offline-Ready SMS Integration</div>
                    </div>
                </div>
            </section>

            {/* MAP SHOWCASE */}
            <section className="map-showcase">
                <div className="container">
                    <div className="map-content">
                        <div className="map-info">
                            <h2 className="map-title">🔥 Live Outbreak Heatmap</h2>
                            <p className="map-description">
                                We’re crowdsourcing the fight against crop diseases. Every diagnosis updates our national disease map—informing farmers, researchers, and policymakers in real time.
                            </p>
                            <div className="map-features">
                                <div className="map-feature">📍 Location-Aware Reports</div>
                                <div className="map-feature">⚡ Updated in Real-Time</div>
                                <div className="map-feature">🔐 Tamper-Proof via Blockchain</div>
                                <div className="map-feature">🌐 Open Data for Everyone</div>
                            </div>
                            <a href="/map" className="cta-button map-cta">
                                🗺️ Explore the Map
                            </a>
                        </div>
                        <div className="map-visual">
                            <div className="map-placeholder">
                                <div className="heat-point heat-1"></div>
                                <div className="heat-point heat-2"></div>
                                <div className="heat-point heat-3"></div>
                                <div className="map-label">Kenya Disease Spread</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* IMPACT SECTION */}
            <section className="impact">
                <div className="container">
                    <h2 className="section-title">📈 Impact at Scale</h2>
                    <div className="impact-grid">
                        <div className="impact-card">
                            <div className="impact-icon">🍚</div>
                            <h3>Food Security</h3>
                            <p>Prevent losses, improve yields, and reduce hunger across Kenyan counties.</p>
                        </div>
                        <div className="impact-card">
                            <div className="impact-icon">🎓</div>
                            <h3>Farmer Education</h3>
                            <p>AI that speaks the farmer’s language—both literally and contextually.</p>
                        </div>
                        <div className="impact-card">
                            <div className="impact-icon">📢</div>
                            <h3>Policy Guidance</h3>
                            <p>Real data means real insights for agricultural policy makers and NGOs.</p>
                        </div>
                        <div className="impact-card">
                            <div className="impact-icon">🌍</div>
                            <h3>Decentralized Development</h3>
                            <p>Inclusive systems where farmers contribute to and benefit from open data.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI MODEL BADGE */}
            <section className="ai-integration">
                <div className="container">
                    <div className="ai-badge">
                        ✨ Powered by Google Gemini AI
                    </div>
                    <p className="ai-description">
                        Our model goes beyond detection—it suggests localized, actionable advice for every diagnosis, tailored to the farmer’s region and resources.
                    </p>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="final-cta">
                <div className="container">
                    <h2 className="cta-title">Ready to Revolutionize Farming?</h2>
                    <p className="cta-subtitle">
                        Upload. Diagnose. Prevent. Together, we can secure Africa’s food future.
                    </p>
                    <div className="final-buttons">
                        <a href="/predict" className="cta-button primary large">
                            🌱 Try It Now
                        </a>
                        <a href="/map" className="cta-button secondary large">
                            🗺️ Track Outbreaks
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
