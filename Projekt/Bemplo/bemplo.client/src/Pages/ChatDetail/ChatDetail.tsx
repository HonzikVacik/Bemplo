import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './ChatDetail.css';

interface Message {
    id: number;
    text: string;
    time: string;
    isSent: boolean; // true = odeslaná mnou, false = přijatá
}

function ChatDetail() {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const [inputValue, setInputValue] = useState('');

    // Testovací seznam zpráv
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: 'Dobrý den, chtěl jsem se zeptat na stav té objednávky.', time: '10:30', isSent: false },
        { id: 2, text: 'Ahoj, už na tom pracujeme. Mělo by to být hotové zítra.', time: '10:32', isSent: true },
        { id: 3, text: 'Super, díky za info! Pošleš mi pak fakturu?', time: '10:35', isSent: false },
        { id: 4, text: 'Určitě, hned jak to dokončím, pošlu to na mail.', time: '10:36', isSent: true },
        { id: 5, text: 'Dobře. Ještě jedna věc - potřeboval bych tam změnit tu adresu doručení, pokud to ještě jde. Přestěhovali jsme se do vedlejší kanceláře.', time: '10:40', isSent: false },
        { id: 6, text: 'Jasně, není problém. Upravím to v systému.', time: '10:42', isSent: true },
    ]);

    // Efekt: Při načtení nebo změně zpráv odscrollovat dolů
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Funkce pro odeslání zprávy
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            text: inputValue,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSent: true,
        };

        setMessages([...messages, newMessage]);
        setInputValue('');
    };

    return (
        <>
            <div className="background-animation"></div>

            <div className="wrapper">
                <div className="glass-container chat-layout">

                    <header className="chat-header">
                        <Link to="chat" className="btn-icon back-btn" title="Zpět">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>

                        <div className="chat-title">
                            <h2>Jan Novák</h2>
                            <span className="status">Online</span>
                        </div>

                        <div className="header-actions">
                            <button type="button" className="btn-icon" title="Uzamknout chat">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </button>
                            <button type="button" className="btn-icon" title="Informace o chatu">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div>
                    </header>

                    <div className="chat-messages" id="chatMessages" ref={chatContainerRef}>

                        <div className="load-more-wrapper">
                            <a href="#" className="load-more-pill">Načíst další</a>
                        </div>

                        {/* Vykreslování zpráv ze stavu */}
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.isSent ? 'sent' : 'received'}`}>
                                <div className="bubble">
                                    {msg.text}
                                </div>
                                <span className="time">{msg.time}</span>
                            </div>
                        ))}

                    </div>

                    <form className="chat-input-area" onSubmit={handleSendMessage}>
                        <textarea
                            placeholder="Zadej zprávu..."
                            rows={1}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            // Odeslání enterem
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
        </>
    );
}

export default ChatDetail;