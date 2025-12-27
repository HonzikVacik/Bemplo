import React, { useState, useEffect } from 'react';
import './Dashboard.css';

// --- DEFINICE ROZHRANÍ ---
interface Experience {
    title: string;
    percentage: number;
    rating: number;
}

interface Contact {
    email: string;
}

// 1. Základní interface (to, co mají všichni - Firmy i Uživatelé)
interface DashboardBase {
    id: number;
    name: string;
    description: string;
    offer: string;
    email: string; // Hlavní email
    country: string;
    region: string;
    city: string;
    address: string;
    contacts: Contact[]; // Seznam dalších kontaktů
    agreeWithPolicy: boolean;
}

// 2. Rozšířený interface pro Uživatele (dědí ze základu)
interface DashboardUser extends DashboardBase {
    preference: string;
    request: string;
    experiences: Experience[];
}

// 3. Type Guard funkce (Klíčový bod!)
// Tato funkce ověří, zda data obsahují pole "experiences", čímž pozná DashboardUser
function isDashboardUser(data: DashboardBase): data is DashboardUser {
    return (data as DashboardUser).experiences !== undefined;
}

const Dashboard: React.FC = () => {
    const [staticSkills, setStaticSkills] = useState({
        posA: 80,
        posB: 65,
        posC: 40,
        posD: 95,
    });

    const [dashboardData, setDashboardData] = useState<DashboardBase | DashboardUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Pomocné stavy pro formuláře
    const [emails, setEmails] = useState<string[]>([]);

    // Stavy specifické pouze pro Usera (musíme ošetřit jejich existenci)
    const [skills, setSkills] = useState<Experience[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) return;

            try {
                // Voláme jen jeden endpoint, server rozhodne, co vrátí
                const response = await fetch('/api/Profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setDashboardData(data);

                    // Nastavíme společná data
                    if (data.contacts) {
                        setEmails(data.contacts.map((c: any) => c.email));
                    }

                    // Pokud je to User, nastavíme specifická data
                    if (isDashboardUser(data)) {
                        setSkills(data.experiences || []);
                    }
                }
            } catch (error) {
                console.error("Chyba:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Handlery pro formulář
    const handleSkillChange = (index: number, value: string) => {
        const newSkills = [...skills];
        newSkills[index].percentage = parseInt(value);
        setSkills(newSkills);
    };

    const addEmailRow = () => setEmails([...emails, '']);
    const removeEmailRow = (idx: number) => setEmails(emails.filter((_, i) => i !== idx));
    const handleEmailChange = (idx: number, val: string) => {
        const newEmails = [...emails];
        newEmails[idx] = val;
        setEmails(newEmails);
    };

    if (isLoading) return <div>Načítám...</div>;
    if (!dashboardData) return <div>Chyba načítání dat.</div>;

    const isCommonAccount = isDashboardUser(dashboardData);

    return (
        <>
            <div className="dashboard-page">

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
                                        value={dashboardData?.description}
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
                                        value={dashboardData?.offer}
                                    ></textarea>
                                    <span className="focus-border"></span>
                                </div>
                            </div>

                            {isCommonAccount && (
                                <div className="profile-section">
                                    <h3>Zkušenosti</h3>
                                    {/* Díky isUser ví TypeScript, že dashboardData je DashboardUser */}
                                    <table className="experience-table">
                                        <tbody>
                                            {skills.map((staticSkills, index) => (
                                                <tr key={index}>
                                                    <td>{staticSkills.title}</td>
                                                    <td className="slider-cell">
                                                        <input
                                                            type="range"
                                                            value={staticSkills.percentage}
                                                            onChange={(e) => handleSkillChange(index, e.target.value)}
                                                        />
                                                    </td>
                                                    <td>{staticSkills.rating}*</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {isCommonAccount && (
                                <div className="profile-section">
                                    <h3>Preference</h3>
                                    <div className="input-group span-full">
                                        <textarea
                                            id="preferences"
                                            name="preferences"
                                            placeholder=" "
                                            rows={3}
                                            defaultValue="Preferuji práci na dálku..."
                                            value={dashboardData?.preference}
                                        ></textarea>
                                        <span className="focus-border"></span>
                                    </div>
                                </div>
                            )}

                            {isCommonAccount && (
                                <div className="profile-section">
                                    <h3>Požadavky</h3>
                                    <div className="input-group span-full">
                                        <textarea
                                            id="requirements"
                                            name="requirements"
                                            placeholder=" "
                                            rows={3}
                                            defaultValue="Požaduji flexibilní pracovní dobu..."
                                            value={dashboardData?.preference}
                                        ></textarea>
                                        <span className="focus-border"></span>
                                    </div>
                                </div>
                            )}

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
                                            value={dashboardData?.country}
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
                                            value={dashboardData?.region}
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
                                            value={dashboardData?.city}
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
                                            value={dashboardData?.address}
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

                            {isCommonAccount && (
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
                            )}

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
            </div>
        </>
    );
}

export default Dashboard;