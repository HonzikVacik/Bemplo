import React from 'react';
import './Login.css';

const Login: React.FC = () => {
    return (
        <>
            <div className="background-animation"></div>
            <div className="login-wrapper">
                <div className="login-container">
                    <form className="login-form">
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