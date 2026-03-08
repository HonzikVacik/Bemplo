import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

interface NotificationState {
    title: string;
    message: string;
    type?: 'success' | 'error' | 'notification';
}

const Login: React.FC = () => {
    const navigate = useNavigate();
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

                
                // Při pololetní obhajobě mi bylo sděleno, abych toto odstranil
                // Dle mého úsudku to ale smysl má, tak si to nechávám pro případ budoucího vývojee

                //setNotification({
                //    title: 'Přihlášení úspěšné',
                //    message: 'Byli jste úspěšně přihlášeni.',
                //    type: 'success'
                //});

                navigate('/dashboard');

            } else {
                // Chyba: responseText obsahuje chybovou hlášku ze serveru
                setNotification({
                    title: 'Chyba',
                    message: responseText,
                    type: 'error'
                });
            }

        } catch (error) {
            console.error('Chyba při přihlašování:', error);
            setNotification({
                title: 'Chyba sítě',
                message: 'Nelze se připojit k serveru. Zkuste to prosím později.',
                type: 'error'
            });
        }
    };

    const handleCloseModal = () => {
        if (notification?.type === 'success') {
            setNotification(null);
            navigate('/dashboard');
        } else {
            setNotification(null);
        }
    };

    const modalContent = notification ? (
        <div className="login-page">
            <div className="modal-overlay" onClick={() => setNotification(null)}>
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                    <h2>{notification.title}</h2>
                    <p>{notification.message}</p>
                    <button
                        className="modal-close-btn"
                        onClick={handleCloseModal}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    const resetPassword = () => {
        setNotification({
            title: 'Oznámení',
            message: 'Tato funkčnost bude dostupná po maturitních obhajobách.',
            type: 'notification'
        });
    }

    return (
        <>
            <div className="login-page">

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
                                <Link to="" className="link-forgot" onClick={resetPassword}>Zapomenuté heslo?</Link>
                                <Link to="/register" className="link-register">Vytvořit účet</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;