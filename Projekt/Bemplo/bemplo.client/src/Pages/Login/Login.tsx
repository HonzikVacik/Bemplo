import React, { useState } from 'react';
import ReactDOM from 'react-dom'; // <-- 1. IMPORTUJTE ReactDOM
import './Login.css';

const Login: React.FC = () => {
    // Stav pro zobrazení oznámení (null = skryto)
    const [notification, setNotification] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Zabráníme reálnému odeslání formuláře
        setNotification('Přihlášení bylo úspěšné!');
    };

    // 2. Pro přehlednost si JSX modálu vytvoříme zvlášť
    const modalContent = notification ? (
        <div className="modal-overlay" onClick={() => setNotification(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h2>Oznámení</h2>
                <p>{notification}</p>
                <button
                    className="modal-close-btn"
                    onClick={() => setNotification(null)}
                >
                    OK
                </button>
            </div>
        </div>
    ) : null; // Pokud není notifikace, nevykreslíme nic

    return (
        <>
            <div className="background-animation"></div>

            {/* --- 3. POUŽIJEME PORTÁL --- */}
            {/* Vykreslíme 'modalContent' do elementu 'modal-root' v index.html */}
            {ReactDOM.createPortal(
                modalContent,
                document.getElementById('modal-root')!
            )}

            <div className="login-wrapper">
                <div className="login-container">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <h2>Přihlášení</h2>
                        <div className="input-group">
                            <input type="text" id="username" name="username" required />
                            <label htmlFor="username">Uživatelské jméno</label>
                            <span className="focus-border"></span>
                        </div>
                        <div className="input-group">
                            <input type="password" id="password" name="password" required />
                            <label htmlFor="password">Heslo</label>
                            <span className="focus-border"></span>
                        </div>
                        <button type="submit">Přihlásit se</button>
                        <div className="links">
                            <a href="#" className="link-forgot">Zapomenuté heslo?</a>
                            <a href="#" className="link-register">Vytvořit účet</a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;