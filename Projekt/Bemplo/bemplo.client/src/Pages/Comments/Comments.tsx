import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Comments.css';

function Comments() {
    // Stav pro filtry (search a select)
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('newest');

    // Data pro zkušenosti (v reálu by přišla z API)
    const experiencesData = [
        { id: 1, date: '22.11.2025 14:30', text: 'Oprava grafického návrhu proběhla v pořádku, rychlá komunikace.' },
        { id: 2, date: '20.11.2025 09:15', text: 'Konzultace ohledně nového projektu. Velmi přínosné setkání.' },
        { id: 3, date: '15.11.2025 16:45', text: 'Dokončení první fáze vývoje aplikace.' },
        { id: 4, date: '10.11.2025 11:00', text: 'Předání podkladů k tisku.' },
        { id: 5, date: '05.11.2025 13:20', text: 'Úvodní briefing k zakázce.' },
    ];

    // Data pro komentáře
    const commentsData = [
        { id: 1, date: '22.11.2025 15:00', name: 'Petr Svoboda', rating: 5, text: 'Skvělá spolupráce! Vše dodáno včas a v perfektní kvalitě. Doporučuji.' },
        { id: 2, date: '21.11.2025 10:30', name: 'Jana Nováková', rating: 4, text: 'Komunikace byla trochu pomalejší, ale výsledek stojí za to.' },
        { id: 3, date: '18.11.2025 08:45', name: 'Firma XYZ s.r.o.', rating: 5, text: 'Profesionální přístup. Určitě využijeme služeb znovu.' },
        { id: 4, date: '12.11.2025 19:20', name: 'Lukáš Dvořák', rating: 3, text: 'Práce dobrá, ale cena byla vyšší než původní odhad.' },
    ];

    return (
        <>
            <div className="comments-page">

                <div className="background-animation"></div>

                <div className="wrapper">
                    <div className="glass-container">

                        <header className="page-header">
                            <Link to="/dashboard" className="btn-icon back-btn" title="Zpět">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>

                            <h2>Jméno Příjmení</h2>

                            <div className="filters-group">
                                <div className="filter-input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Jméno uživatele..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="filter-select-wrapper">
                                    <select
                                        value={sortType}
                                        onChange={(e) => setSortType(e.target.value)}
                                    >
                                        <option value="newest">Nejnovější</option>
                                        <option value="best">Nejlépe hodnocené</option>
                                        <option value="worst">Nejhůře hodnocené</option>
                                    </select>
                                </div>
                            </div>
                        </header>

                        <div className="content-grid">

                            {/* Levý sloupec: Historie */}
                            <div className="column">
                                <div className="column-header">
                                    <h3>Historie zkušenosti</h3>
                                </div>

                                <div className="scroll-list">
                                    {experiencesData.map((exp) => (
                                        <div className="list-item experience" key={exp.id}>
                                            <span className="meta-date">{exp.date}</span>
                                            <p className="item-text">{exp.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pravý sloupec: Komentáře */}
                            <div className="column">
                                <div className="column-header">
                                    <h3>Komentáře</h3>
                                    <Link to="/newcomment" className="btn-icon add-comment-btn" title="Přidat komentář">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </Link>
                                </div>

                                <div className="scroll-list">
                                    {commentsData.map((comment) => (
                                        <div className="list-item comment" key={comment.id}>
                                            <div className="comment-header">
                                                <div className="comment-info">
                                                    <span className="meta-date">{comment.date}</span>
                                                    <span className="user-name">{comment.name}</span>
                                                </div>
                                                <div className="comment-rating">
                                                    {comment.rating}*
                                                </div>
                                            </div>
                                            <p className="item-text">{comment.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Comments;