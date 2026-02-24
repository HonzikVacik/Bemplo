import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ChatManager.css';

interface ChatListDto {
    contactId: number;
    name: string;
    lastMessage?: string;
}

function ChatManager() {
    const [chats, setChats] = useState<ChatListDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Načtení dat
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = localStorage.getItem('jwtToken');

                if (!token) {
                    setError("Nejste přihlášen.");
                    setLoading(false);
                    return;
                }

                const response = await fetch('/api/Chat', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setChats(data);
                } else if (response.status === 401) {
                    setError("Neautorizovaný přístup. Přihlašte se prosím.");
                } else {
                    const errText = await response.text();
                    setError(`Chyba: ${errText || response.statusText}`);
                }
            } catch (err) {
                setError("Nepodařilo se připojit k serveru.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    const openChat = (contactId: number) => {
        navigate(`/chatdetail/${contactId}`); 
    };

    return (
        <>
            <div className="chatManager-page">
                <div className="background-animation"></div>
                <div className="wrapper">
                    <div className="glass-container">

                        <header className="chat-header">
                            <Link to="/dashboard" className="btn-icon back-btn" title="Zpět">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>

                            <h2>Chaty</h2>

                            <button type="button" className="btn-icon" title="Nový chat">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </button>
                        </header>

                        <div className="chat-list">
                            {/* Loading stav */}
                            {loading && <div className="chat-item"><span className="chat-preview">Načítám chaty...</span></div>}

                            {/* Error stav */}
                            {error && <div className="chat-item" style={{ color: 'red' }}><span className="chat-preview">{error}</span></div>}

                            {/* Prázdný seznam */}
                            {!loading && !error && chats.length === 0 && (
                                <div className="chat-item">
                                    <span className="chat-preview">Nemáte žádné aktivní konverzace.</span>
                                </div>
                            )}

                            {/* Výpis chatů ze serveru */}
                            {chats.map((chat) => (
                                <div key={chat.contactId} className="chat-item" onClick={() => openChat(chat.contactId)}>
                                    <div className="chat-info">
                                        <span className="chat-name">{chat.name}</span>
                                        <span className="chat-preview">
                                            {chat.lastMessage || "Zatím žádná zpráva"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default ChatManager;