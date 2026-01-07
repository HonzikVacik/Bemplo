import { Link } from 'react-router-dom';
import './ChatManager.css';

function ChatManager() {
    const openChat = (chatId: string) => {
        console.log("Otevírám chat: " + chatId);
        // Zde by později byla logika pro přesměrování, např. router.push(`/chat/${chatId}`)
    };

    return (
        <>
            <div className="chatManager-page">

                <div className="background-animation"></div>

                <div className="wrapper">
                    <div className="glass-container">

                        <header className="chat-header">
                            <Link to="dashboard.html" className="btn-icon back-btn" title="Zpět">
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

                            {/* Chat Item: Systém */}
                            <div className="chat-item" onClick={() => openChat('system')}>
                                <div className="chat-info">
                                    <span className="chat-name">Systém</span>
                                    <span className="chat-preview">Vítejte v nové aplikaci! Klikněte pro...</span>
                                </div>
                            </div>

                            {/* Chat Item: Jan Novák */}
                            <div className="chat-item" onClick={() => openChat('jan-novak')}>
                                <div className="chat-info">
                                    <span className="chat-name">Jan Novák</span>
                                    <span className="chat-preview">Díky za info, zítra se ozvu.</span>
                                </div>
                            </div>

                            {/* Chat Item: Firma XYZ */}
                            <div className="chat-item" onClick={() => openChat('firma-xyz')}>
                                <div className="chat-info">
                                    <span className="chat-name">Firma XYZ</span>
                                    <span className="chat-preview">Faktura byla uhrazena.</span>
                                </div>
                            </div>

                            {/* Chat Item: Petra Malá */}
                            <div className="chat-item" onClick={() => openChat('petra')}>
                                <div className="chat-info">
                                    <span className="chat-name">Petra Malá</span>
                                    <span className="chat-preview">Ahoj, posílám ty podklady k projektu, které jsi chtěl vidět už včera...</span>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default ChatManager;