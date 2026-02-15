import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';

interface SearchModel {
    id: number;
    name: string;
    description: string;
}

function Search() {
    // Stav pro zobrazení/skrytí filtrů
    const [showFilters, setShowFilters] = useState(false);
    // Stav pro hodnotu hodnocení (slider)
    const [rating, setRating] = useState(50);

    const [searchQuery, setSearchQuery] = useState('');
    const [nameQuery, setNameQuery] = useState('');
    const [addressQuery, setAddressQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleSearch = async () => {

        setIsLoading(true);
        const token = localStorage.getItem('jwtToken');

        try {
            const response = await fetch(`api/Account/SearchAccounts?searchString=${encodeURIComponent(searchQuery)}&name=${encodeURIComponent(nameQuery)}&address=${encodeURIComponent(addressQuery)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data: SearchModel[] = await response.json();
                setSearchResults(data);
            } else {
                console.error("Chyba při hledání:", response.statusText);
            }
        } catch (error) {
            console.error("Chyba sítě:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handler pro stisk klávesy Enter v inputu
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const navigate = useNavigate();

    return (
        <>
            <div className="search-page">

                <div className="background-animation"></div>

                <div className="wrapper">
                    <div className="glass-container">

                        <header className="search-header">
                            <button className="btn-icon back-btn" title="Zpět" onClick={() => navigate(-1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>

                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="Zadejte hledaný výraz..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            <button type="button" className="btn-icon search-btn" title="Hledat" onClick={handleSearch}>
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
                                    <input type="text" placeholder="Např. Praha" value={addressQuery} onChange={(e) => setAddressQuery(e.target.value)} className="filter-input" />
                                </div>

                                <div className="filter-group">
                                    <label>Uživatel</label>
                                    <input type="text" placeholder="Jméno uživatele" value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} className="filter-input" />
                                </div>

                                {/*
                                    Připraveno pro budoucí vývoj

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

                                */}

                            </div>
                        </div>

                        <div className="search-results">

                            {isLoading && <div style={{ textAlign: 'center', padding: '20px' }}>Načítám...</div>}

                            {!isLoading && searchResults.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    Zatím žádné výsledky.
                                </div>
                            )}

                            {searchResults.map((item) => (
                                <div className="result-card"
                                    key={item.id}
                                    onClick={() => navigate(`/dashboard/${item.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h3>{item.name}</h3>
                                    <p>{item.description || "Bez popisu"}</p>
                                </div>
                            ))}

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