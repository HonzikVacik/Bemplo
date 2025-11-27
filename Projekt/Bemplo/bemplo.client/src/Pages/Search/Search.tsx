import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Search.css';

function Search() {
    // Stav pro zobrazení/skrytí filtrů
    const [showFilters, setShowFilters] = useState(false);
    // Stav pro hodnotu hodnocení (slider)
    const [rating, setRating] = useState(50);

    // Funkce pro přepínání filtrů
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <>
            <div className="search-page">

                <div className="background-animation"></div>

                <div className="wrapper">
                    <div className="glass-container">

                        <header className="search-header">
                            <Link to="/dashboard" className="btn-icon back-btn" title="Zpět">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>

                            <div className="search-bar">
                                <input type="text" placeholder="Zadejte hledaný výraz..." />
                            </div>

                            <button type="button" className="btn-icon search-btn" title="Hledat">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </header>

                        <div className="filters-section">
                            <button className="filter-toggle" onClick={toggleFilters}>
                                <span>Filtr</span>
                                {/* Šipka se otáčí podmíněným přidáním třídy 'rotate' */}
                                <svg
                                    id="filterArrow"
                                    className={showFilters ? 'rotate' : ''}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Obsah filtrů se zobrazí podmíněným přidáním třídy 'active' */}
                            <div className={`filters-content ${showFilters ? 'active' : ''}`} id="filtersContent">

                                <div className="filter-group">
                                    <label>Lokace</label>
                                    <input type="text" placeholder="Např. Praha" className="filter-input" />
                                </div>

                                <div className="filter-group">
                                    <label>Uživatel</label>
                                    <input type="text" placeholder="Jméno uživatele" className="filter-input" />
                                </div>

                                <div className="filter-group">
                                    <label>Hodnocení: <span id="ratingVal">{rating}%</span></label>
                                    <div className="range-wrapper">
                                        <span className="range-label">0%</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={rating}
                                            className="custom-range"
                                            onChange={(e) => setRating(Number(e.target.value))}
                                        />
                                        <span className="range-label">100%</span>
                                    </div>
                                </div>

                                <div className="filter-group checkbox-group">
                                    <input type="checkbox" id="includeUnrated" />
                                    <label htmlFor="includeUnrated">Zahrnout nehodnocené</label>
                                </div>

                            </div>
                        </div>

                        <div className="search-results">

                            <div className="result-card">
                                <h3>Jan Novák</h3>
                                <p>Grafický designér se zaměřením na branding a webdesign. 5 let praxe v oboru...</p>
                            </div>

                            <div className="result-card">
                                <h3>Petra Svobodová</h3>
                                <p>Copywriterka a korektorka. Specializuji se na technické texty a marketingové slogany...</p>
                            </div>

                            <div className="result-card">
                                <h3>Tomáš Kučera</h3>
                                <p>Full-stack vývojář (React, Node.js). Hledám zajímavé projekty na dlouhodobou spolupráci...</p>
                            </div>

                        </div>

                        <div className="search-footer">
                            <button type="button" className="btn btn-secondary load-more">Načíst další</button>
                            <button type="button" className="btn btn-primary explore">Prozkoumat</button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Search;