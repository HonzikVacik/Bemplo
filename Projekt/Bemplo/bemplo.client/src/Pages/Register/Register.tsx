import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import './Register.css';
import '../Login/Login.css';

// Typ pro data formuláře
interface FormData {
    fname: string;
    lname: string;
    email: string;
    gender: string;
    dob: string;
    country: string;
    region: string;
    city: string;
    address: string;
    password: string;
    passwordConfirm: string;
    description: string;
    terms: boolean;
}

// Definice stavu pro oznámení
interface NotificationState {
    title: string;
    message: string;
}

const Register: React.FC = () => {
    // 2. Inicializace useNavigate
    const navigate = useNavigate();

    const [accountType, setAccountType] = useState('personal');
    const [formData, setFormData] = useState<FormData>({
        fname: '',
        lname: '',
        email: '',
        gender: '',
        dob: '',
        country: '',
        region: '',
        city: '',
        address: '',
        password: '',
        passwordConfirm: '',
        description: '',
        terms: false,
    });
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.email !== 'ai.beerandquiz@gmail.com') {
            setNotification({
                title: 'Oznámení',
                // Mírně jsem upravil text, aby odpovídal registraci
                message: 'Registrace byla úspěšná! Přesměrovávám na přihlášení...'
            });

            // 3. Přidání automatického přesměrování po 2 sekundách
            setTimeout(() => {
                // Váš odkaz pro přihlášení v Register.tsx směřuje na "/", 
                // takže předpokládám, že to je správná cesta pro login.
                navigate('/');
            }, 2000); // 2000 ms = 2 sekundy

        } else {
            setNotification({
                title: 'Chyba',
                // Mírně jsem upravil text, aby odpovídal registraci
                message: 'Tento e-mail již nelze použít nebo je chybný.'
            });
        }

        console.log('Typ účtu:', accountType);
        console.log('Data formuláře:', formData);
    };

    // 4. Úprava "OK" tlačítka v modálu (pro případ chyby)
    // Přesměrování proběhne automaticky jen při úspěchu,
    // ale u chybové hlášky uživatel stále musí kliknout na "OK".
    const modalContent = notification ? (
        <div className="modal-overlay" onClick={() => setNotification(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h2>{notification.title}</h2>
                <p>{notification.message}</p>

                {/* Zobrazíme tlačítko jen pokud to NENÍ úspěšná notifikace 
                    (protože ta přesměruje sama) */}
                {notification.title === 'Chyba' && (
                    <button
                        className="modal-close-btn"
                        onClick={() => setNotification(null)}
                    >
                        OK
                    </button>
                )}
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

            <div className="register-wrapper">
                <div className="register-container">
                    <form className="register-form" onSubmit={handleSubmit}>
                        <h2>Vytvořit účet</h2>

                        <div className="toggle-switch">
                            <input
                                type="radio"
                                id="type-personal"
                                name="account-type"
                                value="personal"
                                checked={accountType === 'personal'}
                                onChange={() => setAccountType('personal')}
                            />
                            <label htmlFor="type-personal">Osobní</label>
                            <input
                                type="radio"
                                id="type-company"
                                name="account-type"
                                value="company"
                                checked={accountType === 'company'}
                                onChange={() => setAccountType('company')}
                            />
                            <label htmlFor="type-company">Firemní</label>
                            <span className="slider"></span>
                        </div>

                        {/* ... zbytek formuláře (beze změny) ... */}

                        {/* --- Mřížka formuláře --- */}
                        <div className="form-grid">
                            {/* Jméno */}
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="fname"
                                    name="fname"
                                    placeholder=" "
                                    required
                                    value={formData.fname}
                                    onChange={handleChange}
                                />
                                <label htmlFor="fname">Jméno</label>
                                <span className="focus-border"></span>
                            </div>

                            {/* Příjmení */}
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="lname"
                                    name="lname"
                                    placeholder=" "
                                    required
                                    value={formData.lname}
                                    onChange={handleChange}
                                />
                                <label htmlFor="lname">Příjmení</label>
                                <span className="focus-border"></span>
                            </div>

                            {/* Email */}
                            <div className="input-group">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder=" "
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <label htmlFor="email">Email</label>
                                <span className="focus-border"></span>
                            </div>

                            {/* Pohlaví */}
                            <div className="input-group">
                                <select
                                    id="gender"
                                    name="gender"
                                    required
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled hidden></option>
                                    <option value="male">Muž</option>
                                    <option value="female"> Žena</option>
                                    <option value="other">Jiné</option>
                                </select>
                                <label htmlFor="gender" className="floated">Pohlaví</label>
                                <span className="focus-border"></span>
                            </div>

                            {/* Datum narození */}
                            <div className="input-group">
                                <input
                                    type="date"
                                    id="dob"
                                    name="dob"
                                    placeholder=" "
                                    required
                                    value={formData.dob}
                                    onChange={handleChange}
                                />
                                <label htmlFor="dob" className="floated">Datum narození</label>
                                <span className="focus-border"></span>
                            </div>

                            {/* Stát */}
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    placeholder=" "
                                    required
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                                <label htmlFor="country">Stát</label>
                                <span className="focus-border"></span>
                            </div>

                            {/* Kraj */}
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="region"
                                    name="region"
                                    placeholder=" "
                                    required
                                    value={formData.region}
                                    onChange={handleChange}
                                />
                                <label htmlFor="region">Kraj</label>
                                <span className="focus-border"></span>
                            </div>

                            {/* Město */}
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    placeholder=" "
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                                <label htmlFor="city">Město</label>
                                <span className="focus-border"></span>
                            </div>

                            {/* Adresa */}
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    placeholder=" "
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                                <label htmlFor="address">Adresa (ulice a č.p.)</label>
                                <span className="focus-border"></span>
                            </div>

                            {/* Heslo */}
                            <div className="input-group">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder=" "
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <label htmlFor="password">Heslo</label>
                                <span className="focus-border"></span>
                            </div>

                            {/* Heslo znovu */}
                            <div className="input-group">
                                <input
                                    type="password"
                                    id="password-confirm"
                                    name="passwordConfirm"
                                    placeholder=" "
                                    required
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                />
                                <label htmlFor="password-confirm">Heslo znovu</label>
                                <span className="focus-border"></span>
                            </div>

                            {/* Popis */}
                            <div className="input-group span-full">
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder=" "
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                                <label htmlFor="description" className="floated">Popis</label>

                                <span className="focus-border"></span>
                            </div>
                        </div>

                        {/* --- Souhlas --- */}
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                required
                                checked={formData.terms}
                                onChange={handleChange}
                            />
                            <label htmlFor="terms">
                                Souhlasím se zpracováním osobních údajů (P.P.)
                            </label>
                        </div>

                        <button type="submit">Registrovat</button>

                        <div className="links">
                            <Link to="/" className="link-login">Máte již účet? Přihlaste se</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;