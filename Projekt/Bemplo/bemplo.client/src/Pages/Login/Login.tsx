import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './Login.css';

interface NotificationState {
    title: string;
    message: string;
}

const Login: React.FC = () => {
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { // Specifikujeme typ na HTMLFormElement
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const username = formData.get('username') as string;

        if (username === 'janvacek21') {
            setNotification({
                title: 'Oznámení',
                message: 'Přihlášení bylo úspěšné!'
            });
        } else {
            setNotification({
                title: 'Chyba',
                message: 'Uživatelké jméno nebo heslo není správné!'
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
                    {/* Předáme 'handleSubmit' do formuláře */}
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