import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PrivacyPolicy.css';

interface PrivacyPolicyData {
    policyText: string;
    effectiveDate: string;
    expirationDate: string;
}

interface NotificationState {
    title: string;
    message: string;
    type?: 'success' | 'error';
}

function PrivacyPolicy() {
    const navigate = useNavigate();
    const [policy, setPolicy] = useState<PrivacyPolicyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const regex = /^\d+\./;

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const response = await fetch('/api/PrivacyPolicy');
                if (!response.ok) throw new Error('Nepodařilo se načíst data z prohlížeče.');

                const data = await response.json();
                setPolicy(data);
            } catch (error) {
                setNotification({
                    title: 'Chyba při načítání',
                    message: 'Nepodařilo se načíst aktuální znění zásad ochrany údajů.',
                    type: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPolicy();
    }, []);

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/PrivacyPolicy/GetPdf');

            if (!response.ok) throw new Error('Server vrátil chybu při generování PDF.');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "Privacy_Policy.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setNotification({
                title: 'Chyba stahování',
                message: 'Nepodařilo se vygenerovat nebo stáhnout PDF soubor. Zkuste to prosím později.',
                type: 'error'
            });
        }
    };

    if (loading && !notification) return <div className="loader">Načítání...</div>;

    return (
        <>
            {notification && (
                <div className="modal-overlay">
                    <div className={`modal-content ${notification.type}`}>
                        <h3>{notification.title}</h3>
                        <p>{notification.message}</p>
                        <button onClick={() => setNotification(null)}>Zavřít</button>
                    </div>
                </div>
            )}

            <div className="privacyPolicy-page">
                <div className="background-animation"></div>
                <div className="wrapper">
                    <div className="glass-container">
                        <header className="privacy-header">
                            <button className="btn-icon back-btn" title="Zpět" onClick={() => navigate(-1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>

                            <h2>Privacy Policy</h2>

                            <button className="btn-icon download-btn" title="Stáhnout .pdf" onClick={handleDownload}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                        </header>

                        <div className="privacy-content">
                            {policy ? (
                                <>
                                    {policy.policyText.split('\n').map((row, index) => (
                                        <p key={index}>
                                            {regex.test(row.trim()) ? (
                                                <strong style={{ color: '#3b82f6' }}>{row}</strong>
                                            ) : (
                                                row
                                            )}
                                        </p>
                                    ))}

                                    <div className="dates-info" style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
                                        <p><strong>Platné od: </strong>{new Date(policy.effectiveDate).toLocaleDateString()}</p>
                                        <p><strong>Platné do: </strong>{new Date(policy.expirationDate).toLocaleDateString()}</p>
                                    </div>
                                </>
                            ) : (
                                <p>Obsah nebyl načten.</p>
                            )}
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