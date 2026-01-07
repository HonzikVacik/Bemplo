import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface Experience {
    id: number;
    content: string;
    percentage: number;
    rating: number | null;
}

interface Contact {
    id: number;
    content: string;
}

interface DashboardBase {
    id: number;
    name: string;
    description: string;
    offer: string;
    email: string;
    country: string;
    region: string;
    city: string;
    address: string;
    contacts: Contact[];
    photos: string[];
    agreeWithPolicy: boolean;
}

interface DashboardUser extends DashboardBase {
    preference: string;
    request: string;
    experiences: Experience[];
}

function isDashboardUser(data: DashboardBase): data is DashboardUser {
    return (data as DashboardUser).experiences !== undefined;
}

interface EditableTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    initialValue: string | undefined;
    onSave: (newValue: string) => void;
}

const EditableTextarea: React.FC<EditableTextareaProps> = ({ initialValue, onSave, ...props }) => {
    const [value, setValue] = useState(initialValue || '');

    useEffect(() => {
        setValue(initialValue || '');
    }, [initialValue]);

    const hasChanged = value !== (initialValue || '');

    const handleCancel = () => {
        setValue(initialValue || '');
    };

    const handleConfirm = () => {
        onSave(value);
    };

    return (
        <div className="input-group span-full">
            <textarea
                {...props}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            ></textarea>
            <span className="focus-border"></span>

            {hasChanged && (
                <div className="action-buttons">
                    <button type="button" className="btn-action btn-cancel" onClick={handleCancel}>
                        Zrušit
                    </button>
                    <button type="button" className="btn-action btn-confirm" onClick={handleConfirm}>
                        Potvrdit
                    </button>
                </div>
            )}
        </div>
    );
};

interface AddressData {
    country: string;
    region: string;
    city: string;
    address: string;
}

interface AddressSectionProps {
    data: AddressData;
    onSave: (newData: AddressData) => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({ data, onSave }) => {
    const [values, setValues] = useState<AddressData>({
        country: data.country || '',
        region: data.region || '',
        city: data.city || '',
        address: data.address || ''
    });

    useEffect(() => {
        setValues({
            country: data.country || '',
            region: data.region || '',
            city: data.city || '',
            address: data.address || ''
        });
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const hasChanged =
        values.country !== (data.country || '') ||
        values.region !== (data.region || '') ||
        values.city !== (data.city || '') ||
        values.address !== (data.address || '');

    const handleCancel = () => {
        setValues({
            country: data.country || '',
            region: data.region || '',
            city: data.city || '',
            address: data.address || ''
        });
    };

    const handleConfirm = () => {
        onSave(values);
    };

    return (
        <div className="profile-section">
            <h3>Adresa</h3>
            <div className="form-grid">
                {/* 1. STÁT */}
                <div className="input-group">
                    <input
                        type="text"
                        id="country"
                        name="country"
                        placeholder=" "
                        required
                        value={values.country}
                        onChange={handleChange}
                    />
                    <label htmlFor="country">Stát</label>
                    <span className="focus-border"></span>
                </div>

                {/* 2. KRAJ */}
                <div className="input-group">
                    <input
                        type="text"
                        id="region"
                        name="region"
                        placeholder=" "
                        required
                        value={values.region}
                        onChange={handleChange}
                    />
                    <label htmlFor="region">Kraj</label>
                    <span className="focus-border"></span>
                </div>

                {/* 3. MĚSTO */}
                <div className="input-group">
                    <input
                        type="text"
                        id="city"
                        name="city"
                        placeholder=" "
                        required
                        value={values.city}
                        onChange={handleChange}
                    />
                    <label htmlFor="city">Město (Okres)</label>
                    <span className="focus-border"></span>
                </div>

                {/* 4. ADRESA */}
                <div className="input-group">
                    <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder=" "
                        required
                        value={values.address}
                        onChange={handleChange}
                    />
                    <label htmlFor="address">Adresa</label>
                    <span className="focus-border"></span>
                </div>
            </div>

            {hasChanged && (
                <div className="action-buttons" style={{ marginTop: '20px' }}>
                    <button type="button" className="btn-action btn-cancel" onClick={handleCancel}>
                        Zrušit
                    </button>
                    <button type="button" className="btn-action btn-confirm" onClick={handleConfirm}>
                        Potvrdit
                    </button>
                </div>
            )}
        </div>
    );
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);

    const [skills, setSkills] = useState<Experience[]>([]);
    const [savedSkills, setSavedSkills] = useState<Experience[]>([]);

    const [dashboardData, setDashboardData] = useState<DashboardBase | DashboardUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [savedContacts, setSavedContacts] = useState<Contact[]>([]);

    const [savedImages, setSavedImages] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});

