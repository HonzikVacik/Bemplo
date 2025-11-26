import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    // Stav pro slidery (zkušenosti), aby se aktualizovala procenta
    const [skills, setSkills] = useState({
        posA: 80,
        posB: 65,
        posC: 40,
        posD: 95,
    });

    // Stav pro emaily (přidávání/odebírání)
    const [emails, setEmails] = useState(['jmeno.prijmeni@email.cz']);

    const handleSkillChange = (key: string, value: string) => {
        setSkills((prev) => ({ ...prev, [key]: parseInt(value) }));
    };

    const addEmailRow = () => {
        setEmails([...emails, '']);
    };

    const removeEmailRow = (index: number) => {
        const newEmails = emails.filter((_, i) => i !== index);
        setEmails(newEmails);
    };

    const handleEmailChange = (index: number, value: string) => {
        const newEmails = [...emails];
        newEmails[index] = value;
        setEmails(newEmails);
    };

    return (
        <>
            <div className="background-animation"></div>

            <div className="profile-wrapper">
                <div className="profile-container">
                    <div className="profile-header">
                        <h2>Jméno Příjmení</h2>

                        <button type="button" className="btn-icon" title="Osobní kód">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                                />
                            </svg>
                        </button>

                        <button type="button" className="btn-icon" title="Chat">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                        </button>

                        <button type="button" className="btn-icon" title="Vyhledávání">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>

                        <div className="separator"></div>

                        <button type="button" className="btn-icon logout" title="Odhlásit se">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                        </button>

                        <button type="button" className="btn btn-secondary">
                            Změnit profil
                        </button>
                    </div>

                    <form className="profile-form">
                        <div className="profile-section">
                            <h3>Popis</h3>
                            <div className="input-group span-full">
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder=" "
                                    rows={5}
                                    defaultValue="Sem přijde text popisující uživatele. Může být i delší a zabrat více řádků..."
                                ></textarea>
                                <span className="focus-border"></span>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3>Nabídka</h3>
                            <div className="input-group span-full">
                                <textarea
                                    id="offer"
                                    name="offer"
                                    placeholder=" "
                                    rows={4}
                                    defaultValue="Nabízím své služby v oblasti..."
                                ></textarea>
                                <span className="focus-border"></span>
                            </div>
                        </div>

                        <div className="profile-section">
                            <div className="section-header">
                                <h3>Zkušenosti</h3>
                                <button
                                    type="button"
                                    className="btn-icon add-contact"
                                    title="Přidat další zkušenost"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <table className="experience-table">
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>Pozice A (např. Grafik)</td>
                                        <td className="slider-cell">
                                            <div className="slider-wrapper">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={skills.posA}
                                                    className="custom-range"
                                                    onChange={(e) => handleSkillChange('posA', e.target.value)}
                                                />
                                                <span className="slider-value">{skills.posA}%</span>
                                            </div>
                                        </td>
                                        <td>3*</td>
                                    </tr>
                                    <tr>
                                        <td>Pozice B (např. Webdesign)</td>
                                        <td className="slider-cell">
                                            <div className="slider-wrapper">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={skills.posB}
                                                    className="custom-range"
                                                    onChange={(e) => handleSkillChange('posB', e.target.value)}
                                                />
                                                <span className="slider-value">{skills.posB}%</span>
                                            </div>
                                        </td>
                                        <td>4.1*</td>
                                    </tr>
                                    <tr>
                                        <td>Pozice C (např. Kodér)</td>
                                        <td className="slider-cell">
                                            <div className="slider-wrapper">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={skills.posC}
                                                    className="custom-range"
                                                    onChange={(e) => handleSkillChange('posC', e.target.value)}
                                                />
                                                <span className="slider-value">{skills.posC}%</span>
                                            </div>
                                        </td>
                                        <td>2.6*</td>
                                    </tr>
                                    <tr>
                                        <td>Pozice D (např. Analytik)</td>
                                        <td className="slider-cell">
                                            <div className="slider-wrapper">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={skills.posD}
                                                    className="custom-range"
                                                    onChange={(e) => handleSkillChange('posD', e.target.value)}
                                                />
                                                <span className="slider-value">{skills.posD}%</span>
                                            </div>
                                        </td>
                                        <td>4.9*</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="profile-section">
                            <h3>Preference</h3>
                            <div className="input-group span-full">
                                <textarea
                                    id="preferences"
                                    name="preferences"
                                    placeholder=" "
                                    rows={3}
                                    defaultValue="Preferuji práci na dálku..."
                                ></textarea>
                                <span className="focus-border"></span>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3>Požadavky</h3>
                            <div className="input-group span-full">
                                <textarea
                                    id="requirements"
                                    name="requirements"
                                    placeholder=" "
                                    rows={3}
                                    defaultValue="Požaduji flexibilní pracovní dobu..."
                                ></textarea>
                                <span className="focus-border"></span>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3>Adresa</h3>
                            <div className="form-grid">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        placeholder=" "
                                        required
                                        defaultValue="Česká republika"
                                    />
                                    <label htmlFor="country">Stát</label>
                                    <span className="focus-border"></span>
                                </div>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="region"
                                        name="region"
                                        placeholder=" "
                                        required
                                        defaultValue="Ústecký kraj"
                                    />
                                    <label htmlFor="region">Kraj</label>
                                    <span className="focus-border"></span>
                                </div>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        placeholder=" "
                                        required
                                        defaultValue="Ústí nad Labem"
                                    />
                                    <label htmlFor="city">Město (Okres)</label>
                                    <span className="focus-border"></span>
                                </div>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        placeholder=" "
                                        required
                                        defaultValue="Nějaká ulice 123/45"
                                    />
                                    <label htmlFor="address">Adresa</label>
                                    <span className="focus-border"></span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-section">
                            <div className="section-header">
                                <h3>Kontakt</h3>
                                <button
                                    type="button"
                                    className="btn-icon add-contact"
                                    title="Přidat další kontakt"
                                    onClick={addEmailRow}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="form-grid">
                                <div className="dynamic-list" id="emailList">
                                    {emails.map((email, index) => (
                                        <div className="contact-row" key={index}>
                                            <button
                                                type="button"
                                                className="btn-icon remove-btn"
                                                title="Odstranit"
                                                onClick={() => removeEmailRow(index)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M20 12H4"
                                                    />
                                                </svg>
                                            </button>

                                            <div className="input-group">
                                                <input
                                                    type="email"
                                                    name="email[]"
                                                    placeholder=" "
                                                    required
                                                    value={email}
                                                    onChange={(e) => handleEmailChange(index, e.target.value)}
                                                />
                                                <label>Email</label>
                                                <span className="focus-border"></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="input-group contact-action">
                                    <button type="button" className="btn btn-primary full-width">
                                        Kontaktovat
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3>Pracovní vztahy</h3>
                            <p>Status: V pracovní smlouvě</p>
                            <div className="toggle-switch">
                                <input
                                    type="radio"
                                    id="status-active"
                                    name="work-status"
                                    value="active"
                                    defaultChecked
                                />
                                <label htmlFor="status-active">Aktivní</label>
                                <input
                                    type="radio"
                                    id="status-inactive"
                                    name="work-status"
                                    value="inactive"
                                />
                                <label htmlFor="status-inactive">Neaktivní</label>
                                <span className="slider"></span>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3>Foto</h3>
                            <div className="photo-gallery">
                                <div className="main-photo">
                                    <img src="o1 (1).png" alt="Hlavní fotografie" />
                                </div>
                                <div className="thumbnail-grid">
                                    <div className="thumbnail" draggable="true">
                                        <img src="o1 (1).png" alt="Náhled 1" />
                                    </div>
                                    <div className="thumbnail" draggable="true">
                                        <img src="o1 (2).png" alt="Náhled 2" />
                                    </div>
                                    <div className="thumbnail" draggable="true">
                                        <img src="o1 (3).png" alt="Náhled 3" />
                                    </div>
                                    <div className="thumbnail" draggable="true">
                                        <img src="o1 (1).jpg" alt="Náhled 4" />
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary full-width">
                                    Nahrát +
                                </button>
                            </div>
                        </div>

                        <div className="links">
                            <a href="#">Uložit změny</a>
                            <a href="#">Odhlásit se</a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Dashboard;