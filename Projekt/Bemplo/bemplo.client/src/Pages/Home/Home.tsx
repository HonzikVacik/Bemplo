import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <>
            <div className="home-page">
                <div className="background-animation"></div>

                <div className="wrapper">
                    <div className="glass-container">

                        <section className="hero-section">
                            <h1 className="gradient-text main-brand">Bemplo</h1>

                            <h2 className="hero-slogan">Váš most k novým příležitostem</h2>

                            <p className="subtitle">
                                Spojujeme talentované lidi s inovativními firmami.
                                Ať už hledáte práci snů, nebo ideálního kandidáta do týmu,
                                jste na správném místě.
                            </p>

                            <div className="cta-group">
                                <Link to="/search" className="btn btn-primary btn-large">
                                    Začít vyhledávat
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </Link>
                                <Link to="/register" className="btn btn-secondary btn-large">
                                    Vytvořit účet
                                </Link>
                            </div>

                            <div className="login-link-wrapper">
                                <span className="login-text">Již u nás máte účet? </span>
                                <Link to="/login" className="login-link">Přihlaste se</Link>
                            </div>
                        </section>

                        {/* ODDĚLOVAČ */}
                        <div className="divider"></div>

                        <section className="features-section">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <h3>Transparentní hodnocení</h3>
                                <p>Díky unikátnímu systému hvězdiček přesně víte, s kým jednáte. Hodnocení reflektují reálné zkušenosti z praxe.</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3>Přímá komunikace</h3>
                                <p>Žádní prostředníci. Našli jste zajímavý profil? Okamžitě navažte kontakt pomocí integrovaného chatu.</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3>Chytré profily</h3>
                                <p>Ukažte své dovednosti, nabídku i historii práce. Detailní profily pomáhají lepšímu a rychlejšímu propojení.</p>
                            </div>
                        </section>

                        <footer className="home-footer">
                            <p>© 2026 Bemplo. Všechna práva vyhrazena.</p>
                            <Link to="/privacypolicy">Zásady ochrany osobních údajů</Link>
                        </footer>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;