import React from "react";
import "./landingPage.css";

const LandingPage = () => {
    return (
        <div className="landing-container">
            {/* HEADER */}
            <header className="landing-header">
                <h1 className="landing-title">🌿 Nucleus Smart Farming</h1>
                <p className="landing-subtitle">
                    Empowering African farmers with AI diagnosis and decentralized crop intelligence on the blockchain.
                </p>

                {/* Top CTA */}
                <div className="cta-top">
                    <a href="/predict" className="cta-button">🚀 Try Live Diagnosis</a>
                </div>
            </header>

            {/* PROBLEM */}
            <section className="landing-section">
                <h2 className="section-title">What is Nucleus?</h2>
                <p className="section-text">
                    <strong>Nucleus</strong> is a smart farming assistant that lets farmers upload a photo
                    of a diseased plant and receive instant diagnosis using a custom-trained Convolutional Neural Network (CNN).
                    Powered by the <strong>Internet Computer (ICP)</strong> blockchain, each diagnosis is securely recorded on-chain, ensuring transparency and building a decentralized disease map of Kenya.
                    Results come with English or Swahili treatment advice, and every prediction enhances future AI models for greater accuracy.
                </p>
                <h2 className="section-title">🚨 The Problem</h2>
                <p className="section-text">
                    Up to 40% of crop losses in sub-Saharan Africa are due to undiagnosed plant diseases.
                    Many farmers lack access to agronomists or early warning systems, leading to late
                    interventions, reduced yields, and rising food insecurity. Existing digital tools are
                    centralized, prone to data silos, and lack localized disease insights or offline access.
                </p>
            </section>

            {/* SOLUTION */}
            <section className="landing-section">
                <h2 className="section-title">💡 Our Solution</h2>
                <p className="section-text">
                    <strong>Nucleus</strong> combines AI and blockchain to revolutionize farming. Farmers upload a plant photo for instant CNN-based diagnosis, paired with tailored advice in English or Swahili.
                    Using the Internet Computer’s decentralized ledger, we store each prediction’s metadata (disease type, location, timestamp) immutably, creating a public, tamper-proof record.
                    This crowd-sourced data builds a real-time disease map, empowering farmers and researchers with actionable insights.
                </p>
            </section>

            <section className="landing-section">
                <p className="section-text">
                    🌿 <em>This treatment advice is powered by <strong>Gemini</strong>, an advanced language model
                        that generates recommendations based on the disease detected and local farming practices.</em>
                </p>
            </section>

            {/* BLOCKCHAIN TECH */}
            <section className="landing-section">
                <h2 className="section-title">🔗 Built on the Internet Computer</h2>
                <p className="section-text">
                    Nucleus harnesses the <strong>Internet Computer (ICP)</strong> blockchain to deliver a decentralized, transparent, and censorship-resistant platform.
                    Each diagnosis is stored as metadata (disease type, timestamp, geo-location) in ICP’s smart contracts, called canisters, ensuring data integrity without requiring farmers to manage accounts or crypto wallets.
                    This blockchain-based approach guarantees that disease data is publicly accessible, tamper-proof, and owned by the community, not a central authority.
                    <br /><br />
                    Over time, Nucleus evolves into a decentralized data oracle, enabling farmers, researchers (e.g., students), NGOs (e.g., World Food Programme), and policymakers (e.g., Ministry of Agriculture) to access a living, crowd-sourced disease map for better decision-making.
                    By leveraging blockchain, we ensure data sovereignty for Kenyan farmers and foster trust in the system.
                </p>
                <ul className="tech-points">
                    <li>📦 AI model served via FastAPI (PyTorch)</li>
                    <li>🧠 Model trained on tomato disease images</li>
                    <li>🛢️ Metadata stored in ICP canister smart contracts</li>
                    <li>🔍 Transparent, decentralized, and community-owned data</li>
                    <li>🌍 Scalable to support regional disease tracking</li>
                </ul>
            </section>

            {/* IMPACT */}
            <section className="landing-section">
                <h2 className="section-title">📈 Social & Economic Impact</h2>
                <p className="section-text">
                    - Boosts food production by enabling rapid response to disease outbreaks using blockchain-verified data.
                    - Empowers farmers with independence from expensive consultants through decentralized, accessible tools.
                    - Drives data-driven agriculture policy with real-time, transparent disease maps stored on the blockchain.
                    - Scalable for future features like pest detection, weather integration, or Swahili voice feedback, all secured by ICP.
                    - Fosters trust and collaboration among farmers, researchers, and policymakers via a decentralized data ecosystem.
                </p>
            </section>

            {/* CTA */}
            <div className="cta-bottom">
                <a href="/predict" className="cta-button">🌱 Try the Diagnosis Tool →</a>
            </div>
        </div>
    );
};

export default LandingPage;