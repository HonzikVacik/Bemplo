import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';

interface SearchModel {
    id: number;
    name: string;
    description: string;
}

// Definujeme možné režimy zobrazení
type SearchMode = 'search' | 'discover';

function Search() {
    const [showFilters, setShowFilters] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [nameQuery, setNameQuery] = useState('');
    const [addressQuery, setAddressQuery] = useState('');

    const [searchResults, setSearchResults] = useState<SearchModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [skip, setSkip] = useState(0);
    const TAKE_COUNT = 10;

    const [mode, setMode] = useState<SearchMode>('search');

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const fetchData = async (offset: number, isNewSearch: boolean, currentMode: SearchMode) => {
        setIsLoading(true);
        const token = localStorage.getItem('jwtToken');

        try {
            let url = '';

            if (currentMode === 'search') {
                url = `api/Account/SearchAccounts?searchString=${encodeURIComponent(searchQuery)}&name=${encodeURIComponent(nameQuery)}&address=${encodeURIComponent(addressQuery)}&skip=${offset}&take=${TAKE_COUNT}`;
            } else {
                url = `api/Account/DiscoverAccounts?skip=${offset}&take=${TAKE_COUNT}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data: SearchModel[] = await response.json();

                if (isNewSearch) {
                    setSearchResults(data);
                } else {
                    if (data.length === 0) {
                        alert("Žádná další data nejsou.");
                    } else {
                        setSearchResults(prev => [...prev, ...data]);
                    }
                }
            } else {
                console.error("Chyba při načítání:", response.statusText);
            }
        } catch (error) {
            console.error("Chyba sítě:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        setMode('search');
        setSkip(0);
        fetchData(0, true, 'search');
    };

    const handleExplore = () => {
        setMode('discover');
        setSkip(0);
        setSearchQuery('');
        setNameQuery('');
        setAddressQuery('');
        fetchData(0, true, 'discover');
    };

    const handleLoadMore = () => {
        const newSkip = skip + TAKE_COUNT;
        setSkip(newSkip);
        fetchData(newSkip, false, mode);
    };

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
                                <svg id="filterArrow" className={showFilters ? 'rotate' : ''} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div className={`filters-content ${showFilters ? 'active' : ''}`} id="filtersContent">
                                <div className="filter-group">
                                    <label>Lokace</label>
                                    <input type="text" placeholder="Např. Praha" value={addressQuery} onChange={(e) => setAddressQuery(e.target.value)} className="filter-input" />
                                </div>
                                <div className="filter-group">
                                    <label>Uživatel</label>
                                    <input type="text" placeholder="Jméno uživatele" value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} className="filter-input" />
                                </div>
                            </div>
                        </div>

                        <div className="search-results">
                            {isLoading && searchResults.length === 0 && <div style={{ textAlign: 'center', padding: '20px' }}>Načítám...</div>}

                            {!isLoading && searchResults.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    {mode === 'search' ? 'Nebyly nalezeny žádné výsledky.' : 'Žádné návrhy k prozkoumání.'}
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

                            {isLoading && searchResults.length > 0 && <div style={{ textAlign: 'center', padding: '10px' }}>Načítám další...</div>}
                        </div>

                        <div className="search-footer">
                            <button
                                type="button"
                                className="btn btn-secondary load-more"
                                onClick={handleLoadMore}
                                disabled={isLoading}
                            >
                                Načíst další
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary explore"
                                onClick={handleExplore}
                            >
                                Prozkoumat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Search;