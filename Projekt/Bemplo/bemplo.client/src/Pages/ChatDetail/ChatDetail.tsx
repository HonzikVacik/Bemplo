import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ChatDetail.css';

interface Message {
    id: number;
    text: string;
    time: string;
    isSent: boolean;
}

interface ServerMessage {
    id: number;
    owned: boolean;
    timestamp: string;
    content: string;
}

function ChatDetail() {
    const { id } = useParams();
    const contactId = id ? parseInt(id) : 0;

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const [loadingMore, setLoadingMore] = useState(false);

    const fetchMessagesFromServer = async (lastId: number) => {
        const token = localStorage.getItem('jwtToken');
        if (!token || !contactId) return null;

        try {
            const response = await fetch(`/api/Chat/GetMessages?ContactId=${contactId}&lastMessageId=${lastId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const serverData: ServerMessage[] = await response.json();

                // Převedeme data a seřadíme je VZESTUPNĚ (1, 2, 3...) pro zobrazení pod sebou
                return serverData.map((msg) => ({
                    id: msg.id,
                    text: msg.content,
                    time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isSent: msg.owned
                })).sort((a, b) => a.id - b.id);
            }
        } catch (error) {
            console.error("Chyba sítě:", error);
        }
        return null;
    };

    // Prvotní načtení zpráv (lastMessageId = 0)
    useEffect(() => {
        const initChat = async () => {
            setLoading(true);
            const data = await fetchMessagesFromServer(0);
            if (data) setMessages(data);
            setLoading(false);
        };
        initChat();
    }, [contactId]);

    // Automatický scroll dolů (pouze při úvodním načtení nebo odeslání zprávy)
    useEffect(() => {
        if (!loadingMore && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, loading, loadingMore]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const text = inputValue;
        setInputValue('');

        const tempId = Date.now();
        const newMessage: Message = {
            id: tempId,
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSent: true,
        };
        setMessages((prev) => [...prev, newMessage]);

        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            await fetch(`/api/Chat?ContactId=${contactId}&Message=${encodeURIComponent(text)}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Chyba odesílání:", error);
        }
    };

    const handleLoadMore = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (messages.length === 0 || loadingMore) return;

        setLoadingMore(true);
        const oldestId = messages[0].id;

        const olderMessages = await fetchMessagesFromServer(oldestId);

        if (olderMessages && olderMessages.length > 0) {
            const existingIds = new Set(messages.map(m => m.id));
            const uniqueOlderMessages = olderMessages.filter(m => !existingIds.has(m.id));

            if (uniqueOlderMessages.length > 0) {
                const container = chatContainerRef.current;
                const scrollHeightBefore = container ? container.scrollHeight : 0;

                setMessages((prev) => [...uniqueOlderMessages, ...prev]);

                setTimeout(() => {
                    if (container) {
                        const scrollHeightAfter = container.scrollHeight;
                        container.scrollTop = scrollHeightAfter - scrollHeightBefore;
                    }
                }, 0);
            }
        }
        setLoadingMore(false);
    };

    return (
        <div className="chatDetail-page">
            <div className="background-animation"></div>
            <div className="wrapper">
                <div className="glass-container chat-layout">

                    <header className="chat-header">
                        <Link to="/chat" className="btn-icon back-btn" title="Zpět">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>

                        <div className="chat-title">
                            <h2>Chat</h2>
                            <span className="status">Online</span>
                        </div>

                        <div className="header-actions">
                            <button type="button" className="btn-icon" title="Uzamknout chat">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </button>
                        </div>
                    </header>

                    <div className="chat-messages" ref={chatContainerRef}>
                        <div className="load-more-wrapper">
                            <button
                                onClick={handleLoadMore}
                                className="load-more-pill"
                                disabled={loadingMore}
                                style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                            >
                                {loadingMore ? 'Načítám...' : 'Načíst starší'}
                            </button>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', color: '#007BFF', padding: '20px' }}>Načítám zprávy...</div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`message ${msg.isSent ? 'sent' : 'received'}`}>
                                    <div className="bubble">
                                        {msg.text}
                                    </div>
                                    <span className="time">{msg.time}</span>
                                </div>
                            ))
                        )}
                    </div>

                    <form className="chat-input-area" onSubmit={handleSendMessage}>
                        <textarea
                            placeholder="Zadej zprávu..."
                            rows={1}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                        ></textarea>
                        <button type="submit" className="btn-send" title="Odeslat">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChatDetail;