// Register.tsx
import React, { useState } from 'react';
import './Register.css'; // Importujeme n� nov�, �ist� CSS soubor

// Typ pro data formul��e (dobr� praxe v TypeScriptu)
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

const Register: React.FC = () => {
    // Stav pro typ ��tu (osobn�/firemn�)
    const [accountType, setAccountType] = useState('personal');

    // Jeden velk� stavov� objekt pro v�echna pole formul��e
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

    // Univerz�ln� handler pro zm�ny ve v�ech pol�ch
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target;

        // Speci�ln� o�et�en� pro checkbox
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
        // Zde byste odeslali data na server
        console.log('Typ účtu:', accountType);
        console.log('Data formuláře:', formData);
        // TODO: P�idat validaci (nap�. shoduj� se hesla?)
    };

    return (
        <>
            <div className="background-animation"></div>
            <div className="register-wrapper">
                <div className="register-container">
                    <form className="register-form" onSubmit={handleSubmit}>
                        <h2>Vytvořit účet</h2>

                        {/* --- P�ep�na� ��tu --- */}
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

                        {/* --- M��ka formul��e --- */}
                        <div className="form-grid">
                            {/* Jm�no */}
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

                            {/* P��jmen� */}
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

                            {/* Pohlav� */}
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

                            {/* Datum narozen� */}
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

                            {/* St�t */}
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

                            {/* M�sto */}
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
                            <a href="#">Máte již účet? Přihlaste se</a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;