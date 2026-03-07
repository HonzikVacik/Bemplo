import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <>
            <div className="privacyPolicy-page">

                <div className="background-animation"></div>

                <div className="wrapper">
                    <div className="glass-container">

                        <header className="privacy-header">
                            <Link to="" className="btn-icon back-btn" title="Zpět" onClick={() => navigate(-1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>

                            <h2>Privacy Policy</h2>

                            <Link to="#" className="btn-icon download-btn" title="Stáhnout .pdf" download>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </Link>
                        </header>

                        <div className="privacy-content">
                            <p>
                                <strong>1. Úvodní ustanovení</strong><br />
                                Vážení uživatelé, ochrana vašich osobních údajů je pro nás prioritou. Tento dokument ("Privacy Policy") vysvětluje, jak shromažďujeme, používáme a chráníme vaše data v souladu s platnými zákony (GDPR).
                            </p>

                            <p>
                                <strong>2. Jaká data sbíráme</strong><br />
                                Shromažďujeme pouze údaje nezbytné pro fungování aplikace, jako je jméno, emailová adresa a data, která sami vyplníte do svého profilu (zkušenosti, nabídky).
                            </p>

                            <p>
                                <strong>3. Využití dat</strong><br />
                                Vaše data využíváme výhradně k poskytování služeb, personalizaci obsahu a komunikaci s vámi. Nikdy neprodáváme vaše údaje třetím stranám bez vašeho výslovného souhlasu.
                            </p>

                            <p>
                                <strong>4. Zabezpečení</strong><br />
                                Aplikujeme moderní bezpečnostní standardy, šifrování a přístupová práva, abychom zabránili neoprávněnému přístupu k vašim informacím.
                            </p>

                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>

                        <div className="privacy-footer">
                            <div className="signature-box">
                                <span className="signature-text">Jméno Příjmení (Admin)</span>
                                <div className="signature-line"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default PrivacyPolicy;