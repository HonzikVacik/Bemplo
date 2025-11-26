import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import './Login.css';

interface NotificationState {
    title: string;
    message: string;
}

const Login: React.FC = () => {
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get('username') as string;
        const password = formData.get('password') as string;

        try {
            // 1. Sestavíme URL s query parametry, jak to očekává backend
            const params = new URLSearchParams({ email, password });
            const url = `/api/Auth/token?${params.toString()}`;

            // 2. Odešleme požadavek
            const response = await fetch(url, {
                method: 'POST',
            });

            // 3. Získáme odpověď jako ČISTÝ TEXT
            const responseText = await response.text();

            // 4. Zkontrolujeme status odpovědi
            if (response.ok) {
                // Úspěch: responseText obsahuje JWT token
                // Uložíme token např. do localStorage
                localStorage.setItem('jwtToken', responseText);

                setNotification({
                    title: 'Přihlášení úspěšné',
                    message: 'Byli jste úspěšně přihlášeni.'
                });

            } else {
                // Chyba: responseText obsahuje chybovou hlášku ze serveru
                setNotification({
                    title: 'Chyba',
                    message: responseText
                });
            }

        } catch (error) {
            console.error('Chyba při přihlašování:', error);
            setNotification({
                title: 'Chyba sítě',
                message: 'Nelze se připojit k serveru. Zkuste to prosím později.'
            });
        }
    };

    const modalContent = notification ? (
        <div className="modal-overlay" onClick={() => setNotification(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h2>{notification.title}</h2>
                <p>{notification.message}</p>
                <button
                    className="modal-close-btn"
                    onClick={() => setNotification(null)}
                >
                    OK
                </button>
            </div>
        </div>
    ) : null;

    return (
        <>
            <div className="background-animation"></div>

            {ReactDOM.createPortal(
                modalContent,
                document.getElementById('modal-root')!
            )}

            <div className="login-wrapper">
                <div className="login-container">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <h2>Přihlášení</h2>
                        <div className="input-group">
                            <input type="email" id="username" name="username" required />
                            <label htmlFor="username">Email</label>
                            <span className="focus-border"></span>
                        </div>
                        <div className="input-group">
                            <input type="password" id="password" name="password" required />
                            <label htmlFor="password">Heslo</label>
                            <span className="focus-border"></span>
                        </div>
                        <button type="submit">Přihlásit se</button>
                        <div className="links">
                            <Link to="/" className="link-forgot">Zapomenuté heslo?</Link>
                            <Link to="/register" className="link-register">Vytvořit účet</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;