import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Comments.css';

// 1. Definice typů podle C# modelů (předpokládáme camelCase serializaci z API)
interface ExperienceToComment {
    content: string;
    percentage: number;
    timestamp: string; // Z API přijde jako string (ISO date)
}

interface Comment {
    id: number;
    timestamp: string;
    percentage: number;
    content: string;
    evaluatorName: string;
}

interface CommentsResponse {
    userName: string;
    experiences: ExperienceToComment[];
    comments: Comment[];
}

function Comments() {
    const navigate = useNavigate();
    const params = useParams(); // Očekáváme v URL např. /comments/:userId/:experienceId

    const userId = params.userId;
    const experienceId = params.id;

    // Stav pro načtená data
    const [data, setData] = useState<CommentsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isLoggedIn, setIsLoggedIn] = useState(true);

    // Stav pro filtry
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('newest');

    // 2. Načtení dat ze serveru
    useEffect(() => {
        const fetchIsLoggedIn = async () => {
            try {
                const token = localStorage.getItem('jwtToken');

                const response = await fetch(`/api/Account/IsLoggedIn`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}` // Autorizace
                    }
                });

                if (response.status === 401) {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Chyba sítě:", error);
            }
        };

        const fetchData = async () => {
            if (!userId || !experienceId) return;

            const token = localStorage.getItem('jwtToken');

            try {
                const response = await fetch(`/api/Comment?UserId=${userId}&ExperienceId=${experienceId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Autorizace
                    }
                });

                if (response.ok) {
                    const result: CommentsResponse = await response.json();
                    setData(result);
                } else {
                    console.error("Chyba při načítání komentářů:", response.statusText);
                }
            } catch (error) {
                console.error("Chyba sítě:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIsLoggedIn();
        fetchData();
    }, [userId, experienceId]);

    // Pomocná funkce pro formátování data
    const formatDate = (isoDate: string) => {
        const d = new Date(isoDate);
        return d.toLocaleDateString('cs-CZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 3. Filtrace a řazení komentářů (Client-side)
    const getProcessedComments = () => {
        if (!data?.comments) return [];

        let filtered = data.comments.filter(c =>
            c.evaluatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.content.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortType === 'newest') {
            filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        } else if (sortType === 'best') {
            filtered.sort((a, b) => b.percentage - a.percentage);
        } else if (sortType === 'worst') {
            filtered.sort((a, b) => a.percentage - b.percentage);
        }

        return filtered;
    };

    if (isLoading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Načítám data...</div>;
    if (!data) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Data nebyla nalezena.</div>;

    const processedComments = getProcessedComments();

    return (
        <>
            <div className="comments-page">

                <div className="background-animation"></div>

                <div className="wrapper">
                    <div className="glass-container">

                        <header className="page-header">
                            <button className="btn-icon back-btn" title="Zpět" onClick={() => navigate(-1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>

                            {/* Zobrazení jména uživatele z API */}
                            <h2>{data.userName}</h2>

                            <div className="filters-group">
                                <div className="filter-input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Hledat..."
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

                            {/* Levý sloupec: Historie (Experiences) */}
                            <div className="column">
                                <div className="column-header">
                                    <h3>Historie zkušenosti</h3>
                                </div>

                                <div className="scroll-list">
                                    {data.experiences.length === 0 && <p style={{ padding: '10px', color: '#ccc' }}>Žádná historie.</p>}

                                    {data.experiences.map((exp, index) => (
                                        <div className="list-item experience" key={index}>
                                            <span className="meta-date">{formatDate(exp.timestamp)}</span>
                                            <p className="item-text">{exp.content}</p>
                                            {/* Volitelně: zobrazit procenta historie */}
                                            <span style={{fontSize: '0.8em', color: '#aaa'}}> {exp.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pravý sloupec: Komentáře */}
                            <div className="column">
                                <div className="column-header">
                                    <h3>Komentáře</h3>
                                    {isLoggedIn && (
                                        < button
                                            className="btn-icon add-comment-btn"
                                            title="Přidat komentář"
                                            onClick={() => navigate(`/newcomment/${userId}/${experienceId}`)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                <div className="scroll-list">
                                    {processedComments.length === 0 && <p style={{ padding: '10px', color: '#ccc' }}>Žádné komentáře.</p>}

                                    {processedComments.map((comment) => (
                                        <div className="list-item comment" key={comment.id}>
                                            <div className="comment-header">
                                                <div className="comment-info">
                                                    <span className="meta-date">{formatDate(comment.timestamp)}</span>
                                                    <span className="user-name">{comment.evaluatorName}</span>
                                                </div>
                                                <div className="comment-rating">
                                                    {/* Převod procent na hvězdičky */}
                                                    {comment.percentage}*
                                                </div>
                                            </div>
                                            <p className="item-text">{comment.content}</p>
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