    const fileInputRef = useRef<HTMLInputElement>(null);

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) return;

            try {
                const response = await fetch('/api/Profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setDashboardData(data);

                    const realUrls: string[] = data.photos;

                    // Aktualizuje stavy pro obrázky
                    setSavedImages(realUrls);
                    setImages(realUrls);
                    setPendingFiles({});

                    if (selectedImage && realUrls.length > 0) {
                        setSelectedImage(realUrls[0]);
                    }
                    else {
                        setSelectedImage(null);
                    }

                    if (data.contacts) {
                        const loadedContacts = data.contacts.map((c: any) => ({
                            id: c.id,
                            content: c.content || c.Content
                        }));

                        setContacts(loadedContacts);
                        setSavedContacts(loadedContacts);
                    }

                    if (isDashboardUser(data)) {
                        const loadedSkills = data.experiences || [];
                        setSkills(loadedSkills);
                        setSavedSkills(loadedSkills);
                        console.log(data.experiences);
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

    const handleSaveDescription = async (newDescription: string) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const response = await fetch('/api/Profile/Description', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ description: newDescription })
            });

            if (response.ok) {
                updateField('description', newDescription);
            } else {
                const errorText = await response.text();
                console.error('Chyba při ukládání:', errorText);
            }
        } catch (error) {
            console.error('Chyba sítě:', error);
        }
    };

    const handleSaveOffer = async (newOffer: string) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const response = await fetch('/api/Profile/Offer', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ offer: newOffer })
            });

            if (response.ok) {
                updateField('offer', newOffer);
            } else {
                const errorText = await response.text();
                console.error('Chyba při ukládání:', errorText);
            }
        } catch (error) {
            console.error('Chyba sítě:', error);
        }
    };

    const handleSavePreference = async (newPreference: string) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const response = await fetch('/api/Profile/Preference', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ preference: newPreference })
            });

            if (response.ok) {
                updateField('preference', newPreference);
            } else {
                const errorText = await response.text();
                console.error('Chyba při ukládání:', errorText);
            }
        } catch (error) {
            console.error('Chyba sítě:', error);
        }
    };

    const handleSaveRequest = async (newRequest: string) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const response = await fetch('/api/Profile/Request', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ request: newRequest })
            });

            if (response.ok) {
                updateField('request', newRequest);
            } else {
                const errorText = await response.text();
                console.error('Chyba při ukládání:', errorText);
            }
        } catch (error) {
            console.error('Chyba sítě:', error);
        }
    };

    const addSkillRow = () => {
        setSkills([...skills, { id: 0, content: '', percentage: 50, rating: null }]);
    };

    const handleSkillContentChange = (index: number, newContent: string) => {
        const updatedSkills = skills.map((skill, i) =>
            i === index ? { ...skill, content: newContent } : skill
        );
        setSkills(updatedSkills);
    };

    const handleSkillPercentageChange = (index: number, newValue: string) => {
        const updatedSkills = skills.map((skill, i) =>
            i === index ? { ...skill, percentage: parseInt(newValue) || 0 } : skill
        );
        setSkills(updatedSkills);
    };

    const hasSkillsChanged = JSON.stringify(skills) !== JSON.stringify(savedSkills);

    const handleCancelSkills = () => {
        setSkills([...savedSkills]);
    };

    const handleConfirmSkills = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const response = await fetch('/api/Profile/Experience', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(skills)
            });

            if (response.ok) {
                const updatedData = await response.json();

                setSkills(updatedData);
                setSavedSkills(updatedData);

                console.log("Zkušenosti uloženy");
            } else {
                const errorText = await response.text();
                console.error('Chyba při ukládání zkušeností:', errorText);
            }
        } catch (error) {
            console.error('Chyba sítě:', error);
        }
    };

    const addContactRow = () => setContacts([...contacts, { id: 0, content: '' }]);
    const removeContactRow = (idx: number) => setContacts(contacts.filter((_, i) => i !== idx));
    const handleContactChange = (idx: number, val: string) => {
        const newContacts = [...contacts];
        newContacts[idx] = { ...newContacts[idx], content: val };
        setContacts(newContacts);
    };

    const hasContactsChanged = JSON.stringify(contacts) !== JSON.stringify(savedContacts);

    const handleCancelContacts = () => {
        setContacts([...savedContacts]);
    };

    const handleConfirmContacts = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const payload = contacts.map(c => ({
                id: c.id,
                content: c.content
            }));

            const response = await fetch('/api/Profile/Contacts', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const updatedData = await response.json();

                const newContactState = updatedData.map((d: any) => ({ id: d.id, content: d.content }));

                setContacts(newContactState);
                setSavedContacts(newContactState);

                console.log("Kontakty úspěšně aktualizovány");
            } else {
                const errorText = await response.text();
                console.error('Chyba:', errorText);
            }
        } catch (error) {
            console.error('Chyba sítě:', error);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const newImageUrl = URL.createObjectURL(file);

            setImages((prevImages) => [...prevImages, newImageUrl]);
            setSelectedImage(newImageUrl);

            setPendingFiles((prev) => ({
                ...prev,
                [newImageUrl]: file
            }));
        }

        if (event.target) {
            event.target.value = '';
        }
    };

    const handleSelectImage = (imgUrl: string) => {
        setSelectedImage(imgUrl);
    };

    const hasPhotosChanged = JSON.stringify(images) !== JSON.stringify(savedImages);

    const handleCancelPhotos = () => {
        setImages([...savedImages]);

        setPendingFiles({});

        if (savedImages.length > 0) {
            setSelectedImage(savedImages[0]);
        } else {
            setSelectedImage(null);
        }
    };

    const handleConfirmPhotos = async () => {
        setSavedImages([...images]);

        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        const formData = new FormData();

        images.forEach((imgUrl) => {
            formData.append('photoUrls', imgUrl);

            if (pendingFiles[imgUrl]) {
                formData.append('newFiles', pendingFiles[imgUrl]);
            }
        });

        try {
            const response = await fetch('/api/Profile/PhotoGallery', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                // Server vrátí seznam nových reálných URL (už ne blob:)
                const realUrls: string[] = await response.json();

                // Aktualizuje stavy
                setSavedImages(realUrls);
                setImages(realUrls);
                setPendingFiles({});

                if (selectedImage && realUrls.length > 0) {
                    setSelectedImage(realUrls[0]);
                }
                
                console.log("Fotky úspěšně uloženy.");
            } else {
                console.error("Chyba při ukládání fotek");
            }
        } catch (error) {
            console.error("Chyba sítě:", error);
        }
    };

    if (isLoading) return <div>Načítám...</div>;
    if (!dashboardData) return <div>Chyba načítání dat.</div>;

    const isCommonAccount = isDashboardUser(dashboardData);

    const updateField = (field: keyof DashboardUser, value: string) => {
        setDashboardData((prev) => {
            if (!prev) return null;
            return { ...prev, [field]: value };
        });
    };

    const handleSaveAddress = async (newData: AddressData) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const response = await fetch('/api/Profile/Address', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newData)
            });

            if (response.ok) {
                setDashboardData((prev) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        country: newData.country,
                        region: newData.region,
                        city: newData.city,
                        address: newData.address
                    };
                });
            } else {
                const errorText = await response.text();
                console.error('Chyba při ukládání adresy:', errorText);
            }
        } catch (error) {
            console.error('Chyba sítě:', error);
        }
    };

    const handleSort = () => {
        const _images = [...images];

        if (dragItem.current === null || dragOverItem.current === null) return;

        const draggedItemContent = _images.splice(dragItem.current, 1)[0];

        _images.splice(dragOverItem.current, 0, draggedItemContent);

        dragItem.current = null;
        dragOverItem.current = null;

        setImages(_images);
    };

    const handleDeleteImage = (indexToDelete: number, e: React.MouseEvent) => {
        e.stopPropagation();

        const imageToDelete = images[indexToDelete];

        const newImages = images.filter((_, index) => index !== indexToDelete);
        setImages(newImages);

        if (selectedImage === imageToDelete) {
            setSelectedImage(newImages.length > 0 ? newImages[0] : null);
        }

        // Poznámka: Pokud jde o "URL.createObjectURL", měli bychom správně zavolat 
        // URL.revokeObjectURL(imageToDelete), aby se uvolnila paměť, ale pro základní funkčnost to není kritické.
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/');
    }

    return (
        <>
            <div className="dashboard-page">

                <div className="background-animation"></div>

                <div className="profile-wrapper">
                    <div className="profile-container">
                        <div className="profile-header">
                            <h2>{dashboardData.name}</h2>

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

                            <button type="button" className="btn-icon logout" title="Odhlásit se" onClick={handleLogout}>
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

                            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(!isEditing)}>
                                Změnit profil
                            </button>
                        </div>

                        <form className="profile-form">

                            <fieldset disabled={!isEditing} style={{ border: 'none', padding: 0, margin: 0 }}>

                            <div className="profile-section">
                                <h3>Popis</h3>
                                <EditableTextarea
                                    id="description"
                                    name="description"
                                    placeholder=" "
                                    rows={5}
                                    initialValue={dashboardData.description}
                                    onSave={handleSaveDescription}
                                />
                            </div>

                            <div className="profile-section">
                                <h3>Nabídka</h3>
                                <div className="input-group span-full">
                                    <EditableTextarea
                                        id="offer"
                                        name="offer"
                                        placeholder=" "
                                        rows={4}
                                        initialValue={dashboardData?.offer}
                                        onSave={handleSaveOffer}
                                    />
                                    <span className="focus-border"></span>
                                </div>
                            </div>

                            {isCommonAccount && (
                                <div className="profile-section">
                                    <div className="section-header">
                                        <h3>Zkušenosti</h3>
                                        <button
                                            type="button"
                                            className="btn-icon add-contact"
                                            title="Přidat další zkušenost"
                                            onClick={addSkillRow}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                    <table className="experience-table">
                                        <tbody>
                                            {skills.map((skill, index) => (
                                                <tr key={index}>
                                                    <td style={{ width: '40%' }}>
                                                        <div className="input-group">
                                                            <input
                                                                type="text"
                                                                value={skill.content}
                                                                onChange={(e) => handleSkillContentChange(index, e.target.value)}
                                                                placeholder="Název pozice"
                                                            />
                                                            <span className="focus-border"></span>
                                                        </div>
                                                    </td>

                                                    <td className="slider-cell">
                                                        <div className="slider-wrapper">
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                value={skill.percentage}
                                                                onChange={(e) => handleSkillPercentageChange(index, e.target.value)}
                                                                className="custom-range"
                                                            />
                                                            <span className="slider-value">{skill.percentage}%</span>
                                                        </div>
                                                    </td>
                                                    <td>{skill.rating}*</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {hasSkillsChanged && (
                                        <div className="action-buttons" style={{ marginTop: '20px' }}>
                                            <button
                                                type="button"
                                                className="btn-action btn-cancel"
                                                onClick={handleCancelSkills}
                                            >
                                                Zrušit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-action btn-confirm"
                                                onClick={handleConfirmSkills}
                                            >
                                                Potvrdit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {isCommonAccount && (
                                <div className="profile-section">
                                    <h3>Preference</h3>
                                    <div className="input-group span-full">
                                        <EditableTextarea
                                            id="preferences"
                                            name="preferences"
                                            placeholder=" "
                                            rows={3}
                                            initialValue={dashboardData?.preference}
                                            onSave={handleSavePreference}
                                        />
                                        <span className="focus-border"></span>
                                    </div>
                                </div>
                            )}

                            {isCommonAccount && (
                                <div className="profile-section">
                                    <h3>Požadavky</h3>
                                    <div className="input-group span-full">
                                        <EditableTextarea
                                            id="requirements"
                                            name="requirements"
                                            placeholder=" "
                                            rows={3}
                                            initialValue={dashboardData?.request}
                                            onSave={handleSaveRequest}
                                        />
                                        <span className="focus-border"></span>
                                    </div>
                                </div>
                            )}

                            <AddressSection
                                data={{
                                    country: dashboardData?.country || '',
                                    region: dashboardData?.region || '',
                                    city: dashboardData?.city || '',
                                    address: dashboardData?.address || ''
                                }}
                                onSave={handleSaveAddress}
                            />

                            <div className="profile-section">
                                <div className="section-header">
                                    <h3>Kontakt</h3>
                                    <button
                                        type="button"
                                        className="btn-icon add-contact"
                                        title="Přidat další kontakt"
                                        onClick={addContactRow}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="form-grid">
                                    <div className="dynamic-list" id="emailList">
                                        {contacts.map((contact, index) => (
                                            <div className="contact-row" key={index}>
                                                <button
                                                    type="button"
                                                    className="btn-icon remove-btn"
                                                    title="Odstranit"
                                                    onClick={() => removeContactRow(index)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                    </svg>
                                                </button>

                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        name="contacts"
                                                        placeholder=" "
                                                        required
                                                        value={contact.content}
                                                        onChange={(e) => handleContactChange(index, e.target.value)}
                                                    />
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

                                    {hasContactsChanged && (
                                        <div className="action-buttons" style={{ marginTop: '20px' }}>
                                            <button
                                                type="button"
                                                className="btn-action btn-cancel"
                                                onClick={handleCancelContacts}
                                            >
                                                Zrušit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-action btn-confirm"
                                                onClick={handleConfirmContacts}
                                            >
                                                Potvrdit
                                            </button>
                                        </div>
                                    )}
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

                                    {/* Hlavní velká fotka */}
                                    <div className="main-photo">
                                        {selectedImage ? (
                                            <img src={selectedImage} alt="Hlavní fotografie" />
                                        ) : (
                                            <div className="placeholder-photo">Žádná fotka</div>
                                        )}
                                    </div>

                                    {/* Mřížka náhledů */}
                                    <div className="thumbnail-grid">
                                        {images.map((imgUrl, index) => (
                                            <div
                                                key={index}
                                                draggable={isEditing}
                                                onDragStart={(e) => {
                                                    if (!isEditing) {
                                                        e.preventDefault();
                                                        return;
                                                    }
                                                    dragItem.current = index;
                                                }}
                                                onDragEnter={() => {
                                                    if (!isEditing) return;
                                                    dragOverItem.current = index;
                                                }}
                                                onDragEnd={handleSort}
                                                onDragOver={(e) => e.preventDefault()}

                                                className={`thumbnail ${selectedImage === imgUrl ? 'active' : ''}`}
                                                onClick={() => handleSelectImage(imgUrl)}
                                            >
                                                <img src={imgUrl} alt={`Náhled ${index + 1}`} />
                                                {isEditing && (< button
                                                    type="button"
                                                    className="delete-btn"
                                                    title="Odstranit obrázek"
                                                    onClick={(e) => handleDeleteImage(index, e)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />

                                    <button
                                        type="button"
                                        className="btn btn-primary full-width"
                                        onClick={triggerFileInput}
                                    >
                                        Nahrát +
                                    </button>

                                    {hasPhotosChanged && (
                                        <div className="action-buttons" style={{ marginTop: '20px' }}>
                                            <button
                                                type="button"
                                                className="btn-action btn-cancel"
                                                onClick={handleCancelPhotos}
                                            >
                                                Zrušit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-action btn-confirm"
                                                onClick={handleConfirmPhotos}
                                            >
                                                Potvrdit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            </fieldset>

                            <div className="links">
                                <a onClick={handleLogout}>Odhlásit se</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;