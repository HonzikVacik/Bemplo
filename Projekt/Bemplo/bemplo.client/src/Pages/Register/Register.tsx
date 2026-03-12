import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import '../Login/Login.css';

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

interface NotificationState {
    title: string;
    message: string;
}

const Register: React.FC = () => {
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

    const hasLowercase = /(?=.*[a-z])/;
    const hasUppercase = /(?=.*[A-Z])/;
    const hasDigit = /(?=.*\d)/;
    const hasSpecialChar = /(?=.*[!@#$%^&*()_+\-={};':"\\|,.<>?/])/;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const selectedDate = new Date(formData.dob);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate >= today) {
            setNotification({
                title: 'Chyba',
                message: 'Datum narození musí být v minulosti (starší než dnes).'
            });
            return;
        }

        // Validace hesla
        const { password, passwordConfirm } = formData;

        if (password !== passwordConfirm) {
            setNotification({
                title: 'Chyba',
                message: 'Hesla se neshodují.'
            });
            return;
        }

        if (password.length < 8) {
            setNotification({
                title: 'Chyba',
                message: 'Heslo musí mít alespoň 8 znaků.'
            });
            return;
        }

        if (!hasLowercase.test(password)) {
            setNotification({ title: 'Chyba', message: 'Heslo musí obsahovat alespoň jedno malé písmeno.' });
            return;
        }
        if (!hasUppercase.test(password)) {
            setNotification({ title: 'Chyba', message: 'Heslo musí obsahovat alespoň jedno velké písmeno.' });
            return;
        }
        if (!hasDigit.test(password)) {
            setNotification({ title: 'Chyba', message: 'Heslo musí obsahovat alespoň jednu číslici.' });
            return;
        }
        if (!hasSpecialChar.test(password)) {
            setNotification({ title: 'Chyba', message: 'Heslo musí obsahovat alespoň jeden speciální znak.' });
            return;
        }

        const apiParams = {
            accountType: accountType === 'personal' ? '0' : '1',
            name: formData.fname,
            surname: formData.lname,
            sexType: formData.gender === 'male' ? '0' : formData.gender === 'female' ? '1' : '2',
            date: formData.dob,
            email: formData.email,
            password: formData.password,
            country: formData.country,
            region: formData.region,
            city: formData.city,
            address: formData.address,
            description: formData.description,
            agreeWithPrivacyPolicy: formData.terms.valueOf()
        };

        if (accountType === 'company') {
            apiParams.surname = '-';
        }

        try {
            const response = await fetch('/api/Account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountType: accountType === 'personal' ? '0' : '1',
                    name: formData.fname,
                    surname: formData.lname,
                    sexType: formData.gender === 'male' ? '0' : formData.gender === 'female' ? '1' : '2',
                    date: formData.dob,
                    email: formData.email,
                    password: formData.password,
                    country: formData.country,
                    region: formData.region,
                    city: formData.city,
                    address: formData.address,
                    description: formData.description,
                    agreeWithPrivacyPolicy: formData.terms.valueOf()
                })
            });
            const responseText = await response.text();

            if (response.ok) {
                setNotification({
                    title: 'Oznámení',
                    message: `${responseText}. Přesměrovávám na přihlášení...`
                });

                setTimeout(() => {
                    navigate('/login'); // Přesměrování na login
                }, 2000);

            } else {
                setNotification({
                    title: 'Chyba',
                    message: responseText
                });
            }

        } catch (error) {
            console.error('Chyba při registraci:', error);
            setNotification({
                title: 'Chyba sítě',
                message: 'Nelze se připojit k serveru. Zkuste to prosím později.'
            });
        }
    };

    const modalContent = notification ? (
        <div className="login-page">
            <div className="modal-overlay" onClick={() => setNotification(null)}>
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                    <h2>{notification.title}</h2>
                    <p>{notification.message}</p>

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
        </div>
    ) : null;

    return (
        <>
            <div className="register-page">

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
                                {/* Přepínač účtů */}
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

                            <div className="form-grid">
                                {/* Jméno */}
                                {accountType === 'personal' && (
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
                                )}

                                {/* Název firmy */}
                                {accountType === 'company' && (
                                    <div className="input-group input-group-double">
                                        <input
                                            type="text"
                                            id="fname"
                                            name="fname"
                                            placeholder=" "
                                            required
                                            value={formData.fname}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="fname">Název firmy</label>
                                        <span className="focus-border"></span>
                                    </div>
                                )}

                                {/* Příjmení */}
                                { accountType === 'personal' && (
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
                                )}

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
                                        <option value="female">Žena</option>
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
                                    { accountType === 'personal' && (
                                        <label htmlFor="dob" className="floated">Datum narození</label>
                                    )}
                                    {accountType === 'company' && (
                                        <label htmlFor="dob" className="floated">Datum založení</label>
                                    )}
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
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                    ></textarea>
                                    <label htmlFor="description" className="floated">Popis</label>

                                    <span className="focus-border"></span>
                                </div>
                            </div>

                            {/* Souhlas */}
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
                                    Souhlasím se
                                    <Link
                                        to="/privacypolicy"
                                        style={{ display: 'inline', marginLeft: '0.4rem', marginBottom: '1.5rem', color: 'var(--primary-red)', textDecoration: 'underline' }}
                                    >
                                        zásadami ochrany osobních údajů
                                    </Link>
                                </label>
                            </div>

                            <button type="submit">Registrovat</button>

                            <div className="links">
                                <Link to="/login" className="link-login">Máte již účet? Přihlaste se</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